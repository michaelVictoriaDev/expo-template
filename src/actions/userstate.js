import { FETCH_LOGIN_BEGIN, FETCH_LOGIN_SUCCESS, FETCH_LOGIN_FAIL, HANDLE_APPSTATE } from './types';
import { Platform, ToastAndroid } from 'react-native';
import { PAYGWA_URL } from 'react-native-dotenv';
import { Google } from 'expo';
import * as GoogleSignIn from 'expo-google-sign-in';
import axios from 'react-native-axios';
import { Toast } from 'native-base';
import NavigationService from '../NavigationService'; /* <-
USED FOR NAVIGATING WITHOUT PROPS
	REFERENCES: 
	https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
	https://stackoverflow.com/questions/51822719/react-navigationhow-can-i-navigating-without-the-navigation-prop-without-war
*/


export const fetchLoginBegin = () => ({
	type: FETCH_LOGIN_BEGIN
})

export const fetchLoginSuccess = (accountIds, userPersonId, accountId, userName) => ({
	type: FETCH_LOGIN_SUCCESS,
	payload: { accountIds, userPersonId, accountId, userName }
})

export const fetchLoginFail = (error) => ({
	type: FETCH_LOGIN_FAIL,
	payload: { error }
})


// CHECK SIGN IN IN DATABASE ( MANUAL LOG IN )
export function fetchLogin(dataObject) {
	return dispatch => {
		//SHOW LOADING
		dispatch(fetchLoginBegin());
		axios.post(
			PAYGWA_URL + '/api/v1/user-login', //endpoint url
			{//data
				webUserPersonIdTypeCode: 'WEB',
				userName: dataObject.emailAddress,
				password: dataObject.password,
				webAccessFlag: 'ALWD',
				wrongPasswordCountPersonCharTypeCode: 'WPCOUNT',
				cisDivision: 'GWA',
				wrongPasswordCountLimit: '5'
			},
			{//config

				headers: {
					'Content-Type': 'application/json',
					"origin": "https://gwadev.xtendly.com"
				}
			}
		)
			.then(response => {
				debugger
				console.log('labas', response.data.result)
				const loginSuccessful = response.data.result.loginSuccessful
				if (loginSuccessful == "true") {
					const premiseData = response.data.result.premiseData;
					console.log('loob',response.data.result)
					console.log(premiseData)
					const personId = premiseData[0].PersonID
					debugger
					if (premiseData.length > 1) {
						var accountIds = []
						for (var count = 0; count < premiseData.length; count++) {
							accountIds.push([premiseData[count].AccountID, premiseData[count].PremiseInfo.replace(/,/g, ""), premiseData[count].customerClass])
						}
						console.log('accountIds', accountIds)
						var empty = ''
						dispatch(fetchLoginSuccess(accountIds, personId, empty, dataObject.emailAddress));
						// localStorage.setItem('accountIds', accountIds)
					}
					else {
						var accountId = []
						accountId.push([premiseData[0].AccountID, premiseData[0].PremiseInfo.replace(/,/g, ""), premiseData[0].customerClass])
						console.log('accountId', accountId)
						var empty = ''
						dispatch(fetchLoginSuccess(empty, personId, accountId, dataObject.emailAddress));
					}
				}


				
				const status = response.data.result.status

				console.log('loginSuccessful', loginSuccessful)
				console.log('status', status)
				if (!(status === null)) {
					if (loginSuccessful.toString() === "true") {
						// another call function

						// end function
						Toast.show({
							text: `Log in successfully.. Please wait.`,
							duration: 3000,
							type: 'success'
						})
						NavigationService.navigate('MyAccounts');
					}
					else {
						var errMsg = ""
						if (status.loginMessage === "Exceeded number of wrong password") {
							errMsg = "You have exceeded the maximum number of failed login attempts"
						}
						else {
							errMsg = status.loginMessage
						}

						// console.log('errMsg',status.loginMessage)
						dispatch(fetchLoginFail(String(error)));
						Toast.show({
							text: errMsg,
							duration: 3000,
							type: 'danger'
						})
						
					}
				}
				else {
					dispatch(fetchLoginFail(String(error)));
					Toast.show({
						text: `Server not responding.Please try again later.`,
						duration: 3000,
						type: 'danger'
					})

				}


			})
			.catch(error => {

				dispatch(fetchLoginFail(String(error)));
				Toast.show({
					text: 'Server not responding. Please try again later.',
					duration: 3000,
					type: 'danger'
				})
			});
	}
}

export const appStateHandler = (appState) => ({
	type: HANDLE_APPSTATE,
	globalAppState: appState
})