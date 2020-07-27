import axios from 'axios';
import {
    FETCH_ADDRESS_DETAILS,
    FETCH_SECURITY_QUESTIONS,
    FETCH_CONTACT_NUMBERS,
    FETCH_BASIC_DETAILS,
    FETCH_ACOV_ADDRESS_DETAILS,
    FETCH_PREM_ADDRESS_DETAILS 
} from './types';
import { Toast } from 'native-base';
import { PAYGWA_URL, DASHBOARD_URL, PAYNOW_URL } from 'react-native-dotenv';

import NavigationService from '../NavigationService'; /* <-
USED FOR NAVIGATING WITHOUT PROPS
	REFERENCES: 
	https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
	https://stackoverflow.com/questions/51822719/react-navigationhow-can-i-navigating-without-the-navigation-prop-without-war
*/


export const forgotPassword = (postData) => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .post(PAYGWA_URL + '/api/v1/forgot-password',
                {
                    accountId: postData.accountId,
                    division: 'GWA',
                    username: postData.username
                },
                {
                    headers: {
                    'Content-Type':'application/json'
                    }
                })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
    })
}

export const forgotUsername = (postData) => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .post(PAYGWA_URL + '/api/v1/forgot-username',
                {
                    accountId: postData.accountId,
                    emailAddress: postData.emailAddress,
                    division: 'GWA',
                },
                {
                    headers: {
                    'Content-Type':'application/json'
                    }
                })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
    });
}

export const getOtherDetails = (personId) => dispatch => {
    return axios
        .post(PAYGWA_URL + '/api/v1/other-details',
            {
                transactionType: 'READ',
                PersonID: personId
            },
            {
                headers: {
                    'Content-Type':'application/json'
                    }
            })
        .then(response => {
            let basicDetails = {}, addressDetails = {}, contactNumbers = {}
            let strPostal = response.data.result.customerDetails.Postal
            let resContactNumbers = response.data.result.contactNumbers
            basicDetails.personId = response.data.result.customerDetails.PersonID
            basicDetails.fullName = response.data.result.customerDetails.Name
            basicDetails.emailAddress = response.data.result.customerDetails.EmailID
            addressDetails.address1 = response.data.result.customerDetails.Address
            addressDetails.city = response.data.result.customerDetails.City
            addressDetails.country = response.data.result.customerDetails.Description
            addressDetails.postal = strPostal.substr(0, strPostal.indexOf('-')) || strPostal
            addressDetails.state = response.data.result.customerDetails.StateDescription

            for (var count = 0; count < resContactNumbers.length; count++) {
                if (resContactNumbers[count].PhoneType === 'MOBILE' && (resContactNumbers.mobilePhone === undefined || resContactNumbers.mobilePhone === "")) {
                    contactNumbers.mobilePhone = resContactNumbers[count].PhoneNumber
                    contactNumbers.mobilePhoneSeq = resContactNumbers[count].Sequence
                }
                else if (resContactNumbers[count].PhoneType === 'HOME-PHONE' && (resContactNumbers.homePhone === undefined || resContactNumbers.homePhone === "")) {
                    contactNumbers.homePhone = resContactNumbers[count].PhoneNumber
                    contactNumbers.homePhoneSeq = resContactNumbers[count].Sequence
                }
                else if (resContactNumbers[count].PhoneType === 'BUSN-PHONE' && (resContactNumbers.workPhone === undefined || resContactNumbers.workPhone === "")) {
                    contactNumbers.workPhone = resContactNumbers[count].PhoneNumber
                    contactNumbers.workPhoneSeq = resContactNumbers[count].Sequence
                }
            }

            dispatch({
                type: FETCH_BASIC_DETAILS,
                payload: basicDetails
            })
            dispatch({
                type: FETCH_ADDRESS_DETAILS,
                payload: addressDetails
            })
            dispatch({
                type: FETCH_SECURITY_QUESTIONS,
                payload: response.data.result.securityQuestions
            })
            dispatch({
                type: FETCH_CONTACT_NUMBERS,
                payload: contactNumbers
            })
        }
        )
}

