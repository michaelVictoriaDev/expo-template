import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button, Container, Header, Left, Body, Right, Badge, Footer, FooterTab, Icon, Input, Picker, Toast, CheckBox, Content, ListItem, Form, Item, Text } from 'native-base';
import {
    PixelRatio, StyleSheet, Dimensions, TouchableHighlight, Image, Alert, AppState, FlatList, Linking, View, ActivityIndicator, Platform, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserAvatar from 'react-native-user-avatar';
import Moment from 'moment';
import Modal from 'react-native-modal';
import {
    saveAccountId,
    savePremiseAddress,
    fetchMultipleAddOpptyRequest,
    fetchMultipleLatestBill,
    saveOrderData
} from '../../../actions/userMyAccounts';
import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import { Grid, Row, Col } from 'react-native-easy-grid';

class PaymentView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAccounts: this.props.navigation.state.params.selectedAccounts,
            selectedAccountsId: this.props.navigation.state.params.selectedAccountsId,
            subtotal: this.props.navigation.state.params.subtotal
        }
    }


    //RENDER MAIN COMPONENT
    render() {
        return (
            /* MAIN VIEW COMPONENT */
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={this.props.navigation.goBack}
                    title="Payment"
                    RightIcon={<Right />}
                    />
                <OfflineNotice />
                <Content style={{ backgroundColor: '#ECEFF2'}}>
                    <View style={{ backgroundColor: colors.WHITE, borderBottomWidth: .3, borderColor: '#3b4043', paddingVertical: 25, paddingHorizontal: 25 }}>
                        <CustomTextBold style={{ color: colors.PRIMARY_COLOR, fontSize: 20 }}>Enter Payment Amount</CustomTextBold>
                        <CustomText>Kindly review before you proceed.</CustomText>
                    </View>
                    <View style={{ backgroundColor: colors.WHITE, borderBottomWidth: .3, borderColor: '#3b4043', paddingVertical: 25, paddingHorizontal: 25 }}>
                        <CustomTextBold >Payment Reference Number</CustomTextBold>
                        <CustomText style={{ fontSize: 16 }}>{this.state.selectedAccountsId.length === 1 ?
                            this.state.selectedAccountsId[0] :
                            _.join(this.state.selectedAccountsId, ', ')}</CustomText>
                        <CustomTextBold >Account Name</CustomTextBold>
                        <CustomText style={{ paddingTop: 5, fontSize: 16 }}>{this.state.selectedAccounts[0].fullName}</CustomText>
                    </View>
                    <View style={{ backgroundColor: colors.WHITE, paddingVertical: 25, paddingHorizontal: 25 }}>
                        <CustomText style={{ paddingBottom: 5, fontSize: 16 }} >Account Number</CustomText>
                        {_.map(this.state.selectedAccounts, (data, index) => {
                            return (
                                <Row style={{ paddingBottom: 5 }}>
                                    <Col>
                                        <CustomText style={{ fontSize: 18 }} >{data.accID}</CustomText>
                                      
                                    </Col>
                                    <Col style={{ alignItems: 'flex-end' }}>
                                        <CustomText style={{ fontSize: 18 }} >$ {parseFloat(data.amountToBePaid).toFixed(2)}
                                        </CustomText>
                                    </Col>
                                </Row>)
                        })
                        }
                    </View>
                    <View style={{ paddingHorizontal: 25, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <CustomTextBold style={{ paddingBottom: 5, fontSize: 24, textAlign: 'center' }} >$ {parseFloat(this.state.subtotal).toFixed(2)}</CustomTextBold>
                        <CustomText style={{ color: '#998B8C' }}>TOTAL</CustomText>
                    </View>
                </Content>
                <Footer>
                    <FooterTab style={{ backgroundColor: '#4CAF50' }}>
                        <Button full
                            onPress={() => {
                                this.props.navigation.navigate('PaymentPayNow',
                                    {
                                        selectedAccounts: this.state.selectedAccounts,
                                        selectedAccountsId: this.state.selectedAccountsId,
                                        subtotal: this.state.subtotal
                                    })
                            }}
                        >
                            <CustomText style={{ color: colors.WHITE }}>Pay Now </CustomText>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    userPersonId: state.userState.userPersonId,
    accountIds: state.userState.accountIds,
    accountId: state.userState.accountId,
    dashboard: state.dashboard
})

export default connect(mapStateToProps, {
    saveAccountId,
    savePremiseAddress,
    fetchMultipleAddOpptyRequest,
    fetchMultipleLatestBill,
    saveOrderData
})(PaymentView);
