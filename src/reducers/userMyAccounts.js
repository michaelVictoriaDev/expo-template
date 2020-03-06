import {
    SAVE_ACCOUNT_ID,
    SAVE_PREMISE_ADDRESS,
    FETCH_USER_DETAILS,
    FETCH_USER_OLD_DETAILS,
    FETCH_EDIT_SECURITY_QUESTIONS,
    FETCH_COUNTRIES,
    FETCH_LATEST_BILL,
    FETCH_CONSUMPTION_DETAILS,
    FETCH_BILL_LIST,
    FETCH_SURVEY_LIST,
    SAVE_VIEW_BILL_DATA,
    SAVE_ORDER_DATA,
    FETCH_PAYMENT_HISTORY_LIST
} from '../actions/types';

initialState = {
    selectedAccountId: '',
    selectedPremAdd: '',
    userAccountDetails: [],
    userOldDataDetails: [],
    securityQuestions: [],
    countries: [],
    latestBill: [],
    consumptionDetails: [],
    billList: [],
    surveyList: [],
    viewBillData: [],
    orderData: [],
    payHistoryList: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SAVE_ACCOUNT_ID:
            return {
                ...state,
                selectedAccountId: action.payload
            }
        case SAVE_PREMISE_ADDRESS:
            return {
                ...state,
                selectedPremAdd: action.payload
            }
        case FETCH_USER_DETAILS:
            return {
                ...state,
                userAccountDetails: action.payload
            }
        case FETCH_USER_OLD_DETAILS:
            return {
                ...state,
                userOldDataDetails: action.payload
            }
        case FETCH_EDIT_SECURITY_QUESTIONS:
            return {
                ...state,
                securityQuestions: action.payload
            }
        case FETCH_COUNTRIES:
            return {
                ...state,
                countries: action.payload
            }
        case FETCH_LATEST_BILL:
            return {
                ...state,
                latestBill: action.payload
            }
        case FETCH_CONSUMPTION_DETAILS:
            return {
                ...state,
                consumptionDetails: action.payload
            }
        case FETCH_BILL_LIST:
            return {
                ...state,
                billList: action.payload
            }
        case FETCH_SURVEY_LIST:
            return {
                ...state,
                surveyList: action.payload
            }
        case SAVE_VIEW_BILL_DATA:
            return {
                ...state,
                viewBillData: action.payload
            }
        case SAVE_ORDER_DATA:
            return {
                ...state,
                orderData: action.payload
            }
        case FETCH_PAYMENT_HISTORY_LIST:
            return {
                ...state,
                payHistoryList: action.payload
            }
        default:
            return state;
    }
}