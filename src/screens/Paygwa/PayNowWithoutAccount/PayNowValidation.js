import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Icon, Input, Content, Item, Text, Toast } from 'native-base';
import {
    View, TouchableOpacity, Image, Alert, BackHandler, Keyboard
} from 'react-native';

// import SignUpAccountDetails from './SignUpAccountDetails'
import PayNowCustomerInformation from './PayNowCustomerInformation'
import PayNowPayment from './PayNowPayment'
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

class PayNowValidation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            accountSummary: this.props.accountSummary,
            userDetails: this.props.userDetails,
            userLatestBill: this.props.userLatestBill,
            currentPosition: 1
        }
        this.onSubmit = this.onSubmit.bind(this);
    }
    // For Function ProgressStep
    defaultScrollViewProps = {
        keyboardShouldPersistTaps: 'handled',
        contentContainerStyle: {
            flex: 1,
            justifyContent: 'center'
        }
    };


    componentDidMount() {
        console.log(this.props.userDetails.Name)
    }



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

    onSubmit = () => {
        this.setState({
            isSuccess: true
        })
    }



    // End of Account Number Details Function



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

        let fullName = this.state.userDetails.Name
        const finalFullName = this.maskString(fullName);


        let fullAddress = this.state.userDetails.Address
        const finalAdd1 = this.maskString(fullAddress);

        return (
            /* MAIN VIEW COMPONENT */

            (this.state.isSuccess === true) ?
                <PayNowPayment
                    userDetails={this.state.userDetails}
                    userLatestBill={this.state.userLatestBill}
                    accountSummary={this.state.accountSummary}
                />

                // null
                :
                this.state.isGoBack === true ?
                    <PayNowCustomerInformation
                        accountSummary={this.state.accountSummary}
                        userDetails={this.state.userDetails}
                        userLatestBill={this.state.userLatestBill} />
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
                        {/* {this.state.isModalShow ?
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

                        } */}
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

                                <CustomText style={{ paddingVertical: 15, fontSize: 24, textAlign: 'center' }}>Is This You?</CustomText>


                                <CustomText style={{ paddingVertical: 5 }}>Customer Name</CustomText>
                                <Item regular
                                    style={{
                                        borderStyle: 'solid',
                                        marginLeft: 0,
                                        backgroundColor: colors.WHITE,
                                        borderRadius: 6,
                                        borderColor: 'lightgray',
                                        marginBottom: 5,
                                        borderWidth: 1,
                                        backgroundColor: '#e6ebf4'
                                    }}>
                                    <Input
                                        disabled
                                        value={finalFullName}

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

                                <CustomText style={{ paddingVertical: 5 }}>Address</CustomText>
                                <Item regular
                                    style={{
                                        borderStyle: 'solid',
                                        marginLeft: 0,
                                        backgroundColor: colors.WHITE,
                                        borderRadius: 6,
                                        borderColor: 'lightgray',
                                        marginBottom: 5,
                                        borderWidth: 1,
                                        backgroundColor: '#e6ebf4'
                                    }}>
                                    <Input
                                        disabled
                                        value={finalAdd1}

                                    />


                                </Item>

                                <View style={{ paddingTop: 15, paddingBottom: 20 }}>
                                    <Button style={{ borderRadius: 5 }} block success onPress={this.onSubmit.bind(this)} >
                                        <CustomText style={{ fontSize: 16, color: colors.WHITE }} uppercase={false} >{'Continue'}</CustomText>
                                    </Button>
                                </View>
                                <View style={{ paddingHorizontal: 30 }} >
                                    <Button style={{ borderRadius: 6 }} transparent block onPress={() =>
                                        NavigationService.goBack()

                                    } >
                                        <CustomText uppercase={false} style={{ color: '#999999', CustomTextDecorationLine: 'underline' }} >Cancel</CustomText>
                                    </Button>
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
})(PayNowValidation);
