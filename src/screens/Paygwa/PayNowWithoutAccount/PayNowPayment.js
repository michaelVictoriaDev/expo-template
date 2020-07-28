import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Icon, Input, Content, Item, Text, Toast, Form, Picker } from 'native-base';
import {
    View, TouchableOpacity, Image, Alert, BackHandler, Keyboard, Dimensions
} from 'react-native';

// import SignUpAccountDetails from './SignUpAccountDetails'
import PayNowValidation from './PayNowValidation'
import { colors, pRatioToFontSize, months, years } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import CustomTextMedium from '../../../components/CustomTextMedium';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _, { times } from 'lodash'
import {
    checkAccountNumber,
    getOtherDetails,
    getPremiseInfo,
    getAcovInfo
} from '../../../actions/userSignUp';

import {
    saveAccountId,
    savePremiseAddress,
    fetchMultipleAddOpptyRequest,
    fetchMultipleLatestBill,
    saveOrderData,
    validateVisaPayment,
    savePaymentData
} from '../../../actions/userMyAccounts';

// import { TextInputMask } from 'react-native-masked-text'
// import TextInputMask from 'react-native-text-input-mask';

import NavigationService from '../../../NavigationService';
import StepIndicator from 'react-native-step-indicator';
import Modal from 'react-native-modal'
import { Grid, Row, Col } from 'react-native-easy-grid';
import moment from 'moment'
import NumberFormat from 'react-number-format';

import 'intl';
import 'intl/locale-data/jsonp/fr';



const labels = ["Customer Information", "Validation", "Enter Payment"];

const customStyles = {
    stepIndicatorSize: 60,
    currentStepIndicatorSize: 60,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: colors.PRIMARY_COLOR,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: colors.PRIMARY_COLOR,
    stepStrokeUnFinishedColor: colors.LINK_WATER,
    separatorFinishedColor: colors.PRIMARY_COLOR,
    separatorUnFinishedColor: colors.LINK_WATER,
    stepIndicatorFinishedColor: colors.PRIMARY_COLOR,
    stepIndicatorUnFinishedColor: colors.LINK_WATER,
    stepIndicatorCurrentColor: colors.PRIMARY_COLOR,
    stepIndicatorLabelFontSize: 14,
    currentStepIndicatorLabelFontSize: 14,
    stepIndicatorLabelCurrentColor: colors.WHITE,
    stepIndicatorLabelFinishedColor: colors.WHITE,
    stepIndicatorLabelUnFinishedColor: colors.WHITE,
    labelColor: colors.BLACK,
    labelSize: 14,
    currentStepLabelColor: colors.BLACK,
    labelFontFamily: 'Lato_Bold'
}

