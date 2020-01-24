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
	type : FETCH_LOGIN_BEGIN
})

export const fetchLoginSuccess = ( userDetails, userPersonId) => ({
	type : FETCH_LOGIN_SUCCESS,
	payload: { userDetails, userPersonId }
})

export const fetchLoginFail = ( error ) => ({
	type : FETCH_LOGIN_FAIL,
	payload : { error }
})


// CHECK SIGN IN IN DATABASE ( MANUAL LOG IN )
export function fetchLogin (dataObject) {
	return dispatch => {
		//SHOW LOADING
		dispatch(fetchLoginBegin());
		axios.post(
			PAYGWA_URL+'/api/v1/user-login', //endpoint url
			{//data
				webUserPersonIdTypeCode: 'WEB',
				userName : dataObject.emailAddress,
				password : dataObject.password,
				webAccessFlag: 'ALWD',
				wrongPasswordCountPersonCharTypeCode: 'WPCOUNT',
				cisDivision: 'GWA',
				wrongPasswordCountLimit: '5'
			},
			{//config

				headers: { 'Content-Type': 'application/json' }
			}
		)
		.then (response => {

			const loginSuccessful = response.data.result.loginSuccessful
			const status = response.status
			if (!(status === null)) {
				if (loginSuccessful.toString() === "true") {
					Toast.show({
						text: `Log in successfully..Please wait.`,
						duration: 3000,
						type: 'success'
					})
					NavigationService.navigate('MyAccounts');
				}
				else {
					let errMsg = ""
					if (status.loginMessage === "Exceeded number of wrong password") {
						errMsg = "You have exceeded the maximum number of failed login attempts"
					}
					else {
						errMsg = status.loginMessage
					}

					Toast.show({
						text: errMsg,
						duration: 3000,
						type: 'danger'
					})
				}
			}
			else {
				Toast.show({
					text: `Server not responding.Please try again later.`,
					duration: 3000,
					type: 'danger'
				})

			}
			const premiseData = response.data.result.premiseData;
			if (Array.isArray(premiseData)) {
				console.log('personId', premiseData[0].PersonID)
			}
			const personId = premiseData[0].PersonID
			if (response.data.result.loginSuccessful !== 'false') {
				if (premiseData.length > 1) {
					var accountIds = []
					for (var count = 0; count < premiseData.length; count++) {
						accountIds.push([premiseData[count].AccountID, premiseData[count].PremiseInfo.replace(/,/g, ""), premiseData[count].customerClass])
					}
					// console.log('accountIds', accountIds)
					dispatch(fetchLoginSuccess(accountIds, personId )); 
					// localStorage.setItem('accountIds', accountIds)
				}
				else {
					var accountId = []
					accountId.push([premiseData[0].AccountID, premiseData[0].PremiseInfo.replace(/,/g, ""), premiseData[0].customerClass])
					// console.log('accountId', accountId)
					dispatch(fetchLoginSuccess(accountIds, personId)); 
					// localStorage.setItem('accountId', accountId)
				}
			}
		})
		.catch(error => {
				
				dispatch(fetchLoginFail(String(error)));
				Toast.show({
					text : 'Error in log-in: Account might not be existing. ' + error,
					duration : 3000,
					type : 'danger'
				})
		});
	}
}

