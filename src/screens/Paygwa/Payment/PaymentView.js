import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Footer, FooterTab, Content } from 'native-base';
import {
    View
} from 'react-native';
import {
    saveAccountId,
    savePremiseAddress,
    fetchMultipleAddOpptyRequest,
    fetchMultipleLatestBill,
    saveOrderData,
    validateVisaPayment,
    savePaymentData
} from '../../../actions/userMyAccounts';
import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import { Row, Col } from 'react-native-easy-grid';

class PaymentView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAccounts: this.props.navigation.state.params.selectedAccounts,
            selectedAccountsId: this.props.navigation.state.params.selectedAccountsId,
            subtotal: this.props.navigation.state.params.subtotal,
            isPaymentProcessing: false,
            cardDetails: {
                cardHolderName: this.props.navigation.state.params.cardDetails.cardHolderName,
                cardNumber: this.props.navigation.state.params.cardDetails.cardNumber,
                validExpDate: _.toString(this.props.navigation.state.params.cardDetails.selectedMonth).concat(this.props.navigation.state.params.cardDetails.selectedYear),
                cvv: this.props.navigation.state.params.cardDetails.cvv,
                billingZipCode: this.props.navigation.state.params.cardDetails.billingZipCode,
                confirmationEmail: this.props.navigation.state.params.cardDetails.confirmationEmail,
                selectedMonth: this.props.navigation.state.params.cardDetails.selectedMonth,
                selectedYear: this.props.navigation.state.params.cardDetails.selectedYear
            }
        }
    }

    componentWillMount() {
        this.setState({
            userFullName: this.props.dashboard.userAccountDetails.fullName === undefined ? "" : this.props.dashboard.userAccountDetails.fullName,
            username: this.props.userName,
        })
    }

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
                    accountSummary[count].validAmountToBePaid = true
                }
                arrIsAmountValid.push(true)
            } else {
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

                const postData = {
                    subTotal: parseFloat(Math.round(subtotal * 100) / 100).toFixed(2),
                    accountSummary: sortedAccountSummary,
                    isHasInvalid: true
                }
                this.props.saveOrderData(postData)

                this.props.navigation.navigate('PaymentInput',
                    {
                        selectedAccounts: sortedAccountSummary,
                        selectedAccountsId: this.state.selectedAccountsId,
                        subtotal: parseFloat(Math.round(subtotal * 100) / 100).toFixed(2),
                        screenAccountSummaryKey : this.props.navigation.state.params.screenAccountSummaryKey
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
        } else if (this.state.cardDetails.confirmationEmail != "") {
            let email = String(this.state.cardDetails.confirmationEmail);
            // eslint-disable-next-line
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                this.setState({
                    subtotal: subtotal,
                    accountSummary: accountSummary
                }, () => {
                    this.executeRequests()
                })
            }
            else {
                this.setState({
                    isPaymentProcessing: false
                })
                Toast.show({
                    text: `Invalid email address!`,
                    duration: 3000,
                    type: 'darnger'
                })
            }
        }
        else {
            this.setState({
                subtotal: subtotal,
                accountSummary: accountSummary, // sorted na all
                isPaymentProcessing: true
            }, () => {
                console.log('executeRequests')
                this.executeRequests()
            })
        }
    }


    // execute payment na 

    executeRequests = () => {
        this.props.savePaymentData(this.state)
            .then((result) => {
                console.log('paymentResult', JSON.stringify(result))
                console.log('accountSummary', this.state.accountSummary)

                this.setState({
                    isPaymentProcessing: false
                })

                if (result.data.Transaction_Approved == 'true') {
                    this.props.navigation.navigate('PaymentSuccess',
                        {
                            paymentResult: result,
                            accountSummary: this.state.accountSummary,
                            screenAccountSummaryKey : this.props.navigation.state.params.screenAccountSummaryKey

                        })
                } else if (result.data.Transaction_Approved == 'false') {
                    this.props.navigation.navigate('PaymentUserFailed',
                        {
                            paymentResult: result,
                            accountSummary: this.state.accountSummary,
                            screenAccountSummaryKey : this.props.navigation.state.params.screenAccountSummaryKey

                        })
                } else {
                    this.props.navigation.navigate('PaymentServerFailed')
                }

            })
            .catch((error) => {
                this.setState({
                    isPaymentProcessing: false
                })

                this.props.navigation.navigate('PaymentServerFailed')
                console.log('error')
                console.log('accountSummary', JSON.stringify(this.state.accountSummary))
                console.log('paymentResult', JSON.stringify(result))
            })
    }


    //RENDER MAIN COMPONENT
    render() {

        var a = _.toString(this.state.cardDetails.selectedMonth);
        var b = this.state.cardDetails.selectedYear;
        var expDate = _.toString(this.state.cardDetails.selectedMonth).concat(this.state.cardDetails.selectedYear);
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
                <Content style={{ backgroundColor: '#ECEFF2' }}>
                    <View style={{ backgroundColor: colors.WHITE, borderBottomWidth: .3, borderColor: '#3b4043', paddingVertical: 20, paddingHorizontal: 25 }}>
                        <CustomTextBold style={{ color: colors.PRIMARY_COLOR, fontSize: 18 }}>Review Your Order</CustomTextBold>
                        <CustomText style={{ fontSize: 14 }}>Kindly review before you proceed.</CustomText>
                    </View>
                    <View style={{ backgroundColor: '#e2e6ea', borderBottomWidth: .3, borderColor: '#3b4043', paddingVertical: 20, paddingHorizontal: 25 }}>
                        <CustomTextBold style={{ color: '#333333', fontSize: 16 }}>Credit Card Details</CustomTextBold>
                    </View>
                    <View style={{ backgroundColor: colors.WHITE, paddingVertical: 20, paddingHorizontal: 25, borderBottomWidth: .3, borderColor: '#3b4043', }}>
                        <Row style={{ paddingBottom: 10 }}>
                            <Col>
                                <CustomText style={{ fontSize: 14 }} >
                                    Credit Card Holder Name
                                </CustomText>
                            </Col>
                            <Col style={{ alignItems: 'flex-end' }}>
                                <CustomText style={{ fontSize: 14 }} >
                                    {_.get(this.state.cardDetails, 'cardHolderName', 'N/A')}
                                </CustomText>
                            </Col>
                        </Row>
                        <Row style={{ paddingBottom: 10 }}>
                            <Col>
                                <CustomText style={{ fontSize: 14 }} >
                                    Credit Card Holder Name
                                </CustomText>
                            </Col>
                            <Col style={{ alignItems: 'flex-end' }}>
                                <CustomText style={{ fontSize: 14 }} >
                                    {_.get(this.state.cardDetails, 'cardNumber', 'N/A')}
                                </CustomText>
                            </Col>
                        </Row>
                        <Row style={{ paddingBottom: 10 }}>
                            <Col>
                                <CustomText style={{ fontSize: 14 }} >
                                    Expiration date and CVV
                                </CustomText>
                            </Col>
                            <Col style={{ alignItems: 'flex-end' }}>
                                <CustomText style={{ fontSize: 14 }} >
                                    {expDate} | {_.get(this.state.cardDetails, 'cvv', '000')}
                                </CustomText>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <CustomText style={{ fontSize: 14 }} >
                                    Confirmation Email
                                </CustomText>
                            </Col>
                            <Col style={{ alignItems: 'flex-end' }}>
                                <CustomText style={{ fontSize: 14 }} >
                                    {_.get(this.state.cardDetails, 'confirmationEmail', 'N/A')}
                                </CustomText>
                            </Col>
                        </Row>
                    </View>
                    <View style={{ backgroundColor: '#e2e6eb', borderBottomWidth: .3, borderColor: '#3b4043', paddingVertical: 20, paddingHorizontal: 25 }}>
                        <CustomTextBold style={{ color: '#333333', fontSize: 16 }}>Account Details</CustomTextBold>
                    </View>

                    <View style={{ backgroundColor: colors.WHITE, paddingVertical: 25, paddingHorizontal: 25 }}>
                        {_.map(this.state.selectedAccounts, (data, index) => {
                            return (
                                <Row style={{ paddingBottom: 5 }}>
                                    <Col>
                                        <CustomText style={{ fontSize: 16 }} >{data.accID[0]}</CustomText>
                                        <CustomTextBold style={{ fontSize: 18 }}>${data.arrears.details.PayoffBalance}</CustomTextBold>
                                    </Col>
                                    <Col style={{ alignItems: 'flex-end' }}>
                                        <CustomText style={{ fontSize: 16 }} >$ {parseFloat(data.amountToBePaid).toFixed(2)}
                                        </CustomText>
                                    </Col>
                                </Row>)
                        })
                        }
                    </View>
                    <View style={{ backgroundColor: colors.WHITE, paddingHorizontal: 25, justifyContent: 'center', alignItems: 'center' }}>
                        <Row style={{ paddingBottom: 25 }}>
                            <Col size={50} style={{ justifyContent: 'center' }}>
                                <CustomTextBold style={{ fontSize: 18 }}>Total Amount</CustomTextBold>
                            </Col>
                            <Col size={50} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                {/* <CustomTextBold style={{ fontSize: 24, paddingLeft: 30 }}>$ {this.state.subtotal == 0 ?  this.state.subtotal.toFixed(2): new Intl.NumberFormat('en-US', { currency: 'USD' }).format(this.state.subtotal)}</CustomTextBold> */}
                                <CustomTextBold style={{ fontSize: 24, paddingLeft: 30 }}>$ {new Intl.NumberFormat("es-US", { minimumFractionDigits: 2 } ).format( this.state.subtotal )}</CustomTextBold>
                            </Col>
                        </Row>

                    </View>
                </Content>
                <Footer>
                    <FooterTab style={{ backgroundColor: colors.LIGHT_GREEN }}>


                        <Button full
                            disabled={this.state.isPaymentProcessing}
                            onPress={() => {
                                this.savePayment()
                                // console.log('savePayment')
                                // this.props.navigation.navigate('PaymentSuccess')
                            }}
                        >
                            <CustomText style={{ color: colors.WHITE }}>{
                                this.state.isPaymentProcessing ?
                                    'Please wait...'
                                    :
                                    'Pay Now '
                            }</CustomText>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    userName: state.userState.userName,
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
    saveOrderData,
    validateVisaPayment,
    savePaymentData
})(PaymentView);
