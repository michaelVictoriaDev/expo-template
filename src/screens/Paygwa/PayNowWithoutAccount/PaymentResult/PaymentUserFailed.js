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
import { Grid, Row, Col } from 'react-native-easy-grid';
import { FontAwesome } from '@expo/vector-icons';

class PaymentUserFailed extends Component {
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
                        justifyContent: 'center',
                    }}>
                        <FontAwesome
                            name='times-circle-o'
                            size={60}
                            color={'#c40808'}
                        />
                        <CustomText />
                        <CustomTextBold adjustsFontSizeToFit style={{ fontSize: 24, textAlignVertical: "center", textAlign: "center" }}> Sorry, your payment was not processed.</CustomTextBold>
                        <CustomText style={{ paddingVertical: 5, paddingHorizontal: 25, fontSize: 14, textAlignVertical: "center", textAlign: "center", }}>We're sorry, but your transaction was either declined or could not be completed.</CustomText>
                        <CustomText style={{ paddingVertical: 5, paddingHorizontal: 25, fontSize: 14, textAlignVertical: "center", textAlign: "center", }}>Please refer to the information below regarding your transaction failure. Print a copy of this page for your records.</CustomText>
                    </View>
                    <Row style={{
                        paddingTop: 20, paddingHorizontal: 25,
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
                            <CustomText adjustsFontSizeToFit style={{ paddingBottom: 10, fontSize: 16 }}>{result.data.CardType + " $ " + parseFloat(Math.round(result.data.DollarAmount * 100) / 100).toFixed(2) + " " + result.data.Currency}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ paddingBottom: 10, fontSize: 16 }}>{result.data.CardHoldersName}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: 16, paddingBottom: 10 }}> {result.data.Card_Number}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ paddingBottom: 10, fontSize: 16 }}>{" " + dateTime}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ paddingBottom: 10, fontSize: 16 }}>{this.getFieldValue("REFERENCE #", result)}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ paddingBottom: 10, fontSize: 16 }}>{this.getFieldValue("AUTHOR. #", result)}</CustomText>
                            <CustomText adjustsFontSizeToFit style={{ fontSize: 16 }}>{this.getFieldValue("TRANS. REF.", result)}</CustomText>
                        </Col>

                    </Row>
                    <View style={{
                       paddingBottom: 40, paddingHorizontal: 60,
                    }}>
                        <Button block rounded transparent
                            style={{ marginTop: 25, backgroundColor: colors.PRIMARY_COLOR, borderRadius: 6, borderWidth: 0.5, height: 50 }}
                            onPress={() => {
                                this.props.navigation.pop(2)
                            }
                            }>
                            <CustomText style={{ color: colors.WHITE, fontSize: 16 }}>Pay Again</CustomText>
                        </Button>
                        <Button style={{ borderRadius: 6 }} transparent block onPress={() => {
                            this.props.navigation.navigate('MyAccounts')
                        }} >
                            <CustomText uppercase={false} style={{ color: colors.GRAYISHRED, fontSize: 12, textDecorationLine: 'underline' }} >Cancel</CustomText>
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
})(PaymentUserFailed);
