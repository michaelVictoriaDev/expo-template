import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Footer, FooterTab, Input, Toast, Content, Item, DatePicker, Header, Title, Left, Body, Icon, Form, Picker } from 'native-base';
import {
    Image, View
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
import { colors, pRatioToFontSize, months, years } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import { Grid, Row, Col } from 'react-native-easy-grid';
import moment from 'moment'
import NumberFormat from 'react-number-format';

import 'intl';
import 'intl/locale-data/jsonp/fr';



class PaymentPayNow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAccounts: this.props.navigation.state.params.selectedAccounts,
            selectedAccountsId: this.props.navigation.state.params.selectedAccountsId,
            subtotal: this.props.navigation.state.params.subtotal,
            isPaymentProcessing: false,
            cardDetails: {
                cardHolderName: "Xtendly Dev",
                cardHolderName: "",
                // cardNumber: "4111111111111111",
                cardNumber: "",
                expDate: new Date(),
                validExpDate: "",
                cvv: "123",
                // cvv: "",
                confirmationEmail: this.props.dashboard.userAccountDetails.emailAddress,
                selectedMonth: ('0' + (moment().month() + 1)).slice(-2),
                selectedYear: moment().format("YY")
            },


        }
    }
    componentWillMount() {
        this.setState({
            userFullName: this.props.dashboard.userAccountDetails.fullName === undefined ? "" : this.props.dashboard.userAccountDetails.fullName,
            username: this.props.userName,
        })
        console.log('userFullName', this.props.dashboard.userAccountDetails.fullName === undefined ? "" : this.props.dashboard.userAccountDetails.fullName)
        console.log('username', this.props.userName)

        console.log(this.state.cardDetails.selectedYear)
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


    //RENDER MAIN COMPONENT
    render() {
        let mytextvar = 'Billing Zip Code'
        return (
            /* MAIN VIEW COMPONENT */
            <Container >
                {/* <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={this.props.navigation.goBack}
                    title="My Account"
                    RightIcon={<Right />}
                /> */}

                <Header style={{
                    backgroundColor: colors.PRIMARY_COLOR,
                }}
                >
                    <Left style={{ flex: 1 }} />
                    <Body style={{ flex: 3, alignItems: 'center' }}>
                        <Title style={{ color: colors.WHITE, fontSize: 18, fontFamily: 'Lato_Bold' }}>My Account</Title>
                    </Body>
                    <Right />
                </Header>
                <OfflineNotice />
                <Content>
                    <View style={{ paddingVertical: 25, paddingHorizontal: 25 }}>
                        <CustomTextBold style={{ paddingBottom: 10, fontSize: 12 }} >Pay with Credit Card</CustomTextBold>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            paddingBottom: 15
                        }}>
                            <View style={{ paddingRight: 5 }}><Image source={require('../../../../assets/credit-cards/visa-logo.png')} /></View>
                            <View style={{ paddingRight: 5 }}><Image source={require('../../../../assets/credit-cards/master-logo.png')} /></View>
                            <View style={{ paddingRight: 5 }}><Image source={require('../../../../assets/credit-cards/discover-logo.png')} /></View>
                        </View>
                        <CustomText style={{ paddingBottom: 10, fontSize: 12, color: '#000000' }} >Credit Cardholder Name</CustomText>
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
                                keyboardType="default"
                                value={this.state.cardDetails.cardHolderName}
                                onChangeText={this._handleMultiInput('cardHolderName')}
                            />


                        </Item>
                        <CustomText style={{ paddingBottom: 10, fontSize: 12 }} >Card Number</CustomText>
                        <Item regular
                            style={{
                                marginLeft: 0,
                                backgroundColor: colors.WHITE,
                                borderRadius: 6,
                                borderColor: 'lightgray',
                                marginBottom: 10
                            }}>

                            <NumberFormat
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
                            />
                            {
                                this.showCardType()
                            }
                        </Item>

                        <Row>
                            <Col size={70}>
                                <CustomText style={{ paddingBottom: 10, fontSize: 12 }} >Expiration Date</CustomText>
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
                                            style={{ width: 120 }}
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
                                            style={{ width: 120 }}
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
                            <Col size={3} />
                            <Col size={27}>
                                <CustomText style={{ paddingBottom: 10, fontSize: 12 }} >CVV</CustomText>
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
                            </Col>
                        </Row>

                    </View>
                </Content>
                <Footer>
                    <FooterTab style={{ backgroundColor: colors.LIGHT_GREEN }}>
                        <Button full
                            onPress={() => {

                                console.log('cardDetails', this.state.cardDetails)
                                this.props.navigation.navigate('PaymentView',
                                    {
                                        selectedAccounts: this.state.selectedAccounts,
                                        selectedAccountsId: this.state.selectedAccountsId,
                                        subtotal: this.state.subtotal,
                                        cardDetails: this.state.cardDetails,
                                        screenAccountSummaryKey : this.props.navigation.state.params.screenAccountSummaryKey
                                    })
                            }}
                        >
                            <CustomText style={{ color: colors.WHITE, fontSize: 16 }}>Continue </CustomText>
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
})(PaymentPayNow);
