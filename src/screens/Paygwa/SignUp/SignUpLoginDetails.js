import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button, Container, Header, Left, Body, Right, Badge, Footer, FooterTab, Icon, Input, Picker, Toast, CheckBox, Content, ListItem, Form, Item, Text } from 'native-base';
import {
    KeyboardAvoidingView,
    PixelRatio, StyleSheet, Dimensions, TouchableHighlight, Image, Alert, AppState, FlatList, Linking, View, ActivityIndicator, Platform, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserAvatar from 'react-native-user-avatar';
import Moment from 'moment';
import Modal from 'react-native-modal';

import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import RNPickerSelect from 'react-native-picker-select';
import { Grid, Row, Col } from 'react-native-easy-grid';
import StepIndicator from 'react-native-step-indicator';
import SignUpAccountDetails from './SignUpAccountDetails'
import NavigationService from '../../../NavigationService';



const labels = ["ENTER ACCOUNT NO.", "ACCOUNT DETAILS", "LOGIN DETAILS"];
const customStyles = {
    stepIndicatorSize: 35,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: colors.PRIMARY_COLOR,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: colors.PRIMARY_COLOR,
    stepStrokeUnFinishedColor: colors.PRIMARY_COLOR,
    separatorFinishedColor: colors.PRIMARY_COLOR,
    separatorUnFinishedColor: colors.PRIMARY_COLOR,
    stepIndicatorFinishedColor: colors.PRIMARY_COLOR,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 14,
    currentStepIndicatorLabelFontSize: 14,
    stepIndicatorLabelCurrentColor: colors.PRIMARY_COLOR,
    stepIndicatorLabelFinishedColor: colors.WHITE,
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: colors.BLACK,
    labelSize: 14,
    currentStepLabelColor: colors.BLACK
}
class SignUpLoginDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hidePassword: false,
            hidePasswordConfirm: false,
            selected2: 'key0',
            currentPosition: 3,
            isGoBack: false,
        }
    }


    onValueChange2(value: string) {
        this.setState({
            selected2: value
        });
    }

    onPageChange(position) {
        this.setState({ currentPosition: position });
    }

    //RENDER MAIN COMPONENT
    render() {
        return (
            /* MAIN VIEW COMPONENT */
            (this.state.isGoBack === true) ?
                <SignUpAccountDetails />
                :
                <Container >
                    <CustomHeader
                        fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                        leftButtonFunction={() => NavigationService.goBack('Login')}
                        title="Create Account"
                        RightIcon={<Right />}
                    />
                    <OfflineNotice />
                    <View style={{ paddingVertical: 10, paddingHorizontal: 40 }} >
                        <StepIndicator
                            stepCount={3}
                            customStyles={customStyles}
                            currentPosition={this.state.currentPosition}
                            labels={labels}
                        />
                    </View>
                    <Content style={{ backgroundColor: '#FFFF', paddingHorizontal: 40 }}>
                        <KeyboardAvoidingView
                            behavior="padding"
                        >

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
                                <CustomText style={{ paddingVertical: 5 }}>UserName</CustomText>
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
                                        textContentType='username'
                                        keyboardType='default'
                                        autoCapitalize='none'
                                        value={this.state.userName}
                                        onChangeText={(text) => {
                                            this.setState({
                                                ...this.state,
                                                userName: text
                                            })
                                        }}
                                    />

                                </Item>
                                <CustomText style={{ paddingVertical: 5 }}>Password</CustomText>
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
                                        secureTextEntry={this.state.hidePassword}
                                        onChangeText={(input) => {
                                            this.setState({
                                                password: input
                                            })
                                        }}
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

                                <CustomText style={{ paddingVertical: 5 }}>Confirm Password</CustomText>
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
                                        secureTextEntry={this.state.hidePasswordConfirm}
                                        onChangeText={(input) => {
                                            this.setState({
                                                confirmPassword: input
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
                                <CustomText style={{ paddingVertical: 5 }}>Email Address</CustomText>
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
                                        blurOnSubmit={true}
                                        keyboardType='email-address'
                                        textContentType='emailAddress'
                                        autoCapitalize='none'
                                        value={this.state.emailAdd}
                                        onChangeText={(text) => {
                                            this.setState({
                                                ...this.state,
                                                emailAdd: text
                                            })
                                        }}
                                    />

                                </Item>
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
                                        secureTextEntry={this.state.homePhone}
                                        onChangeText={(input) => {
                                            this.setState({
                                                homePhone: input
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
                                        secureTextEntry={this.state.mobilePhone}
                                        onChangeText={(input) => {
                                            this.setState({
                                                mobilePhone: input
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
                                        secureTextEntry={this.state.workPhone}
                                        onChangeText={(input) => {
                                            this.setState({
                                                workPhone: input
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
                                <CustomText style={{ paddingVertical: 5 }}>Security Question</CustomText>
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
                                        selectedValue={this.state.selected2}
                                        onValueChange={this.onValueChange2.bind(this)}
                                    >
                                        <Picker.Item style={{ color: "#bfc6ea" }} label="Select your Security Question" value="key0" />
                                        <Picker.Item label="ATM Card" value="key1" />
                                        <Picker.Item label="Debit Card" value="key2" />
                                        <Picker.Item label="Credit Card" value="key3" />
                                        <Picker.Item label="Net Banking" value="key4" />
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

                                        autoCapitalize='none'
                                        secureTextEntry={this.state.securityAnswer}
                                        onChangeText={(input) => {
                                            this.setState({
                                                securityAnswer: input
                                            })
                                        }}
                                        blurOnSubmit={true}
                                    />

                                </Item>

                            </View>
                            <View style={{ paddingTop: 30, paddingHorizontal: 30 }}>
                                <Button block success onPress={() => console.log('Done')} >
                                    <Text>Submit</Text>
                                </Button>
                            </View>
                            <View style={{ paddingVertical: 15, paddingHorizontal: 30, paddingBottom: 100 }} >
                                <Button block light onPress={() =>
                                    this.setState({
                                        isGoBack: true
                                    })
                                } >
                                    <Text>Back</Text>
                                </Button>
                            </View>
                        </KeyboardAvoidingView>
                    </Content>

                </Container>
        )
    }
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, {

})(SignUpLoginDetails);
