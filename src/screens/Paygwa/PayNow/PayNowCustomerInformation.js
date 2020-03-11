import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Icon, Input, Content, Item, Text } from 'native-base';
import {
    View
} from 'react-native';

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
import PayNowValidation from '../PayNow/PayNowValidation';
import NavigationService from '../../../NavigationService';
import StepIndicator from 'react-native-step-indicator';


const labels = ["Customer Information", "Validation", "Enter Payment"];
const customStyles = {
    stepIndicatorSize: 35,
    currentStepIndicatorSize: 40,
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

class PayNowCustomerInformation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            billAddressSource: '',
            resultMessage: '',
            isSuccess: false,
            showSample: false,
            isLoading: false,
            // accountId: '0103703286',
            accountId: '',
            isValid: false,
            errors: false,
            currentPosition: 0
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


    onPaymentStepComplete = () => {

    };


    onSubmit = () => {
 
        this.setState({
            isLoading: false,
            isSuccess: true,

        })
    }

    // End of Account Number Details Function


    //RENDER MAIN COMPONENT
    render() {

        return (
            /* MAIN VIEW COMPONENT */

            (this.state.isSuccess === true) ?
                <PayNowValidation />
                :
                <Container >
                    <CustomHeader
                        fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                        leftButtonFunction={() => NavigationService.goBack('Login')}
                        title="Pay Now"
                        RightIcon={<Right />}
                    />
                    <OfflineNotice />
                    <View style={{ paddingVertical: 20, paddingHorizontal: 40 }} >
                        <StepIndicator
                            stepCount={3}
                            customStyles={customStyles}
                            currentPosition={this.state.currentPosition}
                            labels={labels}
                        />
                    </View>
                    <Content style={{ backgroundColor: colors.WHITE, paddingHorizontal: 60, paddingTop: 30 }} >
                        <View style={{ paddingBottom: 15 }}>
                            <CustomText style={{ paddingVertical: 5 }}>Enter the 10-digit account number </CustomText>
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
                                    borderColor: this.state.isValid ? 'red' : 'lightgray',
                                    marginBottom: 5,
                                    borderWidth: 1,
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
                                {this.state.isValid ?
                                    <Icon onPress={() => {
                                        this.setState({
                                            ...this.state,
                                            accountId: ''
                                        })
                                    }} style={{ color: colors.RED }} name='close-circle' />
                                    :
                                    null
                                }

                            </Item>
                        </View>
                        <View style={{ paddingBottom: 10 }}>
                            <CustomText style={{ paddingVertical: 5 }}>Billing Zip Code (Enter your 5-digit zip code.) </CustomText>
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
                                    borderColor: this.state.isValid ? 'red' : 'lightgray',
                                    marginBottom: 5,
                                    borderWidth: 1,
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
                                {this.state.isValid ?
                                    <Icon onPress={() => {
                                        this.setState({
                                            ...this.state,
                                            billingZipCode: ''
                                        })
                                    }} style={{ color: colors.RED }} name='close-circle' />
                                    :
                                    null
                                }

                            </Item>
                        </View>
                        <View style={{ paddingVertical: 15 }}>
                            <Button block success onPress={this.onSubmit.bind(this)} disabled={this.state.isLoading}>
                                <Text>{this.state.isLoading ? 'Please wait' : 'Continue'}</Text>
                            </Button>
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
