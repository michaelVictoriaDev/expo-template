import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Icon, Input, Picker, Content, Item, Text } from 'native-base';
import {
    KeyboardAvoidingView, View
} from 'react-native';

import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import StepIndicator from 'react-native-step-indicator';
import PayNowValidation from './PayNowValidation'
import NavigationService from '../../../NavigationService';
import NumberFormat from 'react-number-format';
import { Row, Col, Grid } from 'react-native-easy-grid';


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

class PayNowEnterPayment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hidePassword: false,
            hidePasswordConfirm: false,
            selected2: 'key0',
            currentPosition: 3,
            isGoBack: false,
            amountToBePaid: '1000.00'
        }
    }


    onValueChange2(value: string) {
        this.setState({
            selected2: value
        });
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
            (this.state.isGoBack === true) ?
                <PayNowValidation />
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
                                <CustomText style={{ paddingVertical: 5 }}>Amount to be paid</CustomText>
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
                                    fixedDecimalScale
                                        
                                        value={this.state.amountToBePaid}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$ '}
                                        renderText={value => (
                                            <Input
                                                textAlign={'left'}
                                                autoCapitalize='none'
                                                placeholderTextColor='lightgray'
                                                keyboardType="numeric"
                                                value={value}
                                                onChangeText={(value) => this.setState({
                                                    amountToBePaid: value
                                                })}
                                            />
                                        )}
                                    />

                                </Item>
                                <CustomText style={{ paddingVertical: 5 }}>Card Holder Name</CustomText>
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

                                        onChangeText={(input) => {
                                            this.setState({
                                                cardHolderName: input
                                            })
                                        }}
                                        blurOnSubmit={true}
                                    />

                                </Item>

                                <CustomText style={{ paddingVertical: 5 }}>Card Number</CustomText>
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
                                        onChangeText={(input) => {
                                            this.setState({
                                                cardNumber: input
                                            })
                                        }}
                                        blurOnSubmit={true}
                                    />

                                </Item>
                                <CustomText style={{ paddingVertical: 5 }}>Expiration Date</CustomText>
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
                                        onChangeText={(input) => {
                                            this.setState({
                                                cardNumber: input
                                            })
                                        }}
                                        blurOnSubmit={true}
                                    />

                                </Item>
                                <CustomText style={{ paddingVertical: 5 }}>CVV</CustomText>
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
                                            onChangeText={(input) => {
                                                this.setState({
                                                    cardNumber: input
                                                })
                                            }}
                                            blurOnSubmit={true}
                                        />

                                    </Item>

               
                                <CustomText style={{ paddingVertical: 5 }}>Confirmation Email</CustomText>
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
                                        onChangeText={(input) => {
                                            this.setState({
                                                cardNumber: input
                                            })
                                        }}
                                        blurOnSubmit={true}
                                    />

                                </Item>
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
                                        borderWidth: 1
                                    }}>
                                    <Input
                                        disabled
                                        value={fullAddress}
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

})(PayNowEnterPayment);
