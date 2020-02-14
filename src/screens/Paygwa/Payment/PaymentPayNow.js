import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button, Container, Header, Left, Body, Right, Badge, Footer, FooterTab, Icon, Input, Picker, Toast, CheckBox, Content, ListItem, Form, Item, Text, DatePicker } from 'native-base';
import {
    PixelRatio, StyleSheet, Dimensions, TouchableHighlight, Image, Alert, AppState, FlatList, Linking, View, ActivityIndicator, Platform, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserAvatar from 'react-native-user-avatar';
import Moment from 'moment';
import Modal from 'react-native-modal';
import {
    saveAccountId,
    savePremiseAddress,
    fetchMultipleAddOpptyRequest,
    fetchMultipleLatestBill,
    saveOrderData
} from '../../../actions/userMyAccounts';
import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import { Grid, Row, Col } from 'react-native-easy-grid';
import moment from 'moment'

class PaymentPayNow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAccounts: this.props.navigation.state.params.selectedAccounts,
            selectedAccountsId: this.props.navigation.state.params.selectedAccountsId,
            subtotal: this.props.navigation.state.params.subtotal,
            cardDetails: {
                cardHolderName: "",
                cardNumber: "",
                expDate: new Date(),
                validExpDate: "",
                cvv: "",
                billingZipCode: "",
                confirmationEmail: this.props.dashboard.userAccountDetails.emailAddress
            },
        }
    }
    


    componentWillMount(){
        debugger
        console.log(this.props.dashboard)
    }

    showCardType = () => {
        if (this.state.cardDetails.cardNumber.charAt(0) === "4") {
            return (<View style={{ paddingRight: 5 }}><Image source={require('../../../../assets/credit-cards/visa-logo.png')} /></View>)
        }
        else if (this.state.cardDetails.cardNumber.charAt(0) === "6") {
            return (<View style={{ paddingRight: 5 }}><Image source={require('../../../../assets/credit-cards/discover-logo.png')} /></View>)
        }
        else if (parseInt(this.state.cardDetails.cardNumber.charAt(0) + "" + this.state.cardDetails.cardNumber.charAt(1)) > 50 && parseInt(this.state.cardDetails.cardNumber.charAt(0) + "" + this.state.cardDetails.cardNumber.charAt(1)) < 56 ? true : false) {
            return (<View style={{ paddingRight: 5 }}><Image source={require('../../../../assets/credit-cards/master-logo.png')} /></View>)
        }
        else if (this.state.cardDetails.cardNumber === "") {
            return (null)
        }
        else {
            return (<View style={{ paddingRight: 5 }}><Image source={require('../../../../assets/credit-cards/forbidden-mark.png')} /></View>)
        }
    }

    _handleMultiInput(name) {
        return text => {
            this.setState({
                ...this.state,
                cardDetails: {
                    ...this.state.cardDetails,
                    [name]: text
                }
            })
        };
    
    }


    handleExpDate = (date) => {
        this.setState({
            ...this.state,
            expDateForm: date,
            cardDetails: {
                ...this.state.cardDetails,
                validExpDate: moment(date).format('MMYY'),
            }
        });
    };

    async savePayment() {
        this.setState({
            isPaymentProcessing: true
        })
        const accountSummary = this.state.selectedAccounts// save order data
        const subtotal = this.state.subtotal // subtlta ng lahat
        const usedCC = this.state.cardDetails.cardNumber.charAt(0) === "4" ? "visa" : this.state.cardDetails.cardNumber.charAt(0) === "6" ? "discover" : ""
        this.setState({ usedCC: usedCC }, async () => {
            let arrIsAmountValid = []
            if (this.state.cardDetails.cardNumber.charAt(0) === "4" || this.state.cardDetails.cardNumber.charAt(0) === "6") {
                for (let count = 0; count < accountSummary.length; count++) {
                    if (accountSummary[count].checked) {
                        try {
                            let result = await Promise.all([this.props.validateVisaPayment(accountSummary[count].accID, this.state.usedCC)]);
                            let paymentAmount = result[0].data.result.data.PaymentAmount;
                            let customerClass = result[0].data.result.data.CustomerClass;
                            const totalPayment = parseInt(accountSummary[count].amountToBePaid) + parseInt(paymentAmount);

                            if (totalPayment > 500 && !(customerClass === "RESID")) {
                                accountSummary[count].validAmountToBePaid = false;
                                accountSummary[count].alreadyPaid = paymentAmount;
                                accountSummary[count].usedCC = usedCC;
                                arrIsAmountValid.push(false);

                            }
                            else {
                                accountSummary[count].validAmountToBePaid = true;
                                arrIsAmountValid.push(true);
                            }
                        }
                        catch (error) {
                            console.log("errorerrorerrorerrorerror", error)
                            let result = {
                                status: "serverFailed"
                            };
                            this.props.navigation.navigate('PaymentView',
                                {
                                    selectedAccounts: accountSummary,
                                    selectedAccountsId: this.state.selectedAccountsId,
                                    subtotal: this.state.subtotal
                                })

                            localStorage.setItem('accountSummary', JSON.stringify(this.state.accountSummary));
                            localStorage.setItem('paymentResult', JSON.stringify(result));
                            this.setState({
                                isPaymentProcessing: false
                            })
                            this.showPaymentResult();
                        }
                    }
                }
            }
            else {
                let postData = {}
                for (let count = 0; count < accountSummary.length; count++) {
                    accountSummary[count].validAmountToBePaid = true
                }
                arrIsAmountValid.push(true)
            }
            //sort accountSummary
            let sortedAccountSummary = [];
            //get all invalid amounts
            let allInvalidAmounts = [];
            for (let count = 0; count < accountSummary.length; count++) {
                if (!accountSummary[count].validAmountToBePaid) {
                    allInvalidAmounts.push(accountSummary[count]);
                }
            }
            //get all checked rows
            let checkedRows = [];
            for (let count = 0; count < accountSummary.length; count++) {
                if (accountSummary[count].validAmountToBePaid && accountSummary[count].checked) {
                    checkedRows.push(accountSummary[count]);
                }
            }
            //get all resid accounts
            let residAccts = [];
            for (let count = 0; count < accountSummary.length; count++) {
                if (accountSummary[count].className === "RESID" && accountSummary[count].validAmountToBePaid && !accountSummary[count].checked) {
                    residAccts.push(accountSummary[count]);
                }
            }
            //get all non-resid accounts
            let nonResidAccts = [];
            for (let count = 0; count < accountSummary.length; count++) {
                if (accountSummary[count].className != "RESID" && accountSummary[count].validAmountToBePaid && !accountSummary[count].checked) {
                    nonResidAccts.push(accountSummary[count]);
                }
            }
            //insert all invalid amounts
            for (let count = 0; count < accountSummary.length; count++) {
                for (let count1 = 0; count1 < allInvalidAmounts.length; count1++) {
                    if (accountSummary[count].accID === allInvalidAmounts[count1].accID) {
                        sortedAccountSummary.push(allInvalidAmounts[count1])
                        break;
                    }
                }
            }
            //insert all checked rows
            for (let count = 0; count < accountSummary.length; count++) {
                for (let count1 = 0; count1 < checkedRows.length; count1++) {
                    if (accountSummary[count].accID === checkedRows[count1].accID) {
                        sortedAccountSummary.push(checkedRows[count1])
                        break;
                    }
                }
            }
            //insert all resid accounts
            for (let count = 0; count < accountSummary.length; count++) {
                for (let count1 = 0; count1 < residAccts.length; count1++) {
                    if (accountSummary[count].accID === residAccts[count1].accID) {
                        sortedAccountSummary.push(residAccts[count1])
                        break;
                    }
                }
            }

            //insert all non-resid accounts
            for (let count = 0; count < accountSummary.length; count++) {
                for (let count1 = 0; count1 < nonResidAccts.length; count1++) {
                    if (accountSummary[count].accID === nonResidAccts[count1].accID) {
                        sortedAccountSummary.push(nonResidAccts[count1])
                        break;
                    }
                }
            }

            console.log("sortedAccountSummarysortedAccountSummary", sortedAccountSummary)

            if (arrIsAmountValid.includes(false)) {
                // get all the the selected accountids - NOTE RETURN TO PAYMENT INPUT

                this.props.navigation.navigate('PaymentInput',
                    {
                        selectedAccounts: sortedAccountSummary,
                        selectedAccountsId: this.state.selectedAccountsId,
                        subtotal: this.state.subtotal
                    })
// payment input
                this.setState({
                    show: false,
                    isPaymentProcessing: false
                });
            }
            else {

                //SUCCESS PAGE 
                const postData = {
                    subTotal: parseFloat(Math.round(subtotal * 100) / 100).toFixed(2),
                    accountSummary: sortedAccountSummary,
                    isHasInvalid: false
                }
                this.props.saveOrderData(postData)
                this.validUserInputs(subtotal, accountSummary)
            }
        });
    }


    validUserInputs(subtotal, accountSummary) {
        const cardNumber = this.state.cardDetails.cardNumber
        const usedCC = cardNumber.charAt(0) === "4" ?
            "visa"
            :
            cardNumber.charAt(0) === "6" ?
                "discover"
                :
                parseInt(cardNumber.charAt(0) + "" + cardNumber.charAt(1)) > 50 && parseInt(cardNumber.charAt(0) + "" + cardNumber.charAt(1)) < 56 ?
                    "master"
                    :
                    "invalid";

        console.clear()
        if ((usedCC === "invalid")) {
            this.setState({
                isPaymentProcessing: false
            })
            Toast.show({
                text: `Invalid Card Number Format!`,
                duration: 3000,
                type: 'warning'
            })
            // this.props.showMessage(true, 'Invalid Card Number Format!')
        }
        else if (this.state.isVisaChecked && usedCC != "visa") {
            this.setState({
                isPaymentProcessing: false
            })
            Toast.show({
                text: `Please enter a valid Visa Card Number!`,
                duration: 3000,
                type: 'warning'
            })
            // this.props.showMessage(true, 'Please enter a valid Visa Card Number!')
        }
        else if (this.state.isMasterCardChecked && usedCC != "master") {
            this.setState({
                isPaymentProcessing: false
            })
            // this.props.showMessage(true, 'Please enter a valid Mastercard Number!')
            Toast.show({
                text: `Please enter a valid Mastercard Number!`,
                duration: 3000,
                type: 'warning'
            })
        }
        else if (((this.state.cardDetails.cardNumber).length < 16 || (this.state.cardDetails.cardNumber).length > 16) && usedCC === "visa") {
            this.setState({
                isPaymentProcessing: false
            })
            // this.props.showMessage(true, 'Please enter a valid Visa Card Number!')
            Toast.show({
                text: `Please enter a valid Visa Card Number!`,
                duration: 3000,
                type: 'warning'
            })
        }
        else if (((this.state.cardDetails.cardNumber).length < 16 || (this.state.cardDetails.cardNumber).length > 16) && usedCC === "master") {
            this.setState({
                isPaymentProcessing: false
            })
            Toast.show({
                text: `Please enter a valid Mastercard Number!`,
                duration: 3000,
                type: 'warning'
            })
            // this.props.showMessage(true, 'Please enter a valid Mastercard Number!')
        }
        else if (((this.state.cardDetails.cardNumber).length < 16 || (this.state.cardDetails.cardNumber).length > 16) && usedCC === "discover") {
            this.setState({
                isPaymentProcessing: false
            })
            Toast.show({
                text: `Please enter a valid Dicover Card Number!`,
                duration: 3000,
                type: 'warning'
            })
            // this.props.showMessage(true, 'Please enter a valid Dicover Card Number!')
        }

        else {
            this.setState({
                subtotal: subtotal,
                accountSummary: accountSummary
            }, () => {
                    console.log('executeRequests')
                // this.executeRequests()
            })
        }
    }


    // execute payment na 

    // executeRequests = () => {
    //     localStorage.setItem('reload', 'false')
    //     this.props.savePaymentData(this.state)
    //         .then((result) => {
    //             // localStorage.setItem('accountSummary', JSON.stringify(this.props.dashboard.orderData.accountSummary))
                
    //             localStorage.setItem('paymentResult', JSON.stringify(result))
    //             this.showPaymentResult();
    //             // if(result.data.Transaction_Approved === "true"){
    //             //     // this.setState({ show: false, isVisaChecked: false, isMasterCardChecked: false });
    //             //     this.showPaymentResult();
    //             // }
    //             // else{
    //             //     this.props.showMessage(true, result.data.Bank_Message)
    //             // }
    //         })
    //         .catch((error) => {
    //             let result = {
    //                 data: {
    //                     Transaction_Approved: "serverFailed"
    //                 }
    //             }
    //             localStorage.setItem('accountSummary', JSON.stringify(this.state.accountSummary))
    //             localStorage.setItem('paymentResult', JSON.stringify(result))
    //             this.showPaymentResult();
    //         })
    // }
    //RENDER MAIN COMPONENT
    render() {
        return (
            /* MAIN VIEW COMPONENT */
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={this.props.navigation.goBack}
                    title="Payment"
                    RightIcon={<Right />}
                />
                <OfflineNotice />
                <Content>
                    <View style={{ paddingVertical: 25, paddingHorizontal: 25 }}>
                        <CustomTextBold style={{ paddingBottom: 5, fontSize: 16 }} >Pay with Credit Card</CustomTextBold>
                        <CustomText style={{ paddingBottom: 5, fontSize: 16 }} >Card Holder name</CustomText>
                        <Item regular
                            style={{
                                marginLeft: 0,
                                backgroundColor: colors.WHITE,
                                borderRadius: 6,
                                borderColor: 'lightgray',
                                marginBottom: 5
                            }}>
                            <Input

                                autoCapitalize='none'
                                placeholderTextColor='lightgray'
                                keyboardType="default"
                                value={this.state.cardDetails.cardHolderName}
                                onChangeText={this._handleMultiInput('cardHolderName')}
                            />


                        </Item>
                        <CustomText style={{ paddingBottom: 5, fontSize: 16 }} >Card Holder name</CustomText>
                        <Item regular
                            style={{
                                marginLeft: 0,
                                backgroundColor: colors.WHITE,
                                borderRadius: 6,
                                borderColor: 'lightgray',
                                marginBottom: 5
                            }}>
                            <Input
                                autoCapitalize='none'
                                placeholderTextColor='lightgray'
                                keyboardType="numeric"
                                value={this.state.cardDetails.cardNumber}
                                onChangeText={this._handleMultiInput('cardNumber')}
                            />

                            {
                                this.showCardType()
                            }

                        </Item>
                        <Row>   
                        <Col size={70}>
                            <CustomText style={{ paddingBottom: 5, fontSize: 16 }} >Expiration Date</CustomText>
                            <Item regular
                                style={{
                                    height: 52,
                                    marginLeft: 0,
                                    backgroundColor: colors.WHITE,
                                    borderRadius: 6,
                                    borderColor: 'lightgray',
                                    marginBottom: 5
                                }}>

                                <DatePicker
                                    locale={"en"}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeholderTextColor='lightgray'
                                    placeHolderText="mm/yyyy"
                                    textStyle={{ color: colors.BLACK }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onDateChange={this.handleExpDate}
                                    formatChosenDate={date => { return moment(date).format('MM/YYYY'); }}
                                />
                            </Item>
                        </Col>
                        <Col size={3} />
                        <Col size={27}>
                            <CustomText style={{ paddingBottom: 5, fontSize: 16 }} >CVV</CustomText>
                                <Item regular
                                    style={{
                                        marginLeft: 0,
                                        backgroundColor: colors.WHITE,
                                        borderRadius: 6,
                                        borderColor: 'lightgray',
                                        marginBottom: 5
                                    }}>
                                    <Input
                                        autoCapitalize='none'
                                        placeholderTextColor='lightgray'
                                        keyboardType="numeric"
                                        value={this.state.cardDetails.cvv}
                                        onChangeText={this._handleMultiInput('cvv')}
                                    />
                            </Item>
                        </Col>
                        </Row>
                        <Row>
                            <Col size={27}>
                                <CustomText style={{ paddingBottom: 5, fontSize: 16 }} >Billing Zip Code</CustomText>
                                <Item regular
                                    style={{
                                        marginLeft: 0,
                                        backgroundColor: colors.WHITE,
                                        borderRadius: 6,
                                        borderColor: 'lightgray',
                                        marginBottom: 5
                                    }}>
                                    <Input
                                        autoCapitalize='none'
                                        placeholderTextColor='lightgray'
                                        keyboardType="numeric"
                                        value={this.state.cardDetails.billingZipCode}
                                        onChangeText={this._handleMultiInput('billingZipCode')}
                                    />
                                </Item>
                            </Col>
                            <Col size={3} />
                            <Col size={70}>
                                <CustomText style={{ paddingBottom: 5, fontSize: 16 }} >Confirmation Email</CustomText>
                                <Item regular
                                    style={{
                                        marginLeft: 0,
                                        backgroundColor: colors.WHITE,
                                        borderRadius: 6,
                                        borderColor: 'lightgray',
                                        marginBottom: 5
                                    }}>
                                    <Input
                                        disabled
                                        autoCapitalize='none'
                                        placeholderTextColor='lightgray'
                                        keyboardType="numeric"
                                        value={this.state.cardDetails.confirmationEmail}
                                    />

                                </Item>
                            </Col>
                        </Row>
                       
                    </View>
                </Content>
                <Footer>
                    <FooterTab style={{ backgroundColor: '#4CAF50' }}>
                        <Button full
                            onPress={() => {
                                // this.savePayment()
                            }}
                        >
                            <CustomText style={{ color: colors.WHITE }}>Pay Now </CustomText>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    userPersonId: state.userState.userPersonId,
    accountIds: state.userState.accountIds,
    accountId: state.userState.accountId,
    dashboard: state.dashboard
})

export default connect(mapStateToProps, {
    saveAccountId,
    savePremiseAddress,
    fetchMultipleAddOpptyRequest,
    fetchMultipleLatestBill,
    saveOrderData
})(PaymentPayNow);
