import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button, Container, Header, Left, Body, Right, Badge, Footer, FooterTab, Icon, Input, Picker, Toast, CheckBox, Content, ListItem, Form, Item, Text, Spinner } from 'native-base';
import {
    KeyboardAvoidingView,
    PixelRatio, StyleSheet, Dimensions, TouchableHighlight, Image, Alert, AppState, FlatList, Linking, View, ActivityIndicator, Platform, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserAvatar from 'react-native-user-avatar';
import Moment from 'moment';
import Modal from 'react-native-modal'
import Modals, { ModalFooter, ModalButton, ModalContent, SlideAnimation, ModalTitle } from 'react-native-modals';
import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import { Grid, Row, Col } from 'react-native-easy-grid';
import SignUpLoginDetails from './SignUpLoginDetails'
import SignUpCreateAccount from './SignUpCreateAccount'
import StepIndicator from 'react-native-step-indicator';
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

class SignUpAccountDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            billingZipCode: '',
            showModal: false,
            isSuccess: false,
            isGoBack: false,
            currentPosition: 1
        }
    }


    handleClose() {
        this.setState({ showModal: false });
    }
    handleShow() {
        this.setState({ showModal: true });
    }


    onPageChange(position) {
        this.setState({ currentPosition: position });
    }

    //RENDER MAIN COMPONENT
    render() {
        // const userBasicInfo = this.props.users.userBasicInfo;

        // let fullName = userBasicInfo.fullName;

        // const slice1Fname = fullName.slice(0, 2);
        // const slice2Fname = fullName.slice(2).replace(/[\S]/g, "*");
        // fullName = slice1Fname + slice2Fname;

        // let userAddressDetails = this.props.users.userAddressDetails, userPremAddressDetails = this.props.users.userPremAddressDetails, userAcovAddressDetails = this.props.users.userAcovAddressDetails, addressDetails;
        // if (this.props.billAddressSource === "PER") {
        //     addressDetails = userAddressDetails.address1 + ", " + userAddressDetails.city + ", " + userAddressDetails.state + ", " + userAddressDetails.postal + ", " + userAddressDetails.country
        // }
        // else if (this.props.billAddressSource === "PREM") {
        //     addressDetails = userPremAddressDetails.address1 + ", " + userPremAddressDetails.city + ", " + userPremAddressDetails.state + ", " + userPremAddressDetails.postal + ", " + userPremAddressDetails.country
        // }
        // else if (this.props.billAddressSource === "ACOV") {
        //     addressDetails = userAcovAddressDetails.address1 + ", " + userAcovAddressDetails.city + ", " + userAcovAddressDetails.state + ", " + userAcovAddressDetails.postal + ", " + userAcovAddressDetails.country
        // }

        // const slice1AddDetails = addressDetails.slice(0, 10);
        // const slice2AddDetails = addressDetails.slice(10).replace(/[\S]/g, "X");
        // const finalAddressDetails = slice1AddDetails + slice2AddDetails;

        const modalMessage = "Should the above address be incorrect, please select cancel and call GWA 7:30am to 6:00pm) or email us at customers@guamwaterworks.org";
        let modalShow = <Modal isVisible={this.state.showModal} backdropColor={'rgba(0,0,0,.4)'} backdropOpacity={1} animationIn={'zoomInDown'} animationOut={'zoomOutUp'}
            animationInTiming={1000} animationOutTiming={1000} backdropTransitionInTiming={1000} backdropTransitionOutTiming={1000}
            onRequestClose={() => this.setState({ showModal: false })}
        >
            <View style={{ backgroundColor: colors.WHITE, paddingHorizontal: 20, paddingVertical: 20 }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                    <CustomTextBold style={{ paddingVertical: 5 }}>Confirm Your Address</CustomTextBold>
                    <CustomTextBold style={{ paddingVertical: 5 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</CustomTextBold>
                    <CustomText style={{ paddingVertical: 5 }}>{modalMessage}</CustomText>
                </View>
                <View style={{ paddingVertical: 10 }}>
                    <Button block success onPress={() => {
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
                    <Button block light onPress={() => this.setState({ showModal: false })}  >
                        <Text style={{ color: colors.BLACK }}>Cancel</Text>
                    </Button>
                </View>
            </View>
        </Modal>;

        return (
            /* MAIN VIEW COMPONENT */
            (this.state.isSuccess === true && this.state.showModal === false) ?
                <SignUpLoginDetails />
                :
                this.state.isGoBack === true ?
                    <SignUpCreateAccount />
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
                        <Content style={{ backgroundColor: '#FFFF', paddingHorizontal: 40, paddingTop: 30  }}>
                            <KeyboardAvoidingView
                                behavior="padding"
                            >
                                {modalShow}
                                <CustomText style={{ paddingVertical: 10 }}>Customer Name</CustomText>
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
                                        value={'Michael Roevie Victoria'}

                                    />

                                </Item>

                                <CustomText style={{ paddingVertical: 10 }}>Billing Zip Code: (Enter your 5-digit zip code.)</CustomText>
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
                                    <Button block success onPress={() => this.setState({ showModal: true })} >
                                        <Text>Continue</Text>
                                    </Button>
                                </View>
                                <View style={{ paddingVertical: 15 }}>
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
    users: state.users
})

export default connect(mapStateToProps, {

})(SignUpAccountDetails);