//GMAIL SIGN IN
export function signInWithGoogleAsync () {
	
	return async (dispatch) => {
		//SHOW LOADING
		dispatch(fetchLoginBegin());

		try {
			// const result = await Google.logInAsync({
			// 	behavior: 'system',
			// 	iosClientId: IOS_CLIENT_ID,
			// 	iosStandaloneAppClientId: IOS_STANDALONE_APP_CLIENT_ID,
			// 	androidClientId: ANDROID_CLIENT_ID,
			// 	androidStandaloneAppClientId: ANDROID_STANDALONE_APP_CLIENT_ID,
			// 	scopes: [
			// 		'profile',
			// 		'email',
			// 	]
			// })

			await GoogleSignIn.askForPlayServicesAsync()
			.then( async () => {
				await GoogleSignIn.signOutAsync();
			});
			const result = await GoogleSignIn.signInAsync();
			if (result.type === 'success') {
				

				axios.get(PAYGWA_URL + 'get-user-info-via-email/' + result.user.email)
					.then(response => {
						if (response.data.data.success == true) {
							
							dispatch(getPlanTypeViaEmail(result.user.email, response.data.data.user));
							//  GET PLAN TYPE VIA GMAIL LOGIN (RETURNS TRUE OR FALSE)
							// AND CHECKING VIA EMAIL IF USER IS EXISTING IN PROSPERNA-DBASE
						}
						else {
							
							dispatch(fetchLoginFail('Error in Gmail Login: Failed to get user info. '))
							Toast.show({
								text: 'Error in Gmail Login: Failed to get user info. ',
								duration: 3000,
								type: 'danger'
							})
						}
					})
					.catch(error => {
						
						dispatch(fetchLoginFail(String(error)));
						Toast.show({
							text: 'Error in Gmail Login: ' + error,
							duration: 3000,
							type: 'danger'
						})
					})

			} else {
				
				dispatch(fetchLoginFail('GMAIL RESULT LOGIN: ' + result.type));
				Toast.show({
					text: 'GMAIL RESULT LOGIN: ' + result.type,
					duration: 3000,
					type: 'warning'
				})
			}
		} catch (error) {
			
			dispatch(fetchLoginFail(String(error)));
			Toast.show({
				text: 'GMAIL Login error: ' + error,
				duration: 3000,
				type: 'danger'
			})
		}
	}
}

//GET USER PLAN TYPE VIA EMAIL (IF USER USED GMAIL TO LOGIN)
export const getPlanTypeViaEmail = (email, fetchedUserInfo) => {
	return dispatch => {
		axios.get(PAYGWA_URL + 'user/get/plan-type/' + email)
		// .then( (response) => { return response.json() })
		.then( (dataObject) => {
			if (dataObject.data.status == true) {

				//CHECKING EMAIL ON PROSPERNA-DB
					axios.get(PAYGWA_URL + 'user/exist?emailAddress=' + email)
					// .then((response) => response.json())
					.then((responseJson) => {
						switch (responseJson.data) {
							case -1:
								
								dispatch(fetchLoginFail('Could not sign in at the moment, Sorry for the inconvenience.'));
								Toast.show({
									text : 'Could not sign in at the moment, Sorry for the inconvenience.',
									duration : 3000,
									type : 'warning'
								})
								break
							case 0:
								
								dispatch(fetchLoginFail('Your email does not exist!'));
								Toast.show({
									text : 'Your email does not exist!',
									duration : 3000,
									type : 'danger'
								})
								break
							case 1:
								//Analytics
								
							
								//Analytics
								let combineduserDetails = Object.assign(fetchedUserInfo,dataObject.data);
								dispatch(fetchLoginSuccess(combineduserDetails));
								// NavigationService.navigate('Leads');
								break
						}
					}).catch((error) => {
						ToastAndroid.show(String(error), ToastAndroid.LONG);
						
						dispatch(fetchLoginFail(String(error)));
						Toast.show({
							text : 'ERROR: Failed to get account info. Please try again.',
							duration : 3000,
							type : 'danger'
						})
						throw error
					})
			} else {
				
				dispatch(fetchLoginFail('ERROR: Invalid account/non-existing email. Please try again.'));
				Toast.show({
					text : 'ERROR: Invalid account/non-existing email. Please try again.',
					duration : 3000,
					type : 'danger'
				})
			}
		}).catch((error) => {
			
			dispatch(fetchLoginFail(error));
			Toast.show({
				text : 'ERROR: Failed to get plan type via GMAIL account. Please try again.',
				duration : 3000,
				type : 'danger'
			})
			throw error
		})
	}
}

export const appStateHandler = (appState) => ({
	type : HANDLE_APPSTATE,
	globalAppState : appState
})