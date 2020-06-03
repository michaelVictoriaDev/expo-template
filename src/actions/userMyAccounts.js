import axios from 'axios';
import {
    SAVE_ACCOUNT_ID,
    SAVE_PREMISE_ADDRESS,
    FETCH_USER_DETAILS,
    FETCH_USER_OLD_DETAILS,
    FETCH_EDIT_SECURITY_QUESTIONS,
    FETCH_COUNTRIES, FETCH_LATEST_BILL,
    FETCH_CONSUMPTION_DETAILS,
    FETCH_BILL_LIST,
    FETCH_SURVEY_LIST,
    SAVE_VIEW_BILL_DATA,
    SAVE_ORDER_DATA,
    FETCH_PAYMENT_HISTORY_LIST
} from './types';
import { Toast } from 'native-base';
import { PAYGWA_URL, DASHBOARD_URL, PAYNOW_URL } from 'react-native-dotenv';

import NavigationService from '../NavigationService'; /* <-
USED FOR NAVIGATING WITHOUT PROPS
	REFERENCES: 
	https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
	https://stackoverflow.com/questions/51822719/react-navigationhow-can-i-navigating-without-the-navigation-prop-without-war
*/


function saveToPayEezy(postData) {
     
    return axios
        .post(PAYNOW_URL + '/api/v1/payeezy',
            {
                amount: postData.subtotal,
                card_num: postData.cardDetails.cardNumber,
                exp_date: postData.cardDetails.validExpDate,
                card_holder: postData.cardDetails.cardHolderName,
                CAVV: postData.cardDetails.cvv,
                custome_ref: postData.username
            },
            {
                headers: { 'Content-Type': 'application/json' }
            })
}


export const savePaymentData = (postData) => dispatch => {
    console.log("postDatapostDatapostDatapostData", postData)
    let arrSavePaymentToCCBRequests = [], arrSaveToMarketingDBRequests = [], accountIdsList = "";
    const accountSummary = postData.accountSummary
    for (let count = 0; count < accountSummary.length; count++) {
        if ((accountSummary[count].amountToBePaid > 0)) {
            accountIdsList += (accountSummary[count].accID + ', ')
        }
    }
     
    return new Promise((resolve, reject) => {
        axios.all([saveToPayEezy(postData)])
            .then(axios.spread(
                async (saveToPayEezyResponse) => {
                    const payEezyResult = saveToPayEezyResponse.data.result
                    const transDate = doTheSearch("DATE/TIME", payEezyResult)
                    const arrTransDate = transDate.split(" ")
                    let finalTransDate = arrTransDate[1] + "-" + arrTransDate[2] + "-" + arrTransDate[3]
                    let d = new Date(finalTransDate);
                    finalTransDate = "20" + arrTransDate[3] + "/" + (d.getMonth() + 1) + "/" + arrTransDate[1]
                    let paymentTotal = 0
                    for (let count = 0; count < accountSummary.length; count++) {
                        if ((accountSummary[count].amountToBePaid > 0)) {
                            paymentTotal++;
                        }
                    }
                    let receiptCount = 1;
                    for (let count = 0; count < accountSummary.length; count++) {
                        if ((accountSummary[count].amountToBePaid > 0)) {

                            if (paymentTotal === 1) {
                                const recepitNum = payEezyResult.data.Reference_No
                                arrSavePaymentToCCBRequests.push(savePaymentToCCB(postData.usedCC, recepitNum, accountSummary[count].accID, accountSummary[count].amountToBePaid, payEezyResult))
                            }
                            else {
                                const str = payEezyResult.data.Reference_No + "-" + (receiptCount);
                                const recepitNum = str.substring(str.length - 14, str.length);
                                arrSavePaymentToCCBRequests.push(savePaymentToCCB(postData.usedCC, recepitNum, accountSummary[count].accID, accountSummary[count].amountToBePaid, payEezyResult))
                            }
                            receiptCount++;
                        }
                    }
                    const [sendPaymentStatEmailResponse, saveOverallPaymentResponse, savePaymentToCCBResponse] = await Promise.all([
                        sendPaymentStatEmail(postData, accountIdsList, payEezyResult, transDate),
                        saveOverallPayment(postData, payEezyResult, finalTransDate),
                        arrSavePaymentToCCBRequests
                    ]);
                    const emailStat = sendPaymentStatEmailResponse.soapenvBody.soapenvFault.detail.ouafFault.ResponseStatus === "F" ? true : true;
                    receiptCount = 1;
                    const secondReq = setInterval(async () => {
                        if (emailStat && saveOverallPaymentResponse.result === "Success") {
                            for (let count = 0; count < accountSummary.length; count++) {
                                if ((accountSummary[count].amountToBePaid > 0)) {
                                    const status = payEezyResult.data.Transaction_Approved === "true" ? "PAID" : "DECLINED"
                                    if (paymentTotal === 1) {
                                        const recepitNum = payEezyResult.data.Reference_No
                                        arrSaveToMarketingDBRequests.push(savePaymentToMarketingDB(status, recepitNum, postData, payEezyResult, finalTransDate, accountSummary[count].accID, saveOverallPaymentResponse.overallId, accountSummary[count].amountToBePaid))
                                    }
                                    else {
                                        const str = payEezyResult.data.Reference_No + "-" + (receiptCount);
                                        const recepitNum = str.substring(str.length - 14, str.length);
                                        arrSaveToMarketingDBRequests.push(savePaymentToMarketingDB(status, recepitNum, postData, payEezyResult, finalTransDate, accountSummary[count].accID, saveOverallPaymentResponse.overallId, accountSummary[count].amountToBePaid))
                                    }
                                    receiptCount++;
                                }
                            }
                            const [saveToMarketingDBRequestsResponse] = await Promise.all([
                                arrSaveToMarketingDBRequests
                            ]);
                            if (savePaymentToCCBResponse.length === arrSavePaymentToCCBRequests.length) {
                                clearInterval(secondReq);
                                console.log("save payment to ccb done!");
                                const thirdReq = setInterval(async () => {
                                    if (arrSaveToMarketingDBRequests.length === saveToMarketingDBRequestsResponse.length) {
                                        clearInterval(thirdReq);
                                        resolve(payEezyResult)
                                    }
                                }, 1000);
                            }
                        }
                    }, 1000);

                })
            )
            .catch((error) => {
                reject(error)
            })
    })
}

