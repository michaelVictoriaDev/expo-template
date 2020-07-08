import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { List, Button, Container, Header, Left, Body, Right, Badge, Footer, FooterTab, Icon, Input, Picker, Toast, CheckBox, Content, ListItem, Form, Item, Text } from 'native-base';
import {
  KeyboardAvoidingView,
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
import NumberFormat from 'react-number-format';

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
  componentDidMount() {
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

  formatAmount = (value, callback) => {
    value = value.replace('$ ', ''); //removes '$ '
    value = value.replace(/\,/g, '') //removes all ','
    return value = parseFloat(Math.round(value * 100) / 100).toFixed(2)
  }

  amountToBePaidOnChange = (accountId, text, index) => {
    console.log('accountId', accountId)

    const id = accountId
    var value = text
    value = this.formatAmount(value);
    console.log("value", value)
    const arrAccountSummary = this.state.selectedAccounts
    let selectedIndex = ""

    _.map(arrAccountSummary, (data, index) => {
      if (data.accID === id) {
        selectedIndex = index
      }
    })
    console.log("subtotaltext", text)

    arrAccountSummary[selectedIndex].amountToBePaid = value

    console.log(arrAccountSummary[selectedIndex].amountToBePaid = value)

    this.setState({
      ...this.state,
      selectedAccounts: arrAccountSummary
    }, () => { this.updateSubTotal() })

    console.log('arrAccountSummary', arrAccountSummary)
  }


  updateSubTotal = () => {
    let subtotal = 0
    const arrAccountSummary = this.state.selectedAccounts
    debugger

    _.map(arrAccountSummary, (data, index) => {
      console.log('data', data)
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
          title="My Account"
          RightIcon={<Right />}
        />
        <OfflineNotice />
        <Content>
          <KeyboardAvoidingView
            behavior="padding"
          >
            <View style={{ borderBottomWidth: .3, borderColor: '#3b4043', paddingVertical: 25, paddingHorizontal: 25 }}>
              <CustomTextBold style={{ color: colors.PRIMARY_COLOR, fontSize: 18 }}>Enter Payment Amount</CustomTextBold>
              <CustomText style={{ fontSize: 14 }}>Kindly review before you proceed.</CustomText>
            </View>
            <View style={{ borderBottomWidth: .3, borderColor: '#3b4043', paddingVertical: 25, paddingHorizontal: 25 }}>
              <CustomTextBold style={{ fontSize: 14 }} >Payment Reference Number</CustomTextBold>
              <CustomText style={{ paddingTop: 5, paddingBottom: 5, fontSize: 16 }}>{this.state.selectedAccountsId.length === 1 ?
                this.state.selectedAccountsId[0] :
                _.join(this.state.selectedAccountsId, ', ')}</CustomText>
              <CustomTextBold style={{ fontSize: 14 }} >Account Name</CustomTextBold>
              <CustomText style={{ paddingTop: 5, fontSize: 16 }}>{this.state.selectedAccounts[0].fullName.trim()}</CustomText>
            </View>
            <View style={{ paddingVertical: 25, paddingHorizontal: 25 }}>
              <CustomTextBold style={{ paddingBottom: 20, fontSize: 14 }} >Account Number</CustomTextBold>
              {_.map(this.state.selectedAccounts, (data, index) => {
                var accID = data.accID[index]
                console.log('amountToBePaid',data.amountToBePaid)
                return (
                  <Row style={{ paddingBottom: 20 }}>
                    <Col size={45} style={{ paddingTop: 5  }}>
                      <CustomText style={{ fontSize: 16 }} >{accID}</CustomText>
                      <CustomTextBold style={{ fontSize: 16 }}>${data.arrears.details.PayoffBalance}</CustomTextBold>
                    </Col>
                    <Col size={5} style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <CustomText style={{ fontSize: 16 }}>$ </CustomText>
                    </Col>
                    <Col size={40}>

                      <Item regular
                        style={{
                          backgroundColor: colors.WHITE,
                          borderRadius: 6,
                          borderColor: 'lightgray',
                        }}>

                        <NumberFormat
                          value={data.amountToBePaid}
                          displayType={'text'}
                          thousandSeparator={true}
                          renderText={value => (
                            <React.Fragment>
                              <Input
                                textAlign={'center'}
                                autoCapitalize='none'
                                placeholderTextColor='lightgray'
                                keyboardType="numeric"
                                value={value}
                                onChangeText={(value) => this.amountToBePaidOnChange(data.accID, value, index)}
                              />

                            </React.Fragment>
                          )}
                        />
                      </Item>
                    </Col>
                    {!data.validAmountToBePaid ?
                      <Col size={10} style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon name='warning' style={{ color: 'red' }} />
                      </Col>
                      :
                      null
                    }
                  </Row>)
              })
              }
            </View>
            <View style={{ paddingHorizontal: 25, justifyContent: 'center', alignItems: 'center' }}>
              <Row style={{ paddingBottom: 25 }}>
                <Col size={50} style={{ }}>
                  <CustomTextBold style={{ fontSize: 18 , paddingTop: 10}}>Total Amount</CustomTextBold>
                </Col>
                <Col size={50} style={{ justifyContent: 'center' }}>
                  <CustomTextBold style={{ fontSize: 24, paddingLeft: 30 }}>$ {new Intl.NumberFormat("es-US", { minimumFractionDigits: 2 } ).format( this.state.subtotal )}</CustomTextBold>
                  {/* <CustomTextBold style={{ fontSize: 24, paddingLeft: 30 }}>{new Intl.NumberFormat('en-US').format(parseFloat(this.state.subtotal).toFixed(2))}</CustomTextBold> */}
                </Col>
              </Row>

            </View>
          </KeyboardAvoidingView>
        </Content>
        <Footer>
          <FooterTab style={{ backgroundColor: colors.LIGHT_GREEN, }}>
            <Button full disabled={this.state.subtotal == 0 || isNaN(this.state.subtotal)}
              onPress={() => {

                this.props.navigation.navigate('PaymentPayNow',
                  {
                    selectedAccounts: this.state.selectedAccounts,
                    selectedAccountsId: this.state.selectedAccountsId,
                    subtotal: this.state.subtotal
                  })
              }}
            >
              <CustomText style={{ color: colors.WHITE, fontSize: 16 }}>Continue </CustomText>
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
