import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Input, Content, Item, Text } from 'native-base';
import {
    KeyboardAvoidingView, View, Platform, Keyboard, Alert, BackHandler
} from 'react-native';
import Modal from 'react-native-modal'
import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import SignUpLoginDetails from './SignUpLoginDetails'
import SignUpCreateAccount from './SignUpCreateAccount'
import StepIndicator from 'react-native-step-indicator';
import NavigationService from '../../../NavigationService';
import axios from 'react-native-axios';
import { PAYGWA_URL, DASHBOARD_URL, PAYNOW_URL } from 'react-native-dotenv';


const labels = ["My Account Number", "My Account Details", "My Login Details"];
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

class SignUpAccountDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            billingZipCode: '',
            showModal: false,
            isSuccess: false,
            isGoBack: false,
            currentPosition: 1,
            billAddressSource: this.props.billAddressSource,
            personId: this.props.personId,
            accountId: this.props.accountId,
            error: '',
            isLoading: false
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
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
        return true;
    }
    handleClose() {
        this.setState({ showModal: false });
    }
    handleShow() {
        this.setState({ showModal: true });
    }


    verificationDetails() {
        debugger

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
                    this.setState({
                        showModal: true,
                        userDetails: response.data.result.details,
                        error: '',
                        isLoading: false
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

    //RENDER MAIN COMPONENT
    render() {

        const userBasicInfo = this.props.users.userBasicInfo;
        let fullName = userBasicInfo.fullName;

        const slice1Fname = fullName.slice(0, 2);
        const slice2Fname = fullName.slice(2).replace(/[\S]/g, "*");
        fullName = slice1Fname + slice2Fname;

        let str = userBasicInfo.fullName;
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
        fullName = new_str;
        // let firstName = (fullName.substr(0,fullName.indexOf(' ')).trim()).split(" ")[0]
        // let lastName  = fullName.substr(fullName.indexOf(' ')+1)
        // if(lastName === "", fullName.includes(',')){
        //     firstName = (fullName.substr(fullName.indexOf(',')+1).trim()).split(" ")[0]
        //     lastName  = fullName.substr(0,fullName.indexOf(','))
        // }

        // const slice1Fname = firstName.slice(0, 2);
        // const slice2Fname = firstName.slice(2).replace(/[\S]/g, "*");
        // firstName = slice1Fname+slice2Fname;

        // const slice1Lname = lastName.slice(0, 2);
        // const slice2Lname = lastName.slice(2).replace(/[\S]/g, "*");
        // lastName = slice1Lname+slice2Lname;

        let userAddressDetails = this.props.users.userAddressDetails, userPremAddressDetails = this.props.users.userPremAddressDetails, userAcovAddressDetails = this.props.users.userAcovAddressDetails, addressDetails;
        if (this.props.billAddressSource === "PER") {
            addressDetails = userAddressDetails.address1 + ", " + userAddressDetails.city + ", " + userAddressDetails.state + ", " + userAddressDetails.postal + ", " + userAddressDetails.country
        }
        else if (this.props.billAddressSource === "PREM") {
            addressDetails = userPremAddressDetails.address1 + ", " + userPremAddressDetails.city + ", " + userPremAddressDetails.state + ", " + userPremAddressDetails.postal + ", " + userPremAddressDetails.country
        }
        else if (this.props.billAddressSource === "ACOV") {
            addressDetails = userAcovAddressDetails.address1 + ", " + userAcovAddressDetails.city + ", " + userAcovAddressDetails.state + ", " + userAcovAddressDetails.postal + ", " + userAcovAddressDetails.country
        }

        let str1 = addressDetails;
        let count1 = 0;
        let new_str1 = "";
        for (let i = 0; i < str1.length; i++) {
            if (count1 > 1) {
                if (str1.charAt(i) != " ") {
                    new_str1 = new_str1 + 'X'
                    count1 = count1 + 1
                }
                else {
                    new_str1 = new_str1 + " "
                    count1 = 0;
                }

            }
            else if (count1 < 2) {
                if (str1.charAt(i) != " ") {
                    new_str1 = new_str1 + str1.charAt(i)
                    count1 = count1 + 1
                }
                else {
                    new_str1 = new_str1 + " "
                    count1 = 0;
                }
            }

        }
        const finalAddressDetails = new_str1;




        const modalMessage = "Should the above address be incorrect, please select cancel and call GWA at (671) 647-7800/3 (7:30am to 6:00pm) or email us at customers@guamwaterworks.org";
        let modalShow = <Modal isVisible={this.state.showModal} backdropColor={'rgba(0,0,0,.4)'} backdropOpacity={1} animationIn={'zoomInDown'} animationOut={'zoomOutUp'}
            animationInTiming={1000} animationOutTiming={1000} backdropTransitionInTiming={1000} backdropTransitionOutTiming={1000}
            onRequestClose={() => this.setState({ showModal: false })}
        >
            <View style={{ backgroundColor: colors.WHITE, paddingHorizontal: 20, paddingVertical: 20 }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                    <CustomTextBold style={{ paddingVertical: 5 }}>Confirm Your Address</CustomTextBold>
                    <CustomTextBold style={{ paddingVertical: 5 }}>{finalAddressDetails}</CustomTextBold>
                    <CustomText style={{ paddingVertical: 5, fontStyle: 'italic' }}>{modalMessage}</CustomText>
                </View>
                <View style={{ paddingVertical: 10 }}>
                    <Button style={{ borderRadius: 6 }} block success onPress={() => {
                        this.setState({
                            showModal: false,
                            isSuccess: true
                        })
                    }
                    }>
                        <Text>Yes, Proceed</Text>
                    </Button>
                </View>
                <View style={{ paddingVertical: 10 }} >
                    <Button style={{ borderRadius: 6 }} block light onPress={() => this.setState({ showModal: false })}  >
                        <Text style={{ color: colors.BLACK }}>Cancel</Text>
                    </Button>
                </View>
            </View>
        </Modal>;

        return (
            /* MAIN VIEW COMPONENT */
            (this.state.isSuccess === true && this.state.showModal === false) ?
                <SignUpLoginDetails userBasicInfo={this.props.users.userBasicInfo} billAddressSource={this.state.billAddressSource} personId={this.state.personId} userDetails={this.state.userDetails} />
                :
                this.state.isGoBack === true ?
                    <SignUpCreateAccount />
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
                            title="Create Account"
                            RightIcon={<Right />}
                        />
                        <OfflineNotice />


                        <Content >
                            <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "padding" : null}
                                style={{ flex: 1 }}
                            >
                                <View style={{ paddingTop: 40, paddingHorizontal: 40 }} >
                                    <StepIndicator
                                        stepCount={3}
                                        customStyles={customStyles}
                                        currentPosition={this.state.currentPosition}
                                        labels={labels}
                                    />
                                </View>
                                <View style={{ backgroundColor: '#FFFF', paddingTop: 30, paddingHorizontal: 60 }}>


                                    {modalShow}
                                    <CustomText style={{ textAlign: 'center', color: colors.RED }}>{this.state.error}</CustomText>
                                    <CustomText style={{ paddingVertical: 10 }}>Customer Name *</CustomText>
                                    <Item regular
                                        style={{
                                            borderStyle: 'solid',
                                            marginLeft: 0,
                                            backgroundColor: colors.WHITE,
                                            borderRadius: 6,
                                            borderColor: 'lightgray',
                                            marginBottom: 5,
                                            borderWidth: 1,
                                        }}>
                                        <Input
                                            disabled
                                            value={fullName}

                                        />

                                    </Item>

                                    <CustomText style={{ paddingVertical: 10 }}>GWA Billing Zip Code: (Enter your 5-digit zip code.) *</CustomText>
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
                                            maxLength={5}
                                            value={this.state.billingZipCode}
                                            onChangeText={(text) => {
                                                this.setState({
                                                    ...this.state,
                                                    billingZipCode: text
                                                })
                                            }}
                                        />

                                    </Item>
                                    <View style={{ paddingVertical: 15 }}>
                                        <Button style={{ borderRadius: 6 }} block success
                                            disabled={this.state.isLoading}
                                            onPress={() => {
                                                Keyboard.dismiss()
                                                this.setState({
                                                    isLoading: true
                                                })
                                                this.verificationDetails()
                                            }


                                            } >
                                            <Text uppercase={false} >{this.state.isLoading ? 'Verifying' : 'Continue'}</Text>
                                        </Button>
                                    </View>
                                    <View style={{ paddingVertical: 15 }}>
                                        <Button style={{ borderRadius: 6 }} transparent block onPress={() => {
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
                                        }} >
                                            <Text uppercase={false} style={{ color: colors.GRAYISHRED }} >Cancel</Text>
                                        </Button>
                                    </View>
                                    <CustomText style={{ textAlign: 'center', color: '#df0018', paddingVertical: 15 }}>Fields marked as * are mandatory</CustomText>
                                </View>
                            </KeyboardAvoidingView>
                        </Content>

                    </Container>

        )
    }
}

const mapStateToProps = (state) => ({
    users: state.users
})

export default connect(mapStateToProps, {

})(SignUpAccountDetails);
