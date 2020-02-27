import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button, Container, Header, Left, Body, Right, Badge, Footer, FooterTab, Icon, Input, Picker, Toast, CheckBox, Content, ListItem, Form, Item, Text } from 'native-base';
import {
    PixelRatio, StyleSheet, Dimensions, TouchableHighlight, Image, Alert, AppState, FlatList, Linking, View, ActivityIndicator, Platform, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import Moment from 'moment';
import Modal from 'react-native-modal';
import {
    searchString
} from '../../../../actions/userMyAccounts';
import { colors, pRatioToFontSize } from '../../../../utils/constants';
import CustomText from '../../../../components/CustomText';
import CustomTextBold from '../../../../components/CustomTextBold';
import OfflineNotice from '../../../../components/OfflineNotice';
import CustomHeader from '../../../../components/MultiCustomHeader'
import { Grid, Row, Col } from 'react-native-easy-grid';
import { FontAwesome } from '@expo/vector-icons';
import _ from 'lodash';

class PaymentSuccess extends Component {
    constructor(props) {
        super(props);

        this.state = {
            paymentResult: this.props.navigation.state.params.paymentResult,
            accountSummary: this.props.navigation.state.params.accountSummary
        }
    }
    componentDidMount() {
        console.log(this.props.navigation.state.params.paymentResult)
    }


    getFieldValue = (str, result) => {
        return this.props.searchString(str, result)
    }

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
                <Content>
                    <View style={{
                        paddingTop: 25,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <FontAwesome
                            name='check-circle'
                            size={pRatioToFontSize(+5) > 50 ? 50 : pRatioToFontSize(+5)}
                            color={colors.LIGHT_GREEN}
                        />
                        <CustomTextBold adjustsFontSizeToFit style={{ fontSize: pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1) }}> Approved - Thank you</CustomTextBold>
                    </View>
                    <Row style={{
                        paddingVertical: 25, paddingHorizontal: 25,
                    }}
                    >
                    <Col size={50}>
                            <CustomTextBold numberOfLines={1} ellipsizeMode='tail'  style={{ fontSize: pRatioToFontSize(+1) > 16 ? 16 : pRatioToFontSize(+1) }}>CARD & AMOUNT:</CustomTextBold>
                            <CustomTextBold numberOfLines={1} ellipsizeMode='tail'  style={{ fontSize: pRatioToFontSize(+1) > 16 ? 16 : pRatioToFontSize(+1) }}>CARDHOLDER NAME:</CustomTextBold>
                            <CustomTextBold numberOfLines={1} ellipsizeMode='tail'  style={{ fontSize: pRatioToFontSize(+1) > 16 ? 16 : pRatioToFontSize(+1) }}>DATE/TIME:</CustomTextBold>
                            <CustomTextBold numberOfLines={1} ellipsizeMode='tail'  style={{ fontSize: pRatioToFontSize(+1) > 16 ? 16 : pRatioToFontSize(+1) }}>REFERENCE #:</CustomTextBold>
                            <CustomTextBold numberOfLines={1} ellipsizeMode='tail'  style={{ fontSize: pRatioToFontSize(+1) > 16 ? 16 : pRatioToFontSize(+1) }}>AUTHORIZATION #:</CustomTextBold>
                            <CustomTextBold numberOfLines={1} ellipsizeMode='tail'  style={{ fontSize: pRatioToFontSize(+1) > 16 ? 16 : pRatioToFontSize(+1) }}>RECEIPT NO.:</CustomTextBold>

                    </Col>
                    <Col size={50}>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: pRatioToFontSize(+1) > 16 ? 16 : pRatioToFontSize(+1) }}> {result.data.CardType + " $ " + parseFloat(Math.round(result.data.DollarAmount * 100) / 100).toFixed(2) + " " + result.data.Currency}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: pRatioToFontSize(+1) > 16 ? 16 : pRatioToFontSize(+1) }}> {result.data.CardHoldersName}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: pRatioToFontSize(+1) > 16 ? 16 : pRatioToFontSize(+1) }}>{" "+dateTime}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: pRatioToFontSize(+1) > 16 ? 16 : pRatioToFontSize(+1) }}>{this.getFieldValue("REFERENCE #", result)} </CustomText>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: pRatioToFontSize(+1) > 16 ? 16 : pRatioToFontSize(+1) }}>{this.getFieldValue("AUTHOR. #", result)}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: pRatioToFontSize(+1) > 16 ? 16 : pRatioToFontSize(+1) }}>{this.getFieldValue("TRANS. REF.", result)}</CustomText>
                    </Col>
                           
                    </Row>
                    <View style={{
                        
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <CustomTextBold adjustsFontSizeToFit style={{ fontSize: pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1) }}>Accounts Paid:</CustomTextBold>
                    </View>
                    <Row style={{
                        paddingVertical: 25, paddingHorizontal: 30,
                    }}
                    >
                        <Col size={50}>
                            <CustomTextBold adjustsFontSizeToFit style={{ fontSize: pRatioToFontSize(+1) > 18 ? 18 : pRatioToFontSize(+1) }}>ACCOUNT ID:</CustomTextBold>
                            {_.map(this.state.accountSummary, (item, index) => {
                                return (
                                    <CustomText key={index} adjustsFontSizeToFit style={{ fontSize: pRatioToFontSize(+1) > 18 ? 18 : pRatioToFontSize(+1) }}>{item.accID}</CustomText>
                                )
                            })
                            }
                        </Col>
                        <Col size={50}>
                            <CustomTextBold adjustsFontSizeToFit style={{ fontSize: pRatioToFontSize(+1) > 18 ? 18 : pRatioToFontSize(+1) }}>AMOUNT:</CustomTextBold>
                            {_.map(this.state.accountSummary, (item, index) => {
                                return (
                                    <CustomText key={index} adjustsFontSizeToFit style={{ fontSize: pRatioToFontSize(+1) > 18 ? 18 : pRatioToFontSize(+1) }}>{"$ " + parseFloat(Math.round(item.amountToBePaid * 100) / 100).toFixed(2)}</CustomText>
                                )
                            })
                            }
                        </Col>

                    </Row>
                    <View style={{
                        paddingVertical: 25, paddingHorizontal: 30,
                    }}>
                        <Button block rounded transparent
                            style={{ marginTop: 25, backgroundColor: colors.PRIMARY_COLOR, borderRadius: 6, borderWidth: 0.5, height: 50 }}
                            onPress={() => {
                                this.props.navigation.navigate('MyAccounts', {
                                    onGoBack: () => this.onRefresh
                                })
                            }
                            }>
                            <CustomText style={{ color: colors.WHITE }}>Back to Home</CustomText>
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
    searchString
})(PaymentSuccess);