function fetchLatestPayment(accountId, tenderType) {
     
    return axios
        .post(DASHBOARD_URL + '/api/v1/validate',
            {
                accountId: accountId,
                tenderType: tenderType
            },
            {
                headers: { 'Content-Type': 'application/json' }
            })
}
export const saveOrderData = (postData) => dispatch => {
    const orderData = {
        accountSummary: postData.accountSummary,
        subTotal: postData.subTotal
    }
    dispatch({
        type: SAVE_ORDER_DATA,
        payload: orderData
    })
}
function savePaymentToCCB(recepitNum, accountId, amount, payEezyResult) {
     
    return new Promise((resolve, reject) => {
        axios
            .post(PAYNOW_URL + '/api/v1/make-payment',
                {
                    accountId: accountId,
                    amount: amount,
                    method: 'PG001',
                    cardCharge: '0.00',
                    paymentSource: 'CCV',
                    receiptNum: recepitNum,
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
                Toast.show({
                    text: 'savePaymentToCCB, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    });
}
function savePaymentToMarketingDB(status, recepitNum, postData, payEezyResult, finalTransDate, accountId, overallId, amountToBePaid) {
     
    return new Promise((resolve, reject) => {
        axios
            .post(PAYNOW_URL + '/api/v1/save-payment',
                {
                    overall_id: overallId,
                    payment_date: finalTransDate,
                    account_number: accountId,
                    amount: amountToBePaid,
                    status: status,
                    paid_by: postData.username,
                    receipt: recepitNum
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
                Toast.show({
                    text: 'savePaymentToMarketingDB, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    });
}
function saveOverallPayment(postData, payEezyResult, finalTransDate) {
     
    return new Promise((resolve, reject) => {
        axios
            .post(PAYNOW_URL + '/api/v1/save-overall-payment',
                {
                    username: postData.username,
                    payment_date: finalTransDate,
                    receipt: payEezyResult.data.Reference_No,
                    transaction_tag: payEezyResult.data.Transaction_Tag,
                    pay_eezy_seq_num: payEezyResult.data.SequenceNo,
                    amount: postData.subtotal,
                    process_message: payEezyResult.data.EXact_Message,
                    bank_response: payEezyResult.data.Bank_Message,
                    mode: postData.mode === "admin" ? "Phoned-In" : "Online",
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
                Toast.show({
                    text: 'saveOverallPayment, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    });
}
function sendPaymentStatEmail(postData, accountIdsList, payEezyResult, transDate) {
    const auth_num = payEezyResult.data.Authorization_Num.length === 0 ? "" : payEezyResult.data.Authorization_Num
     
    return new Promise((resolve, reject) => {
        axios
            .post(PAYNOW_URL + '/api/v1/confirm-email',
                {
                    accountNum: accountIdsList,
                    email: postData.cardDetails.confirmationEmail,
                    receiptNum: payEezyResult.data.Reference_No,
                    cardholderName: payEezyResult.data.CardHoldersName,
                    confirmationNum: payEezyResult.data.Transaction_Tag,
                    transacDate: transDate,
                    creditNum: payEezyResult.data.Card_Number,
                    authorizationNum: auth_num,
                    amount: postData.subtotal,
                    userFullName: postData.userFullName
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
                Toast.show({
                    text: 'sendPaymentStatEmail, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    });
}

export const validateVisaPayment = (accountId, usedCC) => dispatch => {
    const tenderType = usedCC === "visa" ? 'CCV' : usedCC === "discover" ? 'CCD' : usedCC === "master" ? 'CCM' : "" //CCV if VISA, CCD for Discover, CCM for MasterCard
    let arrLatestPayment = []
    for (let count = 0; count < 1; count++) {
        arrLatestPayment.push(fetchLatestPayment(accountId, tenderType))
    }
     
    return new Promise((resolve, reject) => {
        axios.all(arrLatestPayment)
            .then((response) => {
                const resLatestPayment = response[0];
                let arrResults = []
                resolve(resLatestPayment)
            })
            .catch((error) => {
                reject(error)
            })
    });
}
export const fetchMultipleLatestBill = (accountId) => dispatch => {
    let arrLatestBillRequests = [], arrLatestPayment = []
    for (let count = 0; count < accountId.length; count++) {
        arrLatestBillRequests.push(fetchLatestBill(accountId[count][0]))
        // arrLatestPayment.push(fetchLatestPayment(accountId[count][0]))
    }

    return new Promise((resolve, reject) => {
        axios.all([arrLatestBillRequests,]) //arrLatestPayment
            .then((response) => {
                const resLatestBillRequests = response[0];
                const resLatestPayment = response[1];
                let accountSummary = []
                for (let count = 0; count < resLatestBillRequests.length; count++) {
                    resLatestBillRequests[count].then(billResult => {
                        // resLatestPayment[count].then(paymentResult => {
                        const billResponse = billResult.data.result
                        let billDate = new Date(billResponse.date.billDate);
                        let strbillDate = billDate.toDateString().split(' ').slice(1).join(' ');
                        let resbillDate = strbillDate.split(" ");
                        let finalBillDate = resbillDate[1] + ' ' + resbillDate[0] + ' ' + resbillDate[2];
                        let dueDate = new Date(billResponse.date.dueDate);
                        let strdueDate = dueDate.toDateString().split(' ').slice(1).join(' ');
                        let resdueDate = strdueDate.split(" ");
                        let finaldueDate = resdueDate[1] + ' ' + resdueDate[0] + ' ' + resdueDate[2];
                        // const paymentResponse = paymentResult.data.result.data
                        let isDueDate = "", arrearsTotal = 0;
                        const arrears = billResponse.arrears.arrears
                        for (let count = 0; count < arrears.length; count++) {
                            if (!arrears[count].Label.includes("new charges") && arrears[count].Label != "") {
                                arrearsTotal = arrearsTotal + parseInt(arrears[count].ArrearsAmount)
                            }
                        }
                        let isDueDateRed = false
                        if (arrearsTotal === 0) {
                            let today = new Date();
                            today.setHours(0, 0, 0, 0);
                            let dueDate1 = new Date(dueDate);
                            dueDate1.setHours(0, 0, 0, 0);
                            if (dueDate <= today) {
                                isDueDateRed = true
                            }
                            else if (dueDate > today) {
                                isDueDateRed = false
                            }
                        }
                        else {
                            finaldueDate = "Due Now"
                            isDueDateRed = true
                        }

                        accountSummary.push(
                            {
                                checked: false,
                                validAmountToBePaid: true,
                                accID: accountId[count][0],
                                serviceLocation: billResponse.arrears.details.PremiseInfo,
                                billDate: finalBillDate,
                                amount: billResponse.arrears.details.CurrentBalance,
                                isDueDateRed: isDueDateRed,
                                dueDate: finaldueDate,
                                amountToBePaid: "0",
                                className: accountId[count][2],
                                alreadyPaid: 0,
                                fullName: billResponse.firstName + " " + billResponse.lastName,
                                arrears: billResponse.arrears,
                                arrearsTotal: arrearsTotal,
                                usedCC: ""
                            }
                        )
                        // console.log("accountSummaryaccountSummaryaccountSummaryaccountSummaryaccountSummary",accountSummary)
                        // })
                    })
                }

                const orderData = {
                    accountSummary: accountSummary,
                    subTotal: 0
                }
                debugger
                return orderData;
            })
            .then((orderData) => {
                dispatch({
                    type: SAVE_ORDER_DATA,
                    payload: orderData
                })
                resolve(true)
            })
            .catch((error) => {
                reject(error)
                Toast.show({
                    text: 'fetchMultipleLatestBill, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    });
}

export const fetchMultipleAddOpptyRequest = (accountId, personId) => dispatch => {
    return new Promise((resolve, reject) => {
        axios.all([fetchUserDetails(personId), fetchLatestBill(accountId), fetchMonthlyBillConsumption(accountId)])
            .then(axios.spread(
                (fetchUserDetailsResponse, fetchLatestBillResponse, fetchMonthlyBillConsumptionResponse) => {
                    //for fetchUserDetailsResponse
                    var userDetails = {}
                    userDetails.fullName = fetchUserDetailsResponse.data.result.otherDetails.customerDetails.Name
                    userDetails.emailAddress = fetchUserDetailsResponse.data.result.otherDetails.customerDetails.EmailID
                    let contactNumbers = fetchUserDetailsResponse.data.result.otherDetails.contactNumbers;
                    for (var count = 0; count < contactNumbers.length; count++) {
                        if (contactNumbers[count].PhoneType === 'MOBILE' && (userDetails.mobilePhone === undefined || userDetails.mobilePhone === "")) {
                            userDetails.mobilePhone = contactNumbers[count].PhoneNumber
                            userDetails.mobilePhoneSeq = contactNumbers[count].Sequence
                        }
                        else if (contactNumbers[count].PhoneType === 'HOME-PHONE' && (userDetails.homePhone === undefined || userDetails.homePhone === "")) {
                            userDetails.homePhone = contactNumbers[count].PhoneNumber
                            userDetails.homePhoneSeq = contactNumbers[count].Sequence
                        }
                        else if (contactNumbers[count].PhoneType === 'BUSN-PHONE' && (userDetails.workPhone === undefined || userDetails.workPhone === "")) {
                            userDetails.workPhone = contactNumbers[count].PhoneNumber
                            userDetails.workPhoneSeq = contactNumbers[count].Sequence
                        }
                    }
                    userDetails.addressLine1 = fetchUserDetailsResponse.data.result.otherDetails.customerDetails.Address
                    userDetails.addressLine2 = fetchUserDetailsResponse.data.result.otherDetails.customerDetails.Address2
                    userDetails.city = fetchUserDetailsResponse.data.result.otherDetails.customerDetails.City
                    userDetails.state = fetchUserDetailsResponse.data.result.otherDetails.customerDetails.StateDescription
                    userDetails.stateInitials = fetchUserDetailsResponse.data.result.otherDetails.customerDetails.State
                    userDetails.postal = fetchUserDetailsResponse.data.result.otherDetails.customerDetails.Postal
                    userDetails.country = fetchUserDetailsResponse.data.result.otherDetails.customerDetails.Description
                    dispatch({
                        type: FETCH_USER_DETAILS,
                        payload: userDetails
                    })
                    //for fetchLatestBillResponse
                    var billDate = new Date(fetchLatestBillResponse.data.result.date.billDate);
                    var strbillDate = billDate.toDateString().split(' ').slice(1).join(' ');
                    var resbillDate = strbillDate.split(" ");
                    var finalBillDate = resbillDate[1] + ' ' + resbillDate[0] + ' ' + resbillDate[2];
                    var dueDate = new Date(fetchLatestBillResponse.data.result.date.dueDate);
                    var strDueDate = dueDate.toDateString().split(' ').slice(1).join(' ');
                    var resDueDate = strDueDate.split(" ");
                    var finalDueDate = resDueDate[1] + ' ' + resDueDate[0] + ' ' + resDueDate[2];
                    var latestBill = {
                        billDate: finalBillDate,
                        totalAmount: fetchLatestBillResponse.data.result.amount,
                        dueDate: finalDueDate,
                    }
                    dispatch({
                        type: FETCH_LATEST_BILL,
                        payload: latestBill
                    })
                    const isHaveConsumptionChart = fetchMonthlyBillConsumptionResponse.data.result.status;
                    if(isHaveConsumptionChart === 'True'){
                        const data              = fetchMonthlyBillConsumptionResponse.data.result.data;
                        let consumptionDetails  = {};
                        let months              = [];
                        let amounts             = [];
                        let totalWaters           = [];
                        for(var count = 0; count < data.length; count++){
                            var startDate = (data[count][0].startReadDate).slice(5, 10);
                            var endDate   = (data[count][0].endReadDate).slice(5, 10);
                            var amount    = (data[count][0].billSegmentCurrentAmount);
                            var totalWater  = (Math.round(data[count][0].measuredQuantity));
                            months.push([(startDate.split("-")[0] + "/" + startDate.split("-")[1]),' - ',(endDate.split("-")[0] + "/" + endDate.split("-")[1])])
                            amounts.push((amount > 0) ? amount : 0)
                            totalWaters.push((totalWater > 0) ? totalWater : 0)
                        }
                        consumptionDetails.months    = months;
                        consumptionDetails.amounts   = amounts;
                        consumptionDetails.totalWater = totalWaters;
                        dispatch({
                            type:    FETCH_CONSUMPTION_DETAILS,
                            payload: consumptionDetails
                        })
                        const results = {
                            isHaveConsumptionChart: isHaveConsumptionChart,
                            dataFetched: true
                        }
                        resolve(results);
                    }
                    else{
                        const results = {
                            isHaveConsumptionChart: isHaveConsumptionChart,
                            dataFetched: true
                        }
                        resolve(results);
                    }
                })
            )
            .catch((error) => {
                reject(error)
                Toast.show({
                    text: 'fetchMultipleAddOpptyRequest, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    })
}
export const saveAccountId = (accountId) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: SAVE_ACCOUNT_ID,
            payload: accountId,
        })
        resolve(accountId)
    })
}

export const submitHelpAndSupport = (postData) => dispatch => {
    let personId = localStorage.getItem('personId') 
    return new Promise((resolve, reject) => {
        axios
            .post(
                DASHBOARD_URL + '/api/v1/help-and-support',
                {
                    cis_division: 'GWA',
                    accountId: postData.accountId,
                    personId: personId,
                    emailAddress: postData.emailAddress,
                    fullName: postData.fullName,
                    contactType: postData.contactType,
                    message: postData.message,
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            .then(function (response) {
                resolve(response.data.result.status);
            })
            .catch(error => {
                reject(error);
                Toast.show({
                    text: 'submitHelpAndSupport, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    });
}

export const getSequQuestions = () => dispatch => {
    return axios
        .get(PAYGWA_URL + '/api/v1/get-security-questions',
            {
                headers: { 'Content-Type': 'application/json' }
            })
        .then(response => {
            dispatch({
                type: FETCH_EDIT_SECURITY_QUESTIONS,
                payload: response.data.result
            })
        }
        )
}

export const getCountry = () => dispatch => {
    return axios
        .get(DASHBOARD_URL + '/api/v1/get-country',
            {
                headers: { 'Content-Type': 'application/json' }
            })
        .then(response => {
            dispatch({
                type: FETCH_COUNTRIES,
                payload: response.data.result
            })
        }
        )
}

export const fetchPaymentHistory = (accountId) => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                DASHBOARD_URL + '/api/v1/payment-history',
                {
                    accountId: accountId,
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            .then(function (response) {
                const billList = response.data.result;
                const billListTableData = []
                for (var count = 0; count < billList.length; count++) {
                    try {
                        billListTableData.push({
                            payment_date: billList[count].payment_date,
                            account_number: billList[count].account_number,
                            billTotalAmount: billList[count].billTotalAmount,
                            status: billList[count].status,
                            paid_by: billList[count].paid_by,
                            receipt_num: billList[count].receipt_num,
                            receiptTotalAmount: billList[count].receiptTotalAmount,
                        })
                    }
                    catch (ex) {
                        break
                    }
                }
                dispatch({
                    type: FETCH_PAYMENT_HISTORY_LIST,
                    payload: billListTableData
                })
                resolve(billListTableData)
            })
            .catch(error => {
                console.log(error);
                Toast.show({
                    text: 'fetchPaymentHistory, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    });
}

export const fetchBillsList = (accountId) => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                DASHBOARD_URL + '/api/v1/my-bills-list',
                {
                    accountId: accountId,
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            .then(function (response) {
                const billList = response.data.result;
                const billListTableData = []
                for (var count = 0; count < billList.length; count++) {
                    try {
                        var billDate = new Date(billList[count].ArrearsDate)
                        var strbillDate = billDate.toDateString().split(' ').slice(1).join(' ');
                        var resbillDate = strbillDate.split(" ");
                        var finalBillDate = resbillDate[1] + ' ' + resbillDate[0] + ' ' + resbillDate[2];
                        billListTableData.push({
                            billID: billList[count].Parent,
                            billDate: finalBillDate,
                            totalAmount: billList[count].TotalAmount
                        })
                    }
                    catch (ex) {
                        break
                    }
                }
                console.log("billListTableData", billListTableData)
                dispatch({
                    type: FETCH_BILL_LIST,
                    payload: billListTableData
                })
                resolve(billListTableData)
            })
            .catch(error => {
                reject(error);
                Toast.show({
                    text: 'fetchBillsList, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    });
}

function fetchMonthlyBillConsumption(accountId) {
    return axios
        .post(
            DASHBOARD_URL + '/api/v1/user-consumption-chart',
            {
                accountId: accountId,
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );
}

function fetchLatestBill(accountId) {
    return axios
        .post(DASHBOARD_URL + '/api/v1/user-latest-bill',
            {
                accountId: accountId
            },
            {
                headers: { 'Content-Type': 'application/json' }
            })
}

function fetchUserDetails(personId) {
    return axios
        .post(DASHBOARD_URL + '/api/v1/user-details',
            {
                personId: personId
            },
            {
                headers: { 'Content-Type': 'application/json' }
            })
};

export const updateUserPassword = (postData) => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                DASHBOARD_URL + '/api/v1/update-user-password',
                {
                    personId: postData.personId,
                    oldPassword: postData.oldPassword,
                    password: postData.password
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            .then(function (response) {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
                Toast.show({
                    text: 'fetchBillsList, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    });
}

export const updateUserDetails = (postData) => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                DASHBOARD_URL + '/api/v1/update-user-details',
                {
                    personId: postData.personId,
                    accountId: postData.accountId,
                    emailAddress: postData.emailAddress,
                    address1: postData.address1,
                    address2: postData.address2,
                    city: postData.city,
                    postal: postData.postal,
                    state: postData.stateInitials,
                    stateDesc: postData.stateDesc,
                    country: 'USA',
                    home: postData.home,
                    mobile: postData.mobile,
                    work: postData.work,
                    oldDateEmail: postData.oldDateEmail,
                    oldDateQuestion: postData.oldDateQuestion,
                    oldDateAnswer: postData.oldDateAnswer,
                    CharacteristicValue: postData.characteristicValue,
                    Answer: postData.answer,
                    sequenceHome: postData.homeSeq,
                    sequenceMobile: postData.mobileSeq,
                    sequenceWork: postData.workSeq,
                    isDeletedHome: postData.isDeletedHome,
                    isDeletedMobile: postData.isDeletedMobile,
                    isDeletedWork: postData.isDeletedWork
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            .then(function (response) {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
                Toast.show({
                    text: 'updateUserDetails, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    });
}

export const fetchOldUserDetails = (personId) => dispatch => {
    return axios
        .post(DASHBOARD_URL + '/api/v1/user-details-edit-account',
            {
                personID: personId,
                division: 'GWA'
            },
            {
                headers: { 'Content-Type': 'application/json' }
            })
        .then(response => {
            const oldData = response.data.result.otherDetails
            var userOldDetails = {}
            console.log("response.dataresponse.dataresponse.dataresponse.dataresponse.data", response.data)
            // userOldDetails.billAddressSource    = response.data.result.details.billAddressSource
            for (var count = 0; count < oldData.length; count++) {
                if (oldData[count].CharacteristicType === "CMSCAN") {
                    userOldDetails.oldDateAnswer = oldData[count].EffectiveDate
                    userOldDetails.oldAnswerSecuQues = oldData[count].AdhocCharacteristicValue
                }
                else if (oldData[count].CharacteristicType === "CMSCQUES") {
                    userOldDetails.oldDateSecuQuestion = oldData[count].EffectiveDate
                    userOldDetails.oldCharValueSecuQues = oldData[count].CharacteristicValue
                }
                else if (oldData[count].CharacteristicType === "CMOLDEML") {
                    userOldDetails.oldDateEmailAdd = oldData[count].EffectiveDate
                }
            }
            dispatch({
                type: FETCH_USER_OLD_DETAILS,
                payload: userOldDetails
            })
        }
        )
};

export const getListSurvey = () => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .get(DASHBOARD_URL + '/api/v1/get-list-survey',
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            .then(function (response) {
                console.log('getListSurvey response')
                console.log(response.data.result.surveyList)
                dispatch({
                    type: FETCH_SURVEY_LIST,
                    payload: response.data.result.surveyList
                })
                resolve(response.data.result.surveyList);
            })
            .catch(error => {
                reject(error);
                Toast.show({
                    text: 'getListSurvey, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    })
}

export const submitSurvey = (postData) => dispatch => {
    let fullName = postData.userInfo.fullName
    if (!fullName.includes(',')) {
        fullName = fullName.split(" ")[0] + ', ' + fullName.split(" ")[1]
    }
    return new Promise((resolve, reject) => {
        axios
            .post(
                DASHBOARD_URL + '/api-v1/submit-survey',
                {
                    'personId': postData.userInfo.personId,
                    'username': postData.userInfo.username,
                    'fullName': fullName,
                    'surveyAns1': postData.surveyAnswers.answer1,
                    'surveyAns2': postData.surveyAnswers.answer2,
                    'surveyAns3': postData.surveyAnswers.answer3,
                    'surveyAns4': postData.surveyAnswers.answer4,
                    'surveyAns5': postData.surveyAnswers.answer5,
                    'surveyAns6': postData.surveyAnswers.answer6,
                    'surveyAns7': postData.surveyAnswers.answer7,
                    'surveyAns8': postData.surveyAnswers.answer8,
                    'surveyAns9': postData.surveyAnswers.answer9,
                    'surveyAns10': postData.surveyAnswers.answer10
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            .then(function (response) {
                resolve(response.data.result.status);
            })
            .catch(error => {
                reject(error);
                Toast.show({
                    text: 'submitSurvey, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    });
}

export const savePremiseAddress = (premiseAddress) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: SAVE_PREMISE_ADDRESS,
            payload: premiseAddress,
        })
        resolve(premiseAddress)
    })
}

export const getViewBillData = (billID) => dispatch => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                DASHBOARD_URL + '/api/v1/view-bill',
                {
                    billId: billID
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            .then(function (response) {
                dispatch({
                    type: SAVE_VIEW_BILL_DATA,
                    payload: response.data,
                })
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
                Toast.show({
                    text: 'getViewBillData, Server Error:' + error,
                    duration: 3000,
                    type: 'danger'
                })
            })
    });
}

function doTheSearch(str, result) {
    const ctr = JSON.stringify(result.data.CTR)
    const ctrEscaped = ctr.replace(/\\n/g, "$\\n")
        .replace(/\\'/g, "$\\'")
        .replace(/\\"/g, '$\\"')
        .replace(/\\&/g, "$\\&")
        .replace(/\\r/g, "$\\r")
        .replace(/\\t/g, "$\\t")
        .replace(/\\b/g, "$\\b")
        .replace(/\\f/g, "$\\f");
    const index = ctrEscaped.search(str) //get the index of searched string
    let flagStart = false
    let value = ""
    for (let count = index; count < ctrEscaped.length; count++) {
        if (!flagStart) {
            if (ctrEscaped.charAt(count) === ":") {
                flagStart = true
            }
        }
        else {
            if (ctrEscaped.charAt(count) != '$') {
                value += ctrEscaped.charAt(count)
            }
            else {
                break
            }
        }
    }
    return (value)
}

export const searchString = (str, result) => dispatch => {
    let value = doTheSearch(str, result)
    return (value)
}