export const signUpUser = (postData) => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .post(PAYGWA_URL + '/api/v1/sign-up-user',
                {
                    personId: postData.personId,
                    first_name: postData.first_name,
                    last_name: postData.last_name,
                    IDNumber: postData.username,
                    WebPassword: postData.password,
                    // line_1: postData.line_1,
                    // line_2: postData.line_2,
                    // city: postData.city,
                    // province: postData.province,
                    // zipcode: postData.zipcode,
                    // country: postData.country,
                    emailAddress: postData.email_address,
                    home: postData.home_number,
                    mobile: postData.mobile_number,
                    work: postData.work_number,
                    CharacteristicValue: postData.security_question_val,
                    Answer: postData.security_answer,
                    isDeletedHome: postData.isDeletedHome,
                    isDeletedMobile: postData.isDeletedMobile,
                    isDeletedWork: postData.isDeletedWork,
                    sequenceHome: postData.homeSeq,
                    sequenceMobile: postData.mobileSeq,
                    sequenceWork: postData.workSeq,
                },
                {
                    headers: {
                    'Content-Type':'application/json'
                    }
                })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            })
    });
}

export const checkAccountNumber = (accountId) => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                PAYGWA_URL + '/api/v1/check-account-number',
                {
                    accountId: accountId,
                    division: 'GWA',
                },
                {
                    headers: {
                    'Content-Type':'application/json'
                    }
                }
            )
            .then(function (response) {
                resolve(response.data.result);
            })
            .catch(error => {
                reject(error);
            })
    });
}

export const checkUsername = (username) => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .post(PAYGWA_URL + '/api/v1/check-username',
                {
                    username: username
                },
                {
                    headers: {
                    'Content-Type':'application/json'
                    }
                }
            )
            .then(function (response) {
                resolve(response.data.result);
            })
            .catch(error => {
                reject(error);
            })
    });
}

export const loginUser = (postData) => dispatch => {
    localStorage.setItem('username', postData.username)

    return new Promise((resolve, reject) => {
        axios
            .post(
                PAYGWA_URL + '/api/v1/user-login',
                {
                    webUserPersonIdTypeCode: 'WEB',
                    userName: postData.username,
                    password: postData.password,
                    webAccessFlag: 'ALWD',
                    wrongPasswordCountPersonCharTypeCode: 'WPCOUNT',
                    cisDivision: 'GWA',
                    wrongPasswordCountLimit: '5'
                },
                {
                    headers: {
                    'Content-Type':'application/json'
                    }
                }
            )
            .then(function (response) {
                const premiseData = response.data.result.premiseData;
                if (Array.isArray(premiseData)) {
                    localStorage.setItem('personId', premiseData[0].PersonID)
                }
                if (response.data.result.loginSuccessful !== 'false') {
                    if (premiseData.length > 1) {
                        var accountIds = []
                        for (var count = 0; count < premiseData.length; count++) {
                            accountIds.push([premiseData[count].AccountID, premiseData[count].PremiseInfo.replace(/,/g, ""), premiseData[count].customerClass])
                        }
                        localStorage.setItem('accountIds', accountIds)
                    }
                    else {
                        var accountId = []
                        accountId.push([premiseData[0].AccountID, premiseData[0].PremiseInfo.replace(/,/g, ""), premiseData[0].customerClass])
                        localStorage.setItem('accountId', accountId)
                    }
                }
                resolve(response.data.result);
            })
            .catch(error => {
                reject(error);
            })
    });
}

export const getPremiseInfo = (accountId) => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                PAYGWA_URL + '/api/v1/premise-info',
                {
                    accountId: accountId,
                },
                {
                    headers: {
                    'Content-Type':'application/json'
                    }
                }
            )
            .then(function (response) {
                const arrPremAddress = (response.data.result.PremiseInfo).split(",")
                const addressDetails = {
                    address1: arrPremAddress[0],
                    city: arrPremAddress[1].trim(),
                    state: arrPremAddress[2].trim(),
                    postal: arrPremAddress[3].trim(),
                    country: "United States of America"
                }
                dispatch({
                    type: FETCH_PREM_ADDRESS_DETAILS,
                    payload: addressDetails
                })
                resolve("Success");
            })
            .catch(error => {
                reject(error);
            })
    });
}

export const getAcovInfo = (postData) => dispatch => {
    dispatch({
        type: FETCH_ACOV_ADDRESS_DETAILS,
        payload: postData
    })
}