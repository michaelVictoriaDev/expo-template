import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Input, Content, Item, Text } from 'native-base';
import {
    KeyboardAvoidingView, View
} from 'react-native';
import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import PayNowCustomerInformation from './PayNowCustomerInformation'
import PayNowEnterPayment from './PayNowEnterPayment'
// import SignUpCreateAccount from './SignUpCreateAccount'
import StepIndicator from 'react-native-step-indicator';
import NavigationService from '../../../NavigationService';


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
    currentStepLabelColor: colors.BLACK
}

class PayNowValidation extends Component {
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



    //RENDER MAIN COMPONENT
    render() {

        let fullName = 'Michael Roevie Victoria'
        const slice1Fname = fullName.slice(0, 2);
        const slice2Fname = fullName.slice(2).replace(/[\S]/g, "*");
        fullName = slice1Fname + slice2Fname;


        let fullAddress = 'Unit 503, Prime Land Tower, Venture St, Ayala Alabang, Muntinlupa, 1770 Metro Manila'
        const slice1Faddress = fullAddress.slice(0, 2);
        const slice2Faddress = fullAddress.slice(2).replace(/[\S]/g, "*");
        fullAddress = slice1Faddress + slice2Faddress;

        return (
            /* MAIN VIEW COMPONENT */
            (this.state.isSuccess === true && this.state.showModal === false) ?
                <PayNowEnterPayment/>
                :
                this.state.isGoBack === true ?
                     <PayNowCustomerInformation />
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
                       
                        <Content style={{ backgroundColor: '#FFFF', paddingHorizontal: 40, paddingTop: 30 }}>
                            <KeyboardAvoidingView
                                behavior="padding"
                            >
                                <CustomTextBold style={{ paddingVertical: 10, fontSize: 18 }}>Is This You ?</CustomTextBold>
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
                                        backgroundColor: '#e6ebf4'
                                    }}>
                                    <Input
                                        disabled
                                        value={fullName}

                                    />

                                </Item>

                                <CustomText style={{ paddingVertical: 10 }}>Address</CustomText>
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
                                        value={fullAddress}
                                    />

                                </Item>
                                <View style={{ paddingVertical: 15 }}>
                                    <Button block success onPress={() => this.setState({
                                        showModal: false,
                                        isSuccess: true
                                    })} >
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

})(PayNowValidation);
