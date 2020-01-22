import { FETCH_LOGIN_BEGIN, FETCH_LOGIN_SUCCESS, FETCH_LOGIN_FAIL, HANDLE_APPSTATE } from './types';
import { Platform, ToastAndroid } from 'react-native';
import { IOS_CLIENT_ID, IOS_STANDALONE_APP_CLIENT_ID, ANDROID_CLIENT_ID, ANDROID_STANDALONE_APP_CLIENT_ID  } from 'react-native-dotenv';
import { API_URL, API_URLL, WEB_URL} from 'react-native-dotenv';
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

export const fetchLoginSuccess = ( userDetails ) => ({
	type : FETCH_LOGIN_SUCCESS,
	payload : { userDetails }
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
			'/manual/login', //endpoint url
			{//data
				emailAddress : dataObject.emailAddress,
				password : dataObject.password
			},
			{//config
				baseURL : API_URL,
				headers: { 'Content-Type': 'application/json' }
			}
		)
		.then (dataObject => {
			if (dataObject.data.status == true) {
				//Analytics
			
				
				//Analytics
				setTimeout( 
					()=> {
						dispatch(fetchLoginSuccess(dataObject.data)); 
						// NavigationService.navigate('Leads'); 
					},
					100
				);		
			} else {
				setTimeout( 
					() => {
						dispatch(fetchLoginFail(`Log in failed. Username or password might be incorrect. Try again or click "forgot your password".`));
					},
					100
				);
				Toast.show({
					text: `Log in failed. Username or password might be incorrect. Try again or click "forgot your password".`,
					duration : 3000,
					type : 'danger'
				})
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
				

				axios.get(API_URL + 'get-user-info-via-email/' + result.user.email)
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
		axios.get(API_URL + 'user/get/plan-type/' + email)
		// .then( (response) => { return response.json() })
		.then( (dataObject) => {
			if (dataObject.data.status == true) {

				//CHECKING EMAIL ON PROSPERNA-DB
					axios.get(API_URL + 'user/exist?emailAddress=' + email)
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