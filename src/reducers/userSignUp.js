import {
    FETCH_ADDRESS_DETAILS,
    FETCH_SECURITY_QUESTIONS,
    FETCH_CONTACT_NUMBERS,
    FETCH_BASIC_DETAILS,
    FETCH_ACOV_ADDRESS_DETAILS,
    FETCH_PREM_ADDRESS_DETAILS   
} from '../actions/types';
import { AppState } from 'react-native';

initialState = {
    status: null,
    userBasicInfo: [],
    userAddressDetails: [],
    securityQuestions: [],
    userContactNumbers: [],
    userAccountID: null,
    userAcovAddressDetails: [],
    userPremAddressDetails: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_BASIC_DETAILS:
            return {
                ...state,
                userBasicInfo: action.payload
            }
        case FETCH_ADDRESS_DETAILS:
            return {
                ...state,
                userAddressDetails: action.payload
            }
        case FETCH_SECURITY_QUESTIONS:
            return {
                ...state,
                securityQuestions: action.payload
            }
        case FETCH_CONTACT_NUMBERS:
            return {
                ...state,
                userContactNumbers: action.payload
            }
        case FETCH_ACOV_ADDRESS_DETAILS:
            return {
                ...state,
                userAcovAddressDetails: action.payload
            }
        case FETCH_PREM_ADDRESS_DETAILS:
            return {
                ...state,
                userPremAddressDetails: action.payload
            }
        default:
            return state;
    }
}