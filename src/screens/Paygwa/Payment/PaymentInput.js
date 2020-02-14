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
} from '../../../actions/userMyAccounts';
import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import { Grid, Row, Col } from 'react-native-easy-grid';
import { FETCH_CONSUMPTION_DETAILS } from '../../../actions/types';

class PaymentInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAccounts: this.props.navigation.state.params.selectedAccounts,
      selectedAccountsId: this.props.navigation.state.params.selectedAccountsId,
      setOfAmountValue: [],
      subtotal: this.props.navigation.state.params.subtotal
    }
  }
  componentDidMount (){
    console.log(this.props.navigation.state.params.selectedAccounts)
  }

  // _handleMultiInput(index) {

  //   return (text) => {
  //     this.setState({ 
  //       ...this.state.selectedAccounts[index],
  //       amountToBePaid: text
  //      })
  //     console.log('value', this.state.amountToBePaid)
  //     console.log('index', index)
  //   }

  // }
  amountToBePaidOnChange = (accountId, text) => {
    
    const id = accountId, value = text
    const arrAccountSummary = this.state.selectedAccounts
    let selectedIndex = ""

    _.map(arrAccountSummary, (data, index) => {
      if (data.accID === id) {
        selectedIndex = index
      }
    })

    arrAccountSummary[selectedIndex].amountToBePaid = (value === "") ? 0 : value
    this.setState({
      ...this.state,
      selectedAccounts: arrAccountSummary
    }, () => { this.updateSubTotal() })

    console.log('arrAccountSummary', arrAccountSummary)
  }

  updateSubTotal = () => {
    let subtotal = 0
    const arrAccountSummary = this.state.selectedAccounts

    _.map(arrAccountSummary, (data, index)=> {
      subtotal = subtotal + parseFloat(data.amountToBePaid === "" ? 0 : data.amountToBePaid)
      console.log("subtotal", subtotal)
    })

    this.setState({
      subtotal: subtotal
    })
    // console.log("subtotal",subtotal)
  }
    // saveOrderData = () => {
    //     const orderData = this.props.dashboard.orderData;
    //     const postData = {
    //         subTotal: this.state.subtotal,
    //         accountSummary: orderData.isHasInvalid ? orderData.accountSummary : this.sortAccountSummary(),
    //         isHasInvalid: orderData.isHasInvalid ? true : false
    //     }
    //     this.props.saveOrderData(postData)
    // }

  //RENDER MAIN COMPONENT
  render() {
    const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    return (
      /* MAIN VIEW COMPONENT */
      <Container >
        <CustomHeader
        fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
        leftButtonFunction={this.props.navigation.goBack}
        title="Payment"
        RightIcon={<Right /> }
        />
        <OfflineNotice />
        <Content>
          <View style={{ borderBottomWidth: .3, borderColor: '#3b4043', paddingVertical: 25, paddingHorizontal: 25 }}>
            <CustomTextBold style={{ color:colors.PRIMARY_COLOR, fontSize: 20 }}>Enter Payment Amount</CustomTextBold>
            <CustomText>Kindly review before you proceed.</CustomText>
          </View>
          <View style={{ borderBottomWidth: .3, borderColor: '#3b4043', paddingVertical: 25, paddingHorizontal: 25 }}>
            <CustomTextBold >Payment Reference Number</CustomTextBold>
            <CustomText style={{ paddingTop: 5, paddingBottom: 5, fontSize: 16 }}>{this.state.selectedAccountsId.length === 1 ? 
              this.state.selectedAccountsId[0] :
              _.join(this.state.selectedAccountsId, ', ')}</CustomText>
            <CustomTextBold >Account Name</CustomTextBold>
            <CustomText style={{ paddingTop: 5, fontSize: 16 }}>{this.state.selectedAccounts[0].fullName}</CustomText>
          </View>
          <View style={{ paddingVertical: 25, paddingHorizontal: 25 }}>
            <CustomText style={{ paddingBottom: 25, fontSize: 16 }} >Account Number</CustomText>
            {_.map(this.state.selectedAccounts, (data, index) => {
              return(
                <Row style={{ paddingBottom: 25}}>              
                <Col size={45}>
                  <CustomText style={{fontSize: 18}} >{data.accID}</CustomText>
                  <CustomTextBold style={{ fontSize: 20 }}>${data.arrears.details.PayoffBalance}</CustomTextBold>
                </Col>
                <Col size={45}>
                    <Item regular
                      style={{
                        backgroundColor: colors.WHITE,
                        borderRadius: 6,
                        borderColor: 'lightgray',
                      }}>
                      <Input
                        textAlign={'center'}
                        autoCapitalize='none'
                        placeholderTextColor='lightgray'
                        keyboardType="numeric"
                        value={data.amountToBePaid}
                        onChangeText={(text) => this.amountToBePaidOnChange(data.accID, text)}
                      />
                    </Item>
                </Col>
                  {!data.validAmountToBePaid ?
                  <Col size={10} style={{
                    alignItems: 'center',
                    justifyContent: 'center'}}>
                    <Icon name='warning' style={{ color: 'red' }} />
                </Col>
                :
                null
                }
              </Row>)
              })
            }
          </View>
        </Content>
        <Footer>
          <FooterTab style={{ backgroundColor: '#4CAF50' }}>
            <Button full disabled={this.state.subtotal == 0 ? true : false}
              onPress={() => {
                this.props.navigation.navigate('PaymentView',
                  {
                    selectedAccounts: this.state.selectedAccounts,
                    selectedAccountsId: this.state.selectedAccountsId,
                    subtotal: this.state.subtotal
                  })
              }}
            >
              <CustomText style={{ color: colors.WHITE }}>Continue </CustomText>
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
})(PaymentInput);