class PayNowPayment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            accountSummary: this.props.accountSummary,
            userDetails: this.props.userDetails,
            userLatestBill: this.props.userLatestBill,
            isSuccess: false,
            showSample: false,
            isPaymentProcessing: false,
            currentPosition: 2,
            isModalShow: false,
            isModalShowEmail: false,
            event: this.props.event,
            cardDetails: {
                // cardHolderName: "Xtendly Dev",
                cardHolderName: "",
                // cardNumber: "4111111111111111",
                cardNumber: "",
                cvv: "123",
                validExpDate: "",
                selectedMonth: ('0' + (moment().month() + 1)).slice(-2),
                selectedYear: moment().format("YY"),
                customerName: '',
                address: '',
                amountToBePaid: '1',
                confirmationEmail: this.props.userLatestBill.email,
            },
            errors: {
                amountToBePaid: '',
                cardHolderName: '',
                cardNumber: '',
                cvv: '',
                confirmationEmail: '',
            }
        }
        // this.onSubmit = this.onSubmit.bind(this);
    }
    // For Function ProgressStep
    defaultScrollViewProps = {
        keyboardShouldPersistTaps: 'handled',
        contentContainerStyle: {
            flex: 1,
            justifyContent: 'center'
        }
    };




    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        console.log('Im here2', this.props.accountSummary)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

        console.log('userDetails', this.props.userDetails)

        console.log('userLatestBill', this.props.userLatestBill)
    }

    handleBackButtonClick() {
        NavigationService.goBack()
        return true;
    }

    onSubmit() {
        if (this.state.cardDetails.amountToBePaid <= 0 || this.state.cardDetails.cardHolderName == "" || this.state.cardDetails.cardNumber == "" || this.state.cardDetails.cvv == "") {

            var amountToBePaid
            var cardHolderName
            var cardNumber
            var cvv
            console.log(this.state.cardDetails.amountToBePaid <= 0)
            if (this.state.cardDetails.amountToBePaid <= 0) {
                console.log('1')
                amountToBePaid = `Please enter a valid amount.`

            } else {
                console.log('2')
                amountToBePaid = ``

            }

            if (this.state.cardDetails.cardHolderName == "") {
                console.log('1')
                cardHolderName = `Please enter Card Holder Name.`

            } else {
                console.log('2')
                cardHolderName = ``

            }

            if (this.state.cardDetails.cardNumber == "") {
                console.log('1')
                cardNumber = `Please enter Card Number.`

            } else {
                console.log('2')
                cardNumber = ``
            }

            if (this.state.cardDetails.cvv == "") {
                console.log('1')
                cvv = `Please enter CVV.`

            } else {
                console.log('12')
                cvv = ``

            }

            this.setState({
                ...this.state,
                errors: {
                    ...this.state.errors,
                    amountToBePaid: amountToBePaid,
                    cardHolderName: cardHolderName,
                    cardNumber: cardNumber,
                    cvv: cvv
                }

            })


        } else {
            console.log('proceed')


            this.setState({
                ...this.state,
                cardDetails: {
                    ...this.state.cardDetails,
                    validExpDate: _.toString(this.state.cardDetails.selectedMonth).concat(this.state.cardDetails.selectedYear),
                },
                errors: {
                    ...this.state.errors,
                    amountToBePaid: '',
                    cardHolderName: '',
                    cardNumber: '',
                    cvv: ''
                },
                isPaymentProcessing: true

            })



            this.validateAmount()
        }

    }


    validateAmount() {

        console.log('data', this.state)
        // e.preventDefault()
        const accountSummary = this.state.userLatestBill
        const subtotal = this.state.cardDetails.amountToBePaid
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


        console.log('usedCC', this.state.usedCC)
        let arrIsAmountValid = []
        if (this.state.cardDetails.cardNumber.charAt(0) === "4" || this.state.cardDetails.cardNumber.charAt(0) === "6") {
            for (let count = 0; count < accountSummary.length; count++) {
                accountSummary[count].validAmountToBePaid = true
            }
            arrIsAmountValid.push(true);
        }
        else {
            let postData = {};
            for (let count = 0; count < accountSummary.length; count++) {
                accountSummary[count].validAmountToBePaid = true
            }
            arrIsAmountValid.push(true);
        }
        const postData = {
            subTotal: parseFloat(Math.round(subtotal * 100) / 100).toFixed(2),
            accountSummary: accountSummary
        };
        if (arrIsAmountValid.includes(false)) {
            debugger
            this.props.saveOrderData(postData);
            this.setState({
                isPaymentProcessing: false
            });
            // this.props.saveFormConfig({btnSubmitValue: "Continue"});
            const accountSummary = this.state.accountSummary;
            let message = 'Payment has exceeded the monthly maximum of $500 for non-residential accounts using ' + (usedCC === "visa" ? "Visa" : "Discover") + ' Card. ';
            if ((500 - parseInt(accountSummary[0].alreadyPaid)) > 0) {
                message += "You can only pay up to " + ("$ " + (500 - parseInt(accountSummary[0].alreadyPaid))) + " for now using a " + (usedCC === "visa" ? "VISA" : "DISCOVER") + ", or you may complete your payment using Mastercard or " + (usedCC === "visa" ? "Discover card." : "Visa card.")
            }
            else {
                message += "Alternatively, you may complete your payment using a Mastercard or " + (usedCC === "visa" ? "Discover card." : "Visa card.")
            }


            Toast.show({
                text: message,
                duration: 3000,
                type: 'danger'
            })
            // this.props.showMessage('danger', message);
        }
        else {
            this.props.saveOrderData(postData);
            debugger
            this.validUserInputs(subtotal, accountSummary);
        }
    }


    validUserInputs(subtotal, accountSummary) {
        debugger
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
                    type: 'danger'
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
    executeRequests = () => {
        var text = this.state.cardDetails.cardNumber
        var replaceSpacingMask = text.replace(/[\n\r\s\t]+/g, ' ') 
        console.log('replaceSpacingMask', replaceSpacingMask)
        
        this.setState({
            ...this.state,
            cardDetails: {
                ...this.state.cardDetails,
                cardNumber: replaceSpacingMask
            }
        })


        this.props.savePaymentData(this.state)
            .then((result) => {
                console.log('paymentResult', JSON.stringify(result))
                console.log('accountSummary', this.state.accountSummary)

                this.setState({
                    isPaymentProcessing: false
                })

                if (result.data.Transaction_Approved == 'true') {
                    NavigationService.navigate('PaymentSuccessWA',
                        {
                            paymentResult: result,
                            accountSummary: [this.state.accountSummary],
                            event: this.state.event

                        })
                } else if (result.data.Transaction_Approved == 'false') {
                    NavigationService.navigate('PaymentUserFailedWA',
                        {
                            paymentResult: result,
                            accountSummary: [this.state.accountSummary],
                            event: this.state.event

                        })
                } else {
                    NavigationService.navigate('PaymentServerFailedWA', {
                        event: this.state.event
                    })
                }

            })
            .catch((error) => {
                this.setState({
                    isPaymentProcessing: false
                })

                NavigationService.navigate('PaymentServerFailedWA', {
                    event: this.state.event
                })
                console.log('error')
                console.log('accountSummary', JSON.stringify(this.state.accountSummary))
                console.log('paymentResult', JSON.stringify(result))
            })
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

    showCardType() {

        const cardNumber = this.state.cardDetails.cardNumber

        if (cardNumber.charAt(0) === "4") {
            return (<View style={{ paddingRight: 5 }}><Image source={require('../../../../assets/credit-cards/visa-logo.png')} /></View>)
        }
        else if (cardNumber.charAt(0) === "6") {
            return (<View style={{ paddingRight: 5 }}><Image source={require('../../../../assets/credit-cards/discover-logo.png')} /></View>)
        }
        else if (parseInt(cardNumber.charAt(0) + "" + cardNumber.charAt(1)) > 50 && parseInt(cardNumber.charAt(0) + "" + cardNumber.charAt(1)) < 56 ? true : false) {
            return (<View style={{ paddingRight: 5 }}><Image source={require('../../../../assets/credit-cards/master-logo.png')} /></View>)
        }
        else if (cardNumber === "") {
            return (null)
        }
        else {
            return (<View style={{ paddingRight: 5 }}><Image source={require('../../../../assets/credit-cards/forbidden-mark.png')} /></View>)
        }
    }



    formatAmount = (value, callback) => {
        value = value.replace('$ ', ''); //removes '$ '
        value = value.replace(/\,/g, '') //removes all ','
        return value = parseFloat(Math.round(value * 100) / 100).toFixed(2)
    }

    amountToBePaidOnChange = (text) => {
        var value = text

        if (_.isNaN(value)) {
            value = this.formatAmount(0.00);
        } else {
            value = this.formatAmount(value);
        }



        console.log('value', value)
        this.setState({
            ...this.state,
            cardDetails: {
                ...this.state.cardDetails,
                amountToBePaid: value
            }
        })
    }



    maskString = (value) => {
        let str = value;
        let count = 0;
        let new_str = "";
        for (let i = 0; i < str.length; i++) {
            if (count > 1) {
                if (str.charAt(i) != " ") {
                    new_str = new_str + '*'
                    count = count + 1
                }
                else {
                    new_str = new_str + " "
                    count = 0;
                }

            }
            else if (count < 2) {
                if (str.charAt(i) != " ") {
                    new_str = new_str + str.charAt(i)
                    count = count + 1
                }
                else {
                    new_str = new_str + " "
                    count = 0;
                }
            }

        }
        return new_str;
    }

    //RENDER MAIN COMPONENT
    render() {
        const { width } = Dimensions.get('window');

        let fullName = this.state.userDetails.Name
        const finalFullName = this.maskString(fullName);


        let fullAddress = this.state.userDetails.Address
        const finalAdd1 = this.maskString(fullAddress);


        return (
            /* MAIN VIEW COMPONENT */
            this.state.isGoBack === true ?
                <PayNowValidation
                    userDetails={this.state.userDetails}
                    userLatestBill={this.state.userLatestBill}
                    accountSummary={this.state.accountSummary}
                    event={this.state.event}
                />
                :
                <Container >
                    <CustomHeader
                        fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                        leftButtonFunction={
                            () =>
                                this.setState({
                                    isGoBack: true
                                })

                        }
                        title="Pay Now"
                        RightIcon={<Right />}
                    />

                    {this.state.isModalShow ?
                        <Modal isVisible={this.state.isModalShow} backdropColor={'rgba(0,0,0,.4)'} backdropOpacity={1}
                            avoidKeyboard={true}
                            onBackdropPress={() => this.setState({ isModalShow: false })}

                        >
                            <View style={{
                                backgroundColor: colors.WHITE, paddingVertical: 20, borderTopStartRadius: 8,
                                borderTopEndRadius: 8
                            }}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end'

                                }}>
                                    <Button transparent small onPress={() => this.setState({ isModalShow: false })}  >
                                        <Icon style={{ color: '#656667', fontSize: 24 }} name='md-close-circle' type='Ionicons' />
                                    </Button>


                                </View>
                            </View>
                            <View style={{
                                backgroundColor: colors.WHITE,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'flex-start',
                                paddingBottom: 10, borderBottomEndRadius: 8, borderBottomStartRadius: 8
                            }}>
                                <View style={{
                                    width: '50%',
                                    // flexBasis: '50%',
                                    // maxWidth: '50%'
                                }}>
                                    < Image source={require('../../../../assets/credit-cards/cvv-hint.png')}

                                        style={{
                                            width: '100%',
                                            // height: '40%',
                                            // justifyContent: 'center', alignItems: 'center',
                                            // overflow: 'visible'
                                        }} />
                                </View>
                                <View style={{
                                    width: '5%'
                                }} />
                                <View style={{
                                    width: '45%',
                                    paddingTop: '30%',
                                    // width: 270,
                                }}>
                                    <CustomTextBold>
                                        CVV Code
                                    </CustomTextBold>
                                    <CustomText>
                                        The CVV Code is a security code and is the last 3-digits printed on the signature panel on the back of your credit card.
                                    </CustomText>

                                </View>
                            </View>
                        </Modal>
                        :
                        false
                    }

                    {this.state.isModalShowEmail ?
                        <Modal isVisible={this.state.isModalShowEmail} backdropColor={'rgba(0,0,0,.4)'} backdropOpacity={1}
                            avoidKeyboard={true}
                            onBackdropPress={() => this.setState({ isModalShowEmail: false })}

                        >
                            <View style={{
                                backgroundColor: colors.WHITE, paddingVertical: 20, borderTopStartRadius: 8,
                                borderTopEndRadius: 8
                            }}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end'

                                }}>
                                    <Button transparent small onPress={() => this.setState({ isModalShowEmail: false })}  >
                                        <Icon style={{ color: '#656667', fontSize: 24 }} name='md-close-circle' type='Ionicons' />
                                    </Button>


                                </View>
                            </View>
                            <View style={{
                                backgroundColor: colors.WHITE,
                                justifyContent: 'center', alignItems: 'center',
                                paddingBottom: 10, borderBottomEndRadius: 8,
                                borderBottomStartRadius: 8, paddingHorizontal: 20
                            }}>
                                <CustomText style={{ textAlign: 'center' }}>
                                    Enter email address to which the receipt will be sent to, otherwise, leave it blank.
                                    </CustomText>
                            </View>
                        </Modal>
                        :
                        false
                    }
                    <OfflineNotice />

                    <Content >
                        <View style={{ paddingTop: 40, paddingBottom: 10, paddingHorizontal: 40 }} >
                            <StepIndicator
                                stepCount={3}
                                customStyles={customStyles}
                                currentPosition={this.state.currentPosition}
                                labels={labels}
                            />
                        </View>
                        <View style={{ backgroundColor: colors.WHITE, paddingHorizontal: 60 }} >
                            <CustomText style={{ paddingVertical: 5, paddingVertical: 8 }}>Amount to be paid </CustomText>
                            <Item regular
                                style={{
                                    borderStyle: 'solid',
                                    marginLeft: 0,
                                    backgroundColor: colors.WHITE,
                                    borderRadius: 6,
                                    borderColor: 'lightgray',
                                    marginBottom: 5,
                                    borderWidth: 1
                                }}>

                                <NumberFormat
                                    value={this.state.cardDetails.amountToBePaid}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$ '}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    renderText={value => (
                                        <React.Fragment>
                                            <Input
                                                returnKeyType='done'

                                                autoCapitalize='none'
                                                placeholderTextColor='lightgray'
                                                keyboardType="numeric"
                                                value={value}
                                                onChangeText={(value) => this.amountToBePaidOnChange(value)}
                                            />

                                        </React.Fragment>
                                    )}
                                />
                            </Item>
                            {!_.isEmpty(this.state.errors.amountToBePaid) ?
                                <CustomText style={{
                                    color: colors.RED, paddingVertical: 5
                                }}>
                                    {this.state.errors.amountToBePaid}
                                </CustomText>
                                :
                                null
                            }
                            <CustomText style={{ paddingVertical: 5, paddingVertical: 8 }}>Card Holder Name </CustomText>
                            <Item regular
                                style={{
                                    borderStyle: 'solid',
                                    marginLeft: 0,
                                    backgroundColor: colors.WHITE,
                                    borderRadius: 6,
                                    borderColor: 'lightgray',
                                    marginBottom: 5,
                                    borderWidth: 1
                                }}>
                                <Input
                                    keyboardType='default'
                                    autoCapitalize='none'
                                    value={this.state.cardDetails.cardHolderName}
                                    onChangeText={this._handleMultiInput('cardHolderName')}
                                />


                            </Item>

                            {!_.isEmpty(this.state.errors.cardHolderName) ?
                                <CustomText style={{
                                    color: colors.RED, paddingVertical: 5
                                }}>
                                    {this.state.errors.cardHolderName}
                                </CustomText>
                                :
                                null
                            }
                            <CustomText style={{ paddingVertical: 5, paddingVertical: 8 }}>Card Number </CustomText>
                            <Item regular
                                style={{
                                    borderStyle: 'solid',
                                    marginLeft: 0,
                                    backgroundColor: colors.WHITE,
                                    borderRadius: 6,
                                    borderColor: 'lightgray',
                                    marginBottom: 5,
                                    borderWidth: 1
                                }}>


                                {/* <NumberFormat
                                    mask="_"
                                    value={this.state.cardDetails.cardNumber}
                                    displayType={'text'} format="#### #### #### ####"
                                    renderText={value => (
                                        <Input
                                            textAlign={'left'}
                                            autoCapitalize='none'
                                            placeholderTextColor='lightgray'
                                            keyboardType="numeric"
                                            value={value}
                                            onChangeText={this._handleMultiInput('cardNumber')}
                                        />
                                    )}
                                /> */}

                                <Input
                                    maxLength={16}
                                    textAlign={'left'}
                                    autoCapitalize='none'
                                    placeholderTextColor='lightgray'
                                    keyboardType="numeric"
                                    value={this.state.cardDetails.cardNumber}
                                    onChangeText={(text) => {

                                        const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g
                                        const string = text
                                        const onlyNumbers = string.replace(/[^\d]/g, '')

                                        const result = onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
                                            [$1, $2, $3, $4].filter(group => !!group).join(' ')
                                        )
                                        this.setState({
                                            ...this.state,
                                            cardDetails: {
                                                ...this.state.cardDetails,
                                                cardNumber: result
                                            }
                                        })
                                    }}


                                />
                                {
                                    this.showCardType()
                                }
                            </Item>
                            {!_.isEmpty(this.state.errors.cardNumber) ?
                                <CustomText style={{
                                    color: colors.RED, paddingVertical: 5
                                }}>
                                    {this.state.errors.cardNumber}
                                </CustomText>
                                :
                                null
                            }


                            <Row>
                                <Col size={60}>
                                    <CustomText style={{ paddingVertical: 8 }} >Expiration Date</CustomText>
                                    <Item regular
                                        style={{
                                            height: 52,
                                            marginLeft: 0,
                                            backgroundColor: colors.WHITE,
                                            borderRadius: 6,
                                            borderColor: 'lightgray',
                                            marginBottom: 10
                                        }}>
                                        <Form>
                                            <Picker
                                                note
                                                mode="dropdown"
                                                style={{ width: 80 }}
                                                selectedValue={this.state.cardDetails.selectedMonth}
                                                onValueChange={(value) =>

                                                    this.setState({
                                                        ...this.state,
                                                        cardDetails: {
                                                            ...this.state.cardDetails,
                                                            selectedMonth: value
                                                        }
                                                    })
                                                }
                                            >
                                                {_.map(months, (monthData, index) => {
                                                    return (
                                                        <Picker.Item label={monthData.name} value={monthData.value} />
                                                    )
                                                })
                                                }
                                            </Picker>
                                        </Form>
                                        <CustomText>/</CustomText>
                                        <Form>
                                            <Picker
                                                note
                                                mode="dropdown"
                                                style={{ width: 80 }}
                                                selectedValue={this.state.cardDetails.selectedYear}
                                                onValueChange={(value) =>
                                                    this.setState({
                                                        ...this.state,
                                                        cardDetails: {
                                                            ...this.state.cardDetails,
                                                            selectedYear: value
                                                        }
                                                    })}
                                            >
                                                {_.map(years, (years, index) => {
                                                    return (
                                                        <Picker.Item label={years.year} value={years.value} />
                                                    )
                                                })
                                                }
                                            </Picker>
                                        </Form>

                                    </Item>

                                </Col>
                                <Col size={5} />
                                <Col size={25}>
                                    <CustomText style={{ paddingVertical: 8 }} >CVV</CustomText>
                                    <Item regular
                                        style={{
                                            marginLeft: 0,
                                            backgroundColor: colors.WHITE,
                                            borderRadius: 6,
                                            borderColor: 'lightgray',
                                            marginBottom: 10
                                        }}>
                                        <Input
                                            autoCapitalize='none'
                                            placeholderTextColor='lightgray'
                                            keyboardType="numeric"
                                            value={this.state.cardDetails.cvv}
                                            onChangeText={this._handleMultiInput('cvv')}
                                        />

                                    </Item>
                                    {!_.isEmpty(this.state.errors.cvv) ?
                                        <CustomText style={{
                                            color: colors.RED, paddingVertical: 5
                                        }}>
                                            {this.state.errors.cvv}
                                        </CustomText>
                                        :
                                        null
                                    }
                                </Col>
                                <Col size={10}>
                                    <CustomText style={{ paddingVertical: 8 }} />
                                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 15 }}>
                                        <TouchableOpacity onPress={() => this.setState({ isModalShow: true })}>
                                            <Icon style={{ color: colors.BLACK, fontSize: 18 }} name='info-circle' type='FontAwesome' />
                                        </TouchableOpacity>
                                    </View>
                                </Col>
                            </Row>
                            <Row>
                                <Col size={90}>
                                    <CustomText style={{ paddingVertical: 5, paddingVertical: 8 }}>Confirmation Email</CustomText>
                                    <Item regular
                                        style={{
                                            borderStyle: 'solid',
                                            marginLeft: 0,
                                            backgroundColor: colors.WHITE,
                                            borderRadius: 6,
                                            borderColor: 'lightgray',
                                            marginBottom: 5,
                                            borderWidth: 1
                                        }}>
                                        <Input
                                            keyboardType='numeric'
                                            autoCapitalize='none'
                                            value={this.state.cardDetails.confirmationEmail}
                                            onChangeText={this._handleMultiInput('confirmationEmail')}
                                        />
                                    </Item>
                                </Col>
                                <Col size={10}>
                                    <CustomText style={{ paddingVertical: 8 }} />
                                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 15 }}>
                                        <TouchableOpacity onPress={() => this.setState({ isModalShowEmail: true })}>
                                            <Icon style={{ color: colors.BLACK, fontSize: 18 }} name='info-circle' type='FontAwesome' />
                                        </TouchableOpacity>
                                    </View>
                                </Col>
                            </Row>
                            <CustomText style={{ paddingVertical: 5, paddingVertical: 8 }}>Customer Name</CustomText>
                            <Item regular
                                style={{
                                    borderStyle: 'solid',
                                    marginLeft: 0,
                                    backgroundColor: colors.WHITE,
                                    borderRadius: 6,
                                    borderColor: 'lightgray',
                                    marginBottom: 5,
                                    borderWidth: 1
                                }}>
                                <Input
                                    value={finalFullName}
                                    disabled
                                />
                            </Item>

                            <CustomText style={{ paddingVertical: 5, paddingVertical: 8 }}>Address</CustomText>
                            <Item regular
                                style={{
                                    borderStyle: 'solid',
                                    marginLeft: 0,
                                    backgroundColor: colors.WHITE,
                                    borderRadius: 6,
                                    borderColor: 'lightgray',
                                    marginBottom: 5,
                                    borderWidth: 1
                                }}>
                                <Input
                                    value={finalAdd1}
                                    disabled
                                />
                            </Item>

                            <View style={{ paddingTop: 15, paddingBottom: 20 }}>
                                <Button style={{ borderRadius: 5 }} block success onPress={() => this.onSubmit()} disabled={this.state.isPaymentProcessing}>
                                    <CustomText style={{ fontSize: 16, color: colors.WHITE }} uppercase={false} >{this.state.isPaymentProcessing ? 'Verifying' : 'Pay Now'}</CustomText>
                                </Button>
                            </View>
                            <View style={{ paddingHorizontal: 30 }} >
                                <Button style={{ borderRadius: 6 }} transparent block onPress={() =>
                                    NavigationService.goBack()

                                } >
                                    <CustomText uppercase={false} style={{ color: '#999999', CustomTextDecorationLine: 'underline' }} >Cancel</CustomText>
                                </Button>
                            </View>
                            {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <CustomText style={{ fontSize: 16 }}>Already Registered? </CustomText>
                                <TouchableOpacity
                                    onPress={() => {
                                        Alert.alert(
                                            "Are you sure you want to go back to the login page?",
                                            "",
                                            [
                                                {
                                                    text: "Cancel",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                },
                                                { text: "Continue", onPress: () => NavigationService.goBack('Login') }
                                            ],
                                            { cancelable: false }
                                        )
                                    }}
                                >
                                    <CustomText style={{ color: '#1788c7', textDecorationLine: 'underline', textAlign: 'center' }}
                                    >
                                        Login Here
                                </CustomText>
                                </TouchableOpacity>

                            </View> */}
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 50, }} />

                        </View>
                    </Content>
                </Container >

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
})(PayNowPayment);
