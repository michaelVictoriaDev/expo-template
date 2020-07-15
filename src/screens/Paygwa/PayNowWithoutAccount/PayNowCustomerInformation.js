import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Icon, Input, Content, Item, Text, Toast } from 'native-base';
import {
    View, TouchableOpacity, Image, Alert, BackHandler, Keyboard
} from 'react-native';

// import SignUpAccountDetails from './SignUpAccountDetails'
import PayNowValidation from './PayNowValidation'
import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import {
    checkAccountNumber,
    getOtherDetails,
    getPremiseInfo,
    getAcovInfo
} from '../../../actions/userSignUp';

import NavigationService from '../../../NavigationService';
import StepIndicator from 'react-native-step-indicator';
import Modal from 'react-native-modal'

import axios from 'react-native-axios';
import { PAYGWA_URL, DASHBOARD_URL, PAYNOW_URL } from 'react-native-dotenv';


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

class PayNowCustomerInformation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            billAddressSource: '',
            resultMessage: '',
            resultMessageBilling: '',
            isSuccess: false,
            showSample: false,
            isLoading: false,
            accountId: '3430200000',
            billingZipCode: '96921',
            // accountId: '',
            // billingZipCode: '',
            isValid: false,
            isValidBilling: false,
            errors: false,
            currentPosition: 0,
            isModalShow: false,
            userLatestBill: []
        }
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
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        NavigationService.goBack()
        return true;
    }

    onSubmit() {
        if (_.isEmpty(this.state.accountId) || _.isEmpty(this.state.billingZipCode)) {
            alert('Please check all the required fields.');
            if (_.isEmpty(this.state.accountId)) {
                this.setState({
                    isValid: true,
                    resultMessage: `Please enter your Account Number.`
                })
            } else {
                this.setState({
                    isValid: false,
                    resultMessage: ``
                })
            }

            if (_.isEmpty(this.state.billingZipCode)) {
                this.setState({
                    isValidBilling: true,
                    resultMessageBilling: `Please enter your zip code.`
                })
            } else {
                this.setState({
                    isValidBilling: false,
                    resultMessageBilling: ``
                })
            }
        } else {
            console.log('Proceed')
            debugger
            this.setState({
                isLoading: true
            })
            axios
                .post(
                    PAYNOW_URL + '/api/v1/validate-account',
                    {
                        accountId: this.state.accountId,
                        division: 'GWA',
                        postal: this.state.billingZipCode
                    },
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                )
                .then(response => {
                    const result = response.data.result.status
                    console.log('result', result)
                    console.log('result2', response.data.result.details)
                    if (result === 'Success') {
                        axios.post(DASHBOARD_URL + '/api/v1/user-latest-bill',
                            {
                                accountId: this.state.accountId
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    "origin": "https://gwadev.xtendly.com"
                                }
                            })
                            .then(response => {

                                console.log('/api/v1/user-latest-bill', response.data.result)
                                this.setState({
                                    error: '',
                                    isLoading: false,
                                    isSuccess: true,
                                    userLatestBill: response.data.result
                                })

                            })
                            .catch(error => {
                                console.log(error)
                                this.setState({
                                    isLoading: false,
                                    error: 'Server Error in user latest bill'
                                })
                            })

                        this.setState({
                            showModal: true,
                            userDetails: response.data.result.details,
                        })



                    } else {
                        this.setState({
                            error: response.data.result.details,
                            isLoading: false
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.setState({
                        isLoading: false,
                        error: 'Server Error'
                    })
                })




        }
    }

    proceed() {

    }




    // End of Account Number Details Function


    //RENDER MAIN COMPONENT
    render() {

        return (
            /* MAIN VIEW COMPONENT */

            (this.state.isSuccess === true) ?
                <PayNowValidation
                    userDetails={this.state.userDetails}
                    userLatestBill={this.state.userLatestBill}
                />

                :
                <Container >
                    <CustomHeader
                        fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                        // LeftIcon={<Right />}
                        leftButtonFunction={() => NavigationService.goBack()}
                        title="Pay Now"
                        RightIcon={<Right />}
                    />
                    {this.state.isModalShow ?
                        <Modal isVisible={this.state.isModalShow} backdropColor={'rgba(0,0,0,.4)'} backdropOpacity={1}
                            avoidKeyboard={true}
                            onBackdropPress={() => this.setState({ isModalShow: false })}
                        >
                            <View style={{ backgroundColor: colors.WHITE, padding: 10 }}>
                                <Image source={require('../../../../assets/gwa-bill-preview.png')}
                                    style={{
                                        width: '100%',
                                        //    maxWidth: '400',
                                        height: '100%',
                                        justifyContent: 'center', alignItems: 'center'
                                    }} />

                            </View>
                        </Modal>

                        :
                        null

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

                            <CustomText style={{ textAlign: 'center', color: colors.RED }}>{this.state.error}</CustomText>

                            <CustomText style={{ paddingVertical: 5 }}>Enter the 10-digit account number  *</CustomText>
                            {this.state.isValid ?
                                <CustomText style={{
                                    color: colors.RED, paddingVertical: 5
                                }}>
                                    {
                                        this.state.isValid ?
                                            this.state.resultMessage
                                            :
                                            null
                                    }
                                </CustomText>
                                :
                                null
                            }
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
                                    value={this.state.accountId}
                                    onChangeText={(text) => {
                                        this.setState({
                                            ...this.state,
                                            accountId: text
                                        })
                                    }}
                                />
                                {/* {this.state.isValid ?
                                    <Icon onPress={() => {
                                        this.setState({
                                            ...this.state,
                                            accountId: ''
                                        })
                                    }} style={{ color: colors.RED }} name='close-circle' />
                                    :
                                    null
                                } */}

                            </Item>

                            <View style={{ paddingBottom: 15 }}>

                                <TouchableOpacity underlayColor={colors.GRAYISHRED} onPress={() => this.setState({ isModalShow: true })}>
                                    <CustomText style={{ color: '#1788c7', textAlign: 'center', textDecorationLine: 'underline', fontSize: 12 }}>Where can I find my account number?</CustomText>
                                </TouchableOpacity>
                            </View>

                            <CustomText style={{ paddingVertical: 5 }}>Billing Zip Code (Enter your 5 digit zip code)</CustomText>
                            {this.state.isValidBilling ?
                                <CustomText style={{
                                    color: colors.RED, paddingVertical: 5
                                }}>
                                    {
                                        this.state.isValidBilling ?
                                            this.state.resultMessageBilling
                                            :
                                            null
                                    }
                                </CustomText>
                                :
                                null
                            }
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
                                    maxLength={5}
                                    keyboardType='numeric'
                                    autoCapitalize='none'
                                    value={this.state.billingZipCode}
                                    onChangeText={(text) => {
                                        this.setState({
                                            ...this.state,
                                            billingZipCode: text
                                        })
                                    }}
                                />
                                {/* {this.state.isValid ?
                                    <Icon onPress={() => {
                                        this.setState({
                                            ...this.state,
                                            zipCode: ''
                                        })
                                    }} style={{ color: colors.RED }} name='close-circle' />
                                    :
                                    null
                                } */}

                            </Item>

                            <View style={{ paddingTop: 15, paddingBottom: 20 }}>
                                <Button style={{ borderRadius: 5 }} block success
                                    onPress={() => {
                                        Keyboard.dismiss()
                                        debugger

                                        this.onSubmit()
                                    }

                                    } disabled={this.state.isLoading}>
                                    <CustomText style={{ fontSize: 16, color: colors.WHITE }} uppercase={false} >{this.state.isLoading ? 'Verifying' : 'Continue'}</CustomText>
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
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 50, }}>
                                <CustomText style={{ textAlign: 'center' }}>
                                    <CustomText style={{ textAlign: 'center', color: '#df0018', fontSize: 18 }} >* </CustomText><CustomText style={{ textAlign: 'center', color: '#df0018', fontSize: 12 }}>Information should match your {"\n"} billing statement</CustomText>
                                </CustomText>
                            </View>
                        </View>
                    </Content>
                </Container>

        )
    }
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, {
    checkAccountNumber,
    getOtherDetails,
    getPremiseInfo,
    getAcovInfo
})(PayNowCustomerInformation);