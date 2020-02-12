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
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import { Grid, Row, Col } from 'react-native-easy-grid';

class PaymentView extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }


    //RENDER MAIN COMPONENT
    render() {
        return (
            /* MAIN VIEW COMPONENT */
            <Container >
                <CustomHeader
                    leftButtonFunction={this.props.navigation.goBack}
                    title="Payment" />
                <OfflineNotice />
                <CustomText>PaymentView</CustomText>
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
