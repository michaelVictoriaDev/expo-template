import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Content } from 'native-base';
import {
    View
} from 'react-native';
import {
    searchString
} from '../../../../actions/userMyAccounts';
import { colors, pRatioToFontSize } from '../../../../utils/constants';
import CustomText from '../../../../components/CustomText';
import CustomTextBold from '../../../../components/CustomTextBold';
import OfflineNotice from '../../../../components/OfflineNotice';
import CustomHeader from '../../../../components/MultiCustomHeader'
import { Row, Col } from 'react-native-easy-grid';
import { FontAwesome } from '@expo/vector-icons';
import _ from 'lodash';
import { captureRef, ViewShot } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { NavigationActions } from 'react-navigation';
import NavigationService from  '../../../../NavigationService'



class PaymentSuccess extends Component {
    constructor(props) {
        super(props);

        this.state = {
            paymentResult: this.props.navigation.state.params.paymentResult,
            accountSummary: this.props.navigation.state.params.accountSummary
        }
    }
    componentDidMount() {
    }


    getFieldValue = (str, result) => {
        return this.props.searchString(str, result)
    }

    // openShareDialogAsync = () => {
    //     captureRef(this._shareViewContainer, {
    //         snapshotContentContainer: true,
    //     }).then(
    //         uri => {
    //             console.log('Snapshot uri', uri);
    //             // https://github.com/expo/expo/issues/6920#issuecomment-580966657
    //             Sharing.shareAsync('file://' + uri);
    //         },
    //         error => console.error('Oops, snapshot failed', error)
    //     );
    // }


    //RENDER MAIN COMPONENT
    render() {
        const result = this.state.paymentResult
        let today = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let date = today.getDate() + ' ' + months[today.getMonth()] + ' ' + today.getFullYear();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date + ' ' + time;
        return (
            /* MAIN VIEW COMPONENT */
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={this.props.navigation.goBack}
                    title="Pay Now"
                    RightIcon={<Right />}
                />
                <OfflineNotice />
                <Content >


                    <View style={{
                        paddingTop: 25,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <FontAwesome
                            name='check-circle'
                            size={60}
                            color={colors.LIGHT_GREEN}
                        />
                        <CustomText />
                        <CustomText adjustsFontSizeToFit style={{ fontSize: 24 }}> Approved! Thank you!</CustomText>
                    </View>
                    <Row style={{
                        paddingVertical: 20, paddingHorizontal: 25,
                    }}
                    >
                        <Col size={50}>
                            <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Card & Amount:</CustomText>
                            <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Cardholder Name:</CustomText>
                            <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Card Number:</CustomText>
                            <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Date/Time:</CustomText>
                            <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Reference #:</CustomText>
                            <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Authorization #:</CustomText>
                            <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Receipt #.:</CustomText>

                        </Col>
                        <Col size={50} style={{ alignItems: 'flex-end' }}>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: 16, paddingBottom: 10 }}> {result.data.CardType + " $ " + parseFloat(Math.round(result.data.DollarAmount * 100) / 100).toFixed(2) + " " + result.data.Currency}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: 16, paddingBottom: 10 }}> {result.data.CardHoldersName}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: 16, paddingBottom: 10 }}> {result.data.Card_Number}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: 16, paddingBottom: 10 }}>{" " + dateTime}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: 16, paddingBottom: 10 }}>{this.getFieldValue("REFERENCE #", result)} </CustomText>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: 16, paddingBottom: 10 }}>{this.getFieldValue("AUTHOR. #", result)}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: 16 }}>{this.getFieldValue("TRANS. REF.", result)}</CustomText>


                        </Col>

                    </Row>
                    <View style={{
                        borderBottomWidth: .6,
                        borderColor: '#666666',
                        marginLeft: 15,
                        marginRight: 15,
                        marginTop: 15,
                        marginBottom: 20
                        // marginRight: 15 ,


                    }} />
                    <View style={{

                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <CustomTextBold adjustsFontSizeToFit style={{ fontSize: 18 }}>Accounts Paid</CustomTextBold>
                    </View>
                    <Row style={{
                        paddingVertical: 20, paddingHorizontal: 30,
                    }}
                    >
                        <Col size={50}>
                            {_.map(this.state.accountSummary, (item, index) => {
                                debugger
                                return (
                                    <CustomText key={index} adjustsFontSizeToFit style={{ fontSize: 16, color: '#333333' }}>{item.accID[0]}</CustomText>
                                )
                            })
                            }

                            <CustomTextBold adjustsFontSizeToFit style={{ paddingTop: 10, fontSize: 18, color: '#333333' }}>Total Amount</CustomTextBold>
                        </Col>
                        <Col size={50} style={{ alignItems: 'flex-end' }}>
                            {_.map(this.state.accountSummary, (item, index) => {
                                debugger
                                return (
                                    <CustomText key={index} adjustsFontSizeToFit style={{ fontSize: 16 }}>{"$ " + parseFloat(Math.round(item.amountToBePaid * 100) / 100).toFixed(2)}</CustomText>
                                )
                            })
                            }
                            {_.sumBy(this.state.accountSummary, (item, index) => {
                                debugger
                                return (
                                    <CustomText key={index} adjustsFontSizeToFit style={{ paddingTop: 10, fontSize: 24 }}>{"$ " + parseFloat(Math.round(item.amountToBePaid * 100) / 100).toFixed(2)}</CustomText>
                                )
                            })
                            }


                        </Col>

                    </Row>
                    <View style={{
                        paddingBottom: 40, paddingHorizontal: 60,
                    }}>
                        <Button block rounded transparent
                            style={{ marginTop: 25, backgroundColor: '#4caf50', borderRadius: 6, borderWidth: 0.5, height: 50 }}
                            onPress={() => {
                                // this.props.navigation.navigate('MyAccounts')
                                // this.props.navigation.navigate.goBack('AccountSummary')
                                // this.props.navigation.dispatch(NavigationActions.back('AccountSummary'))
                                // this.props.navigation.navigate.goBack('AccountSummary')
                                // NavigationService.goBack('AccountSummary')
                                console.log(this.props.navigation.goBack(this.props.navigation.state.params.screenAccountSummaryKey))
                                this.props.navigation.goBack(this.props.navigation.state.params.screenAccountSummaryKey);
                            }
                            }>
                            <CustomText style={{ color: colors.WHITE, fontSize: 16 }}>Back to Dashboard</CustomText>
                        </Button>


                        <Button style={{ borderRadius: 6 }} transparent block onPress={this.openShareDialogAsync} >
                            <CustomText uppercase={false} style={{ color: colors.GRAYISHRED, fontSize: 12, textDecorationLine: 'underline' }} >Download PDF Copy</CustomText>
                        </Button>
                    </View>

                </Content >
            </Container >
        )
    }
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, {
    searchString
})(PaymentSuccess);
