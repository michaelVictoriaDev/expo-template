import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Icon, Input, Picker, Content, Item, Text, CheckBox, ListItem, Body, Toast } from 'native-base';
import {
    KeyboardAvoidingView, View, Alert, BackHandler, Linking, Keyboard
} from 'react-native';

import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import StepIndicator from 'react-native-step-indicator';
import SignUpAccountDetails from './SignUpAccountDetails'
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
class SignUpLoginDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userNameResult: '',
            CheckBox: false,
            hidePassword: false,
            hidePasswordConfirm: false,
            selected2: 'key0',
            currentPosition: 3,
            isGoBack: false,
            userBasicInfo: this.props.userBasicInfo,
            billAddressSource: this.props.billAddressSource,
            personId: this.props.personId,
            userDetails: {
                EmailID: this.props.userDetails.EmailID,
                home: this.props.users.userContactNumbers.homePhone,
                mobile: this.props.users.userContactNumbers.mobilePhone,
                work: this.props.users.userContactNumbers.workPhone,
                password: '',
                passwordConfirm: '',
                securityAnswer: '',
                userName: ''
            }
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        console.log('userDetails', {
            EmailID: this.props.userDetails.EmailID,
            home: this.props.users.userContactNumbers.homePhone,
            mobile: this.props.users.userContactNumbers.mobilePhone,
            work: this.props.users.userContactNumbers.workPhone
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    // onSubmit() {
    //     const userDetails = this.state.userDetails
    //     if (userDetails.password)

    // }

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

    checkUserNameExist(username) {
        axios
            .post(PAYGWA_URL + '/api/v1/check-username',
                {
                    username: username
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            .then(response => {
                console.log(response.data.result.status)
                const result = response.data.result.status
                if (result === 'False') {
                    this.setState({
                        userNameResult: ``
                    })
                } else {
                    this.setState({
                        userNameResult: `The username ${username} already exists. Please use a different username.`
                    })
                    this.setState({
                        userNameResult: ''
                    })
                }

            })
            .catch(error => {
                console.log('checkUserNameExist', error)

            })
    }


    onValueChange2(value: string) {
        this.setState({
            selectedQuestion: value
        });
    }


    onSumbit() {

        console.log('click')

        console.log('userName', _.isEmpty(this.state.userDetails.userName))
        console.log('password', _.isEmpty(this.state.userDetails.password))
        console.log('passwordConfirm', _.isEmpty(this.state.userDetails.passwordConfirm))
        console.log('EmailID', _.isEmpty(this.state.userDetails.EmailID))
        console.log('securityAnswer', _.isEmpty(this.state.userDetails.securityAnswer))

        if (_.isEmpty(this.state.userDetails.userName) && _.isEmpty(this.state.userDetails.password) && _.isEmpty(this.state.userDetails.passwordConfirm) && _.isEmpty(this.state.userDetails.EmailID) && _.isEmpty(this.state.userDetails.securityAnswer)) {
            console.log('1',_.isEmpty(this.state.userDetails.userName) && _.isEmpty(this.state.userDetails.password) && _.isEmpty(this.state.userDetails.passwordConfirm) && _.isEmpty(this.state.userDetails.EmailID) && _.isEmpty(this.state.userDetails.securityAnswer))
            alert('Please check all the required fields.');
            this.setState({
                ...this.state,
                userNameResult: `Please choose your Username!`,
                userDetails: {
                    ...this.state.userDetails,
                    errorPassword: `Please enter your Password!`,
                    errorPasswordConfirm: `Please confirm your Password!`,
                    errorEmailFormat: 'Please enter a valid Email Address!',
                    errorSecurityQuestion: 'Please enter your Security Answer!'
                }
            })
        } else if (_.isEmpty(this.state.userDetails.userName) && _.isEmpty(this.state.userDetails.password) && _.isEmpty(this.state.userDetails.passwordConfirm) && _.isEmpty(this.state.userDetails.securityAnswer)) {
            alert('Please check all the required fields.');
            console.log('2',_.isEmpty(this.state.userDetails.userName) && _.isEmpty(this.state.userDetails.password) && _.isEmpty(this.state.userDetails.passwordConfirm) && _.isEmpty(this.state.userDetails.securityAnswer))
            this.setState({
                ...this.state,
                userNameResult: `Please choose your Username!`,
                userDetails: {
                    ...this.state.userDetails,
                    errorPassword: `Please enter your Password!`,
                    errorPasswordConfirm: `Please confirm your Password!`,
                    errorSecurityQuestion: 'Please enter your Security Answer!'
                }
            })
        } else if (_.isEmpty(this.state.userDetails.userName) && _.isEmpty(this.state.userDetails.password) && _.isEmpty(this.state.userDetails.passwordConfirm)) {
            console.log('3',_.isEmpty(this.state.userDetails.userName) && _.isEmpty(this.state.userDetails.password) && _.isEmpty(this.state.userDetails.passwordConfirm))
            alert('Please check all the required fields.');
            this.setState({
                ...this.state,
                userNameResult: `Please choose your Username!`,
                userDetails: {
                    ...this.state.userDetails,
                    errorPassword: `Please enter your Password!`,
                    errorPasswordConfirm: `Please confirm your Password!`
                }
            })
        } else if (_.isEmpty(this.state.userDetails.password) && _.isEmpty(this.state.userDetails.passwordConfirm)) {
            console.log('4',_.isEmpty(this.state.userDetails.password) && _.isEmpty(this.state.userDetails.passwordConfirm))
            alert('Please check all the required fields.');
            this.setState({
                ...this.state,
                userDetails: {
                    ...this.state.userDetails,
                    errorPassword: `Please enter your Password!`,
                    errorPasswordConfirm: `Please confirm your Password!`
                }
            })
        } else if (_.isEmpty(this.state.userDetails.userName)) {
            console.log('userName')
            alert('Please check all the required fields.');
            this.setState({
                ...this.state,
                userNameResult: `Please choose your Username!`
            })
        } else if (_.isEmpty(this.state.userDetails.password)) {
            alert('Please check all the required fields.');
            console.log('password')
            this.setState({
                ...this.state,
                userDetails: {
                    ...this.state.userDetails,
                    errorPassword: `Please enter your Password!`
                }
            })

        } else if (_.isEmpty(this.state.userDetails.passwordConfirm)) {
            alert('Please check all the required fields.');
            console.log('passwordConfirm')
            this.setState({
                ...this.state,
                userDetails: {
                    ...this.state.userDetails,
                    errorPasswordConfirm: `Please confirm your Password!`
                }
            })
        } else if (_.isEmpty(this.state.userDetails.EmailID)) {
            alert('Please check all the required fields.');
            console.log('EmailID')
            this.setState({
                ...this.state,
                userDetails: {
                    ...this.state.userDetails,
                    errorEmailFormat: 'Please enter a valid Email Address!'
                }
            })
        } else if (_.isEmpty(this.state.userDetails.securityAnswer)) {
            alert('Please check all the required fields.');
            console.log('securityAnswer')
            this.setState({
                ...this.state,
                userDetails: {
                    ...this.state.userDetails,
                    errorSecurityQuestion: 'Please enter your Security Answer!'
                }
            })
        } else {
            console.log('else')

            this.setState({
                ...this.state,
                userDetails: {
                    ...this.state.userDetails,
                    userNameResult: '',
                    errorPassword: '',
                    errorPasswordConfirm: '',
                    errorEmailFormat: '',
                    errorSecurityQuestion: ''
                }
            })
            if (this.state.selectedQuestion === 0) {
                alert('Please select a security question');
    
            } else {
                console.log('else')
    
                debugger
                const postData = {
                    personId: this.state.personId,
                    username: this.state.userDetails.userName,
                    password: this.state.userDetails.password,
                    email_address: this.state.userDetails.EmailID,
                    security_question_val: this.state.selectedQuestion,
                    security_answer: this.state.userDetails.securityAnswer,
                    home_number: (this.state.userDetails.home === this.props.users.userContactNumbers.homePhone) ? '' : this.state.userDetails.home,
                    mobile_number: (this.state.userDetails.mobile === this.props.users.userContactNumbers.mobilePhone) ? '' : this.state.userDetails.mobile,
                    work_number: (this.state.userDetails.work === this.props.users.userContactNumbers.workPhone) ? '' : this.state.userDetails.work,
                    isDeletedHome: (this.props.users.userContactNumbers.homePhone === undefined || this.props.users.userContactNumbers.homePhone === "" || this.props.users.userContactNumbers.homePhone === null) ? false : true,
                    isDeletedMobile: (this.props.users.userContactNumbers.mobilePhone === undefined || this.props.users.userContactNumbers.mobilePhone === "" || this.props.users.userContactNumbers.mobilePhone === null) ? false : true,
                    isDeletedWork: (this.props.users.userContactNumbers.workPhone === undefined || this.props.users.userContactNumbers.workPhone === "" || this.props.users.userContactNumbers.workPhone === null) ? false : true,
                    homeSeq: (this.state.userDetails.home === this.props.users.userContactNumbers.homePhone) ? '' : this.props.users.userContactNumbers.homePhoneSeq,
                    mobileSeq: (this.state.userDetails.mobile === this.props.users.userContactNumbers.mobilePhone) ? '' : this.props.users.userContactNumbers.mobilePhoneSeq,
                    workSeq: (this.state.userDetails.work === this.props.users.userContactNumbers.workPhone) ? '' : this.props.users.userContactNumbers.workPhoneSeq,
                }
                console.log('postData', postData)
                this.finalSubmit(postData)
            }
        }

        




    }


    finalSubmit(postData) {
        this.setState({
            isLoading: true
        })
        console.log('postData', {
            personId: postData.personId,
            IDNumber: postData.username,
            WebPassword: postData.password,
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
        })
        axios
            .post(PAYGWA_URL + '/api/v1/sign-up-user',
                {
                    personId: postData.personId,
                    IDNumber: postData.username,
                    WebPassword: postData.password,
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
                    headers: { 'Content-Type': 'application/json' }
                })
            .then(response => {
                console.log(response)

                if (response.result.status === 'True') {
                    this.setState({
                        isLoading: false
                    })
                    NavigationService.navigate('SuccessScreen')

                }
                else {
                    Toast.show({
                        text: "Sign Up Failed! \nPlease try again!",
                        duration: 3000,
                        type: 'danger'
                    })
                    // this.props.showMessage(true, "Sign Up Failed! \nPlease try again!")
                    this.setState({
                        isLoading: false
                    })
                }

            })
            .catch(error => {
                console.log(error);
                this.setState({
                    isLoading: false
                })
                Toast.show({
                    text: "Server Error. Try again later!",
                    duration: 3000,
                    type: 'danger'
                })
                // this.props.showMessage(true, "Server Error. Try again later!");
            })

    }

    //RENDER MAIN COMPONENT
    render() {
        return (
            /* MAIN VIEW COMPONENT */
            (this.state.isGoBack === true) ?
                <SignUpAccountDetails userBasicInfo={this.state.userBasicInfo} billAddressSource={this.state.billAddressSource} personId={this.state.personId} />
                :
                <Container >
                    <CustomHeader
                        fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                        leftButtonFunction={() =>
                            this.setState({
                                isGoBack: true
                            })

                        }
                        title="Create Account"
                        RightIcon={<Right />}
                    />
                    <OfflineNotice />

                    <Content>
                        <View style={{ paddingTop: 40, paddingHorizontal: 40 }} >
                            <StepIndicator
                                stepCount={3}
                                customStyles={customStyles}
                                currentPosition={this.state.currentPosition}
                                labels={labels}
                            />
                        </View>
                        <View style={{ backgroundColor: '#FFFF', paddingTop: 30, paddingHorizontal: 60 }}>


                            <View style={{
                                boxSizing: 'border-box',
                                paddingHorizontal: 25,
                                paddingVertical: 25,
                                // padding: 30,  
                                borderRadius: 6,
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderColor: 'lightgray'
                                // border: '10px solid blue'

                            }}>
                                <CustomTextBold style={{ paddingBottom: 5, fontSize: 16 }}>Login Details</CustomTextBold>
                                <CustomText style={{ paddingVertical: 5 }}>Username * (Your username must be different from your PayGPA username)</CustomText>
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
                                        onBlur={e => this.checkUserNameExist(this.state.userDetails.userName)}
                                        textContentType='username'
                                        keyboardType='default'
                                        autoCapitalize='none'
                                        value={this.state.userDetails.userName}
                                        onChangeText={(text) => {
                                            this.setState({
                                                ...this.state,
                                                userDetails: {
                                                    ...this.state.userDetails,
                                                    userName: text
                                                }
                                            })

                                        }}

                                    />

                                </Item>
                                {_.isEmpty(this.state.userNameResult) ?
                                    null
                                    :
                                    <CustomText style={{ paddingVertical: 5, color: colors.RED }}>{this.state.userNameResult}</CustomText>
                                }

                                <CustomText style={{ paddingVertical: 5 }}>Password * (Your password must be between 8 – 15 characters long)</CustomText>
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
                                        // placeholder={'Password'}
                                        // placeholderTextColor='lightgray'
                                        onBlur={e => {
                                            if (this.state.userDetails.password.length < 8) {
                                                this.setState({
                                                    ...this.state,
                                                    userDetails: {
                                                        ...this.state.userDetails,
                                                        errorPassword: `Your password must be between 8 – 15 characters long`
                                                    }
                                                })



                                            }
                                            else {
                                                this.setState({
                                                    ...this.state,
                                                    userDetails: {
                                                        ...this.state.userDetails,
                                                        errorPassword: ''
                                                    }
                                                })
                                            }
                                        }}
                                        secureTextEntry={!this.state.hidePassword}
                                        onChangeText={(text) => {

                                            this.setState({
                                                ...this.state,
                                                userDetails: {
                                                    ...this.state.userDetails,
                                                    password: text
                                                }
                                            })
                                        }}
                                        value={this.state.userDetails.password}
                                        blurOnSubmit={true}
                                    />
                                    <Icon name='eye' onPress={() => {
                                        //TOGGLE EYE COLOR
                                        if (this.state.hidePassword == true) {
                                            this.setState({ eyeColor: 'black' })
                                        } else {
                                            this.setState({ eyeColor: 'lightgray' })
                                        }
                                        this.setState({ hidePassword: !(this.state.hidePassword) })
                                    }}
                                        style={{ color: this.state.eyeColor, }} />
                                </Item>
                                {_.isEmpty(this.state.userDetails.errorPassword) ?
                                    null :
                                    <CustomText style={{ paddingVertical: 5, color: colors.RED }}>{this.state.userDetails.errorPassword}</CustomText>

                                }

                                <CustomText style={{ paddingVertical: 5 }}>Confirm Password *</CustomText>
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
                                        // placeholder={'Password'}
                                        // placeholderTextColor='lightgray'
                                        onBlur={e => {
                                            console.log('Match', this.state.userDetails.password !== this.state.userDetails.passwordConfirm)
                                            if (this.state.userDetails.password !== this.state.userDetails.passwordConfirm) {
                                                this.setState({
                                                    ...this.state,
                                                    userDetails: {
                                                        ...this.state.userDetails,
                                                        errorPasswordConfirm: "The password and confirmation password do not match."
                                                    }
                                                })



                                            }
                                            else {
                                                this.setState({
                                                    ...this.state,
                                                    userDetails: {
                                                        ...this.state.userDetails,
                                                        errorPasswordConfirm: ''
                                                    }
                                                })
                                            }
                                        }}
                                        secureTextEntry={!this.state.hidePasswordConfirm}
                                        value={this.state.userDetails.passwordConfirm}
                                        onChangeText={(text) => {

                                            this.setState({
                                                ...this.state,
                                                userDetails: {
                                                    ...this.state.userDetails,
                                                    passwordConfirm: text
                                                }
                                            })


                                        }}
                                        blurOnSubmit={true}
                                    />
                                    <Icon name='eye' onPress={() => {
                                        //TOGGLE EYE COLOR
                                        if (this.state.hidePasswordConfirm == true) {
                                            this.setState({ eyeColorCormfirmPassword: 'black' })
                                        } else {
                                            this.setState({ eyeColorCormfirmPassword: 'lightgray' })
                                        }
                                        this.setState({ hidePasswordConfirm: !(this.state.hidePasswordConfirm) })
                                    }}
                                        style={{ color: this.state.eyeColorCormfirmPassword, }} />
                                </Item>
                                {_.isEmpty(this.state.userDetails.errorPasswordConfirm) ?
                                    null :
                                    <CustomText style={{ paddingVertical: 5, color: colors.RED }}>{this.state.userDetails.errorPasswordConfirm}</CustomText>
                                }
                            </View>
                            <View style={{ paddingVertical: 20 }} />

                            <View style={{
                                boxSizing: 'border-box',
                                paddingHorizontal: 25,
                                paddingVertical: 25,
                                // padding: 30,  
                                borderRadius: 6,
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderColor: 'lightgray'
                                // border: '10px solid blue'

                            }}>
                                <CustomTextBold style={{ paddingBottom: 5, fontSize: 16 }}>Contact Details</CustomTextBold>
                                <CustomText style={{ paddingVertical: 5 }}>Email Address *</CustomText>
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
                                        onBlur={e => {
                                            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

                                            if (reg.test(this.state.emailAddForgetUsernameGWA) === false) {
                                                console.log("Please enter a valid Email Address.");
                                                this.setState({
                                                    ...this.state,
                                                    userDetails: {
                                                        ...this.state.userDetails,
                                                        errorEmailFormat: `Please enter a valid Email Address.`
                                                    }
                                                })

                                                return false;
                                            } else {
                                                this.setState({
                                                    ...this.state,
                                                    userDetails: {
                                                        ...this.state.userDetails,
                                                        errorEmailFormat: ''
                                                    }
                                                })
                                            }
                                        }}
                                        keyboardType='email-address'
                                        textContentType='emailAddress'
                                        autoCapitalize='none'
                                        value={this.state.userDetails.EmailID}
                                        onChangeText={(text) => {
                                            this.setState({
                                                ...this.state,
                                                userDetails: {
                                                    ...this.state.userDetails,
                                                    EmailID: text
                                                }
                                            })
                                        }}
                                    />

                                </Item>
                                {_.isEmpty(this.state.userDetails.errorEmailFormat) ?
                                    null :
                                    <CustomText style={{ paddingVertical: 5, color: colors.RED }}>{this.state.userDetails.errorEmailFormat}</CustomText>
                                }
                                <CustomText style={{ paddingVertical: 5 }}>Home Phone</CustomText>
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
                                        textContentType='telephoneNumber'
                                        autoCapitalize='none'
                                        value={this.state.userDetails.home}
                                        onChangeText={(input) => {
                                            this.setState({
                                                ...this.state,
                                                userDetails: {
                                                    ...this.state.userDetails,
                                                    home: input
                                                }
                                            })
                                        }}
                                        blurOnSubmit={true}
                                    />

                                </Item>

                                <CustomText style={{ paddingVertical: 5 }}>Mobile Phone</CustomText>
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
                                        textContentType='telephoneNumber'
                                        autoCapitalize='none'
                                        value={this.state.userDetails.mobile}
                                        onChangeText={(input) => {
                                            this.setState({
                                                ...this.state,
                                                userDetails: {
                                                    ...this.state.userDetails,
                                                    mobile: input
                                                }
                                            })
                                        }}
                                        blurOnSubmit={true}
                                    />

                                </Item>
                                <CustomText style={{ paddingVertical: 5 }}>Work Phone</CustomText>
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
                                        textContentType='telephoneNumber'
                                        autoCapitalize='none'
                                        value={this.state.userDetails.work}
                                        onChangeText={(input) => {
                                            this.setState({
                                                ...this.state,
                                                userDetails: {
                                                    ...this.state.userDetails,
                                                    work: input
                                                }
                                            })
                                        }}
                                        blurOnSubmit={true}
                                    />

                                </Item>
                            </View>

                            <View style={{ paddingVertical: 20 }} />

                            <View style={{
                                boxSizing: 'border-box',
                                paddingHorizontal: 25,
                                paddingVertical: 25,
                                // padding: 30,  
                                borderRadius: 6,
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderColor: 'lightgray'
                                // border: '10px solid blue'

                            }}>

                                <CustomTextBold style={{ paddingBottom: 5, fontSize: 16 }}>Security Details</CustomTextBold>
                                <CustomText style={{ paddingVertical: 5 }}>Security Question *</CustomText>
                                <Item regular
                                    style={{
                                        flex: 1,
                                        width: null,
                                        borderStyle: 'solid',
                                        marginLeft: 0,
                                        backgroundColor: colors.WHITE,
                                        borderRadius: 6,
                                        borderColor: 'lightgray',
                                        marginBottom: 5,
                                        borderWidth: 1
                                    }}>

                                    <Picker
                                        mode="dropdown"
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.state.selectedQuestion}
                                        onValueChange={(itemValue, itemIndex) => {

                                            this.setState({
                                                selectedQuestion: itemValue,

                                            })
                                        }}
                                        onValueChange={this.onValueChange2.bind(this)}
                                    >
                                        <Picker.Item style={{ color: "#bfc6ea" }} label="Select your Security Question" value={0} />
                                        {_.map(this.props.users.securityQuestions, (securityQuestions, index) => {
                                            return (
                                                <Picker.Item style={{ color: "#bfc6ea" }} label={securityQuestions.description} value={securityQuestions.characteristicValue} />
                                            )
                                        })
                                        }
                                    </Picker>

                                </Item>
                                <CustomText style={{ paddingVertical: 5 }}>Security Answer</CustomText>
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
                                        onBlur={e => {
                                            if (_.isEmpty(this.state.userDetails.errorSecurityQuestion)) {
                                                this.setState({
                                                    ...this.state,
                                                    userDetails: {
                                                        ...this.state.userDetails,
                                                        errorSecurityQuestion: 'Please enter your Security Answer!'
                                                    }
                                                })
                                            } else {
                                                this.setState({
                                                    ...this.state,
                                                    userDetails: {
                                                        ...this.state.userDetails,
                                                        errorSecurityQuestion: ''
                                                    }
                                                })
                                            }

                                        }}
                                        autoCapitalize='none'
                                        value={this.state.userDetails.securityAnswer}
                                        onChangeText={(text) => {
                                            this.setState({
                                                ...this.state,
                                                userDetails: {
                                                    ...this.state.userDetails,
                                                    securityAnswer: text
                                                }
                                            })
                                        }}

                                        blurOnSubmit={true}
                                    />

                                </Item>
                                {_.isEmpty(this.state.userDetails.errorSecurityQuestion) ?
                                    null :
                                    <CustomText style={{ paddingVertical: 5, color: colors.RED }}>{this.state.userDetails.errorSecurityQuestion}</CustomText>

                                }

                                <ListItem style={{ borderBottomWidth: 0 }}>
                                    <CheckBox checked={this.state.CheckBox} onPress={(e) => this.setState({
                                        CheckBox: !this.state.CheckBox
                                    })} />
                                    <Body style={{ paddingLeft: 5 }}>
                                        <CustomText>I agree to the <CustomText onPress={() => Linking.openURL('https://gwadev.xtendly.com/terms-and-conditions')} style={{ color: '#007bff' }}>Terms and Conditions</CustomText> *</CustomText>

                                    </Body>
                                </ListItem>

                            </View>
                            <View style={{ paddingTop: 30, paddingHorizontal: 30 }}>
                                {this.state.isLoading ?
                                    <Button style={{ borderRadius: 6 }} block success
                                        onPress={() => {
                                            Keyboard.dismiss()
                                            console.log('verify')
                                        }


                                        } disabled={true} >
                                        <Text uppercase={false} >Verifying</Text>
                                    </Button>
                                    :
                                    <Button style={{ borderRadius: 6 }} block success
                                        onPress={() => {
                                            // NavigationService.navigate('SuccessScreen')
                                            Keyboard.dismiss()
                                            this.onSumbit()
                                            this.setState({
                                                ...this.state,
                                                userDetails: {
                                                    ...this.state.userDetails,
                                                    userNameResult: '',
                                                    errorPassword: '',
                                                    errorPasswordConfirm: '',
                                                    errorEmailFormat: '',
                                                    errorSecurityQuestion: ''
                                                }
                                            })
                                        }


                                        } disabled={!this.state.CheckBox} >
                                        <Text uppercase={false} > Submit</Text>
                                    </Button>

                                }
                            </View>
                            <View style={{ paddingVertical: 15, paddingHorizontal: 30 }} >
                                <Button style={{ borderRadius: 6 }} transparent block onPress={() =>
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

                                } >
                                    <Text uppercase={false} style={{ color: colors.GRAYISHRED, textDecorationLine: 'underline' }} >Cancel</Text>
                                </Button>
                            </View>

                            <CustomText style={{ textAlign: 'center', color: '#df0018', justifyContent: 'center', alignItems: 'center', paddingBottom: 30 }}>Fields marked as * are mandatory</CustomText>
                            <View style={{ paddingTop: 30 }} />
                        </View>
                    </Content>

                </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    users: state.users
})

export default connect(mapStateToProps, {

})(SignUpLoginDetails);
