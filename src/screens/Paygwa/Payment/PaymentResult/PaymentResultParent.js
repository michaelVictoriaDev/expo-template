import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button, Container, Header, Left, Body, Right, Badge, Footer, FooterTab, Icon, Input, Picker, Toast, CheckBox, Content, ListItem, Form, Item, Text } from 'native-base';
import {
    PixelRatio, StyleSheet, Dimensions, TouchableHighlight, Image, Alert, AppState, FlatList, Linking, View, ActivityIndicator, Platform, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import Moment from 'moment';
import Modal from 'react-native-modal';
import {
    saveAccountId,
    savePremiseAddress,
    fetchMultipleAddOpptyRequest,
    fetchMultipleLatestBill,
    saveOrderData
} from '../../../../actions/userMyAccounts';
import { colors, pRatioToFontSize } from '../../../../utils/constants'; 
import CustomText from '.../../../../components/CustomText';
import CustomTextBold from '.../../../../components/CustomTextBold';
import OfflineNotice from '.../../../../components/OfflineNotice';
import CustomHeader from '.../../../../components/MultiCustomHeader'
import { Grid, Row, Col } from 'react-native-easy-grid';

class PaymentResultParent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            paymentResult: "",
            accountSummary: ""
        }
    }
    componentDidMount() {

    }

    //RENDER MAIN COMPONENT
    render() {

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
                    {
                        this.state.paymentResult === "true" ?
                        <PaymentSuccess result={this.state.paymentResult} accountSummary={this.state.accountSummary} />
                        :
                        this.state.paymentResult === "serverFailed" ?
                        <PaymentServerFailed result={this.state.paymentResult} accountSummary={this.state.accountSummary} />
                        :
                        this.state.paymentResult === "false" ?
                        <PaymentUserFailed result={this.state.paymentResult} accountSummary={this.state.accountSummary} />
                        :
                        null
                    }
                </Content>
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
})(PaymentResultParent);
