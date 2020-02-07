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
} from '../../actions/userMyAccounts';
import { colors, pRatioToFontSize } from '../../utils/constants';
import CustomText from '../../components/CustomText';
import OfflineNotice from '../../components/OfflineNotice';
import CustomHeader from '../../components/MultiCustomHeader'
import _ from 'lodash'
import { Grid, Row, Col } from 'react-native-easy-grid';

class MyAccount extends Component {
  constructor(props) {
    super(props);
    // const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      selectedAccountsId: [],
      selectedAccounts: [],
      selectMode: false,
      isLoading: true,
      selectAll: false,
    }
  }

  componentDidMount() {
    let timer = setInterval(() => {
      console.log("loading!!!!!!")
      let sortedServiceLocation = []
      let sortedAccountSummary = []
      for (let count = 0; count < this.props.dashboard.orderData.accountSummary.length; count++) {
        sortedServiceLocation.push(this.props.dashboard.orderData.accountSummary[count].accID)
      }
      for (let count = 0; count < sortedServiceLocation.sort().length; count++) {
        for (let count1 = 0; count1 < this.props.dashboard.orderData.accountSummary.length; count1++) {
          if (sortedServiceLocation.sort()[count] === this.props.dashboard.orderData.accountSummary[count1].accID) {
            sortedAccountSummary.push(this.props.dashboard.orderData.accountSummary[count1])
            break;
          }
        }
      }
      console.log("sortedAccountSummary.lengthsortedAccountSummary.lengthsortedAccountSummary.length", sortedAccountSummary.length)
      this.setState({
        accountSummary: sortedAccountSummary,
      });
      if (this.state.userAccDetails.accountId.length === this.state.accountSummary.length) {
        const getAllAccountIds = this.state.accountSummary.map(a => a.accID)
        this.setState({
          selectedAccountIdSorted: getAllAccountIds
        })
        console.log("stopped!!!!!!");
        clearInterval(timer);
      }
    }, 1000);
    this.getLocalData()
  }

  getLocalData = () => {
    //session storage key search
    let sessionAccountId, sessionPersonId;
    let lsAccountId = this.props.accountId
    let lsAccountIds = this.props.accountIds
    if (!(lsAccountId === '' || lsAccountId === null || lsAccountId === undefined)) {
      var accountId = [];
      var arrAccountId = lsAccountId.split(",")
      accountId.push([arrAccountId[0], arrAccountId[1], arrAccountId[2]])
      sessionAccountId = accountId
    }
    else if (!(lsAccountIds === '' || lsAccountIds === null || lsAccountIds === undefined)) {
      var storageAccIds = [], premiseAddresses = [], currPaidAmounts = [], accountIds = [];
      var arrAccountIds = _.split(lsAccountIds, ',');
      let flag = 0
      for (var count = 0; count < arrAccountIds.length; count++) {
        if (flag === 0) {
          storageAccIds.push(arrAccountIds[count])
          flag = flag + 1
        }
        else if (flag === 1) {
          premiseAddresses.push(arrAccountIds[count])
          flag = flag + 1
        }
        else if (flag === 2) {
          currPaidAmounts.push(arrAccountIds[count])
          flag = 0
        }
      }
      for (var count = 0; count < storageAccIds.length; count++) {
        accountIds.push([storageAccIds[count], premiseAddresses[count], currPaidAmounts[count]])
      }

      sessionAccountId = accountIds;
    }
    sessionPersonId = this.props.userPersonId
    this.setState({
      ...this.state,
      selectedAccountId: this.props.dashboard.selectedAccountId,
      selectedPremiseAddress: this.props.dashboard.selectedPremAdd,
      isMultipleAccount: sessionAccountId.length > 1 ? true : false,
      userAccDetails: {
        ...this.state.userAccDetails,
        accountId: sessionAccountId,
        personId: sessionPersonId
      }
    }, () => {
      const accountId = this.state.selectedAccountId
      const personId = sessionPersonId
      this.executeRequests(sessionAccountId, accountId, personId)
    })
  }

  async executeRequests(sessionAccountId, accountId, personId) {
    this.props.saveAccountId(accountId)
    try {
      let [result1, result2] = await Promise.all([this.props.fetchMultipleLatestBill(sessionAccountId), this.props.fetchMultipleAddOpptyRequest(accountId, personId)]);
      if (result1 && result2.dataFetched) {
        const userAccountDetails = this.props.dashboard.userAccountDetails;
        let sortedServiceLocation = []
        let sortedAccountSummary = []
        for (let count = 0; count < this.props.dashboard.orderData.accountSummary.length; count++) {
          sortedServiceLocation.push(this.props.dashboard.orderData.accountSummary[count].serviceLocation)
        }
        for (let count = 0; count < sortedServiceLocation.sort().length; count++) {
          for (let count1 = 0; count1 < this.props.dashboard.orderData.accountSummary.length; count1++) {
            if (sortedServiceLocation.sort()[count] === this.props.dashboard.orderData.accountSummary[count1].serviceLocation) {
              sortedAccountSummary.push(this.props.dashboard.orderData.accountSummary[count1])
            }
          }
        }
        console.log("sortedAccountSummarysortedAccountSummarysortedAccountSummarysortedAccountSummary", sortedAccountSummary)
        this.setState({
          ...this.state,
          accountSummary: sortedAccountSummary,
          subtotal: this.props.dashboard.orderData.subTotal,
          consumptionViewBy: 'monthlyWater',
          userAccDetails: {
            ...this.state.userAccDetails,
            fullName: userAccountDetails.fullName,
            addressLine1: userAccountDetails.addressLine1,
            city: userAccountDetails.city,
            state: userAccountDetails.state,
            postal: userAccountDetails.postal,
            country: userAccountDetails.country,
            homePhone: userAccountDetails.homePhone,
            mobilePhone: userAccountDetails.mobilePhone,
            workPhone: userAccountDetails.workPhone,
            emailAddress: userAccountDetails.emailAddress,
          },
          isLoading: false
        })
      }
    }
    catch (error) {
      this.props.showMessage(true, "Server Error. Try again later!")
      setInterval(() => {
        window.location.reload()
      }, 1000);
    }
  }
  //ON PRESS ON LEAD
  
  onPressOnAccount(i) {

    if (this.state.selectMode) {
      let selected = this.state.selectedAccounts; 
      let selectedAccountsId = this.state.selectedAccountsId 

      if (selectedAccountsId.indexOf(i.accID) == -1) {
        
        selectedAccountsId.push(i.accID);
        selected.push(i) // insert array of object
      } else {
        let index = selectedAccountsId.indexOf(i.accID); 
        // _.remove(selected, (e) => {
        //   return e !== i.accID
        // })
        selectedAccountsId.splice(index, 1);
        selected.splice(index, 1);
      }

      this.setState({
        selectedAccounts: selected,
        selectedAccountsId: selectedAccountsId
      });
    } else {
      console.log('Next Screen')
      // this.props.navigation.navigate('LeadProfile',
      //   {
      //     accountSummary: i
      //   }

    }
    console.log(this.state.selectedAccounts)
    console.log(this.state.selectedAccountsId)
  }

  //FUNCTION FOR COMPONENT OF EACH ITEM IN LEAD LISTING
  renderItemsInfiniteScroll(itemIndex, i) {
    let sl = this.state.selectedAccountsId
    return (
      <TouchableOpacity underlayColor={colors.GRAYISHRED}
        onPress={() => {
          if (this.state.selectMode) {
            // console.log('test', sl.indexOf(i.accID) != -1 ? 'check-box' : 'check-box-outline-blank')
            // console.log('test2', sl.indexOf(i.accID) != -1 ? 'check-box' : 'check-box-outline-blank')
            console.log('test3', _.includes(sl, i.accID) ? 'check-box' : 'check-box-outline-blank')
            console.log('test4', _.includes(sl, i.accID) ? 'check-box-outline-blank' : 'check-box')
            this.onPressOnAccount(i)
          } else {
            console.log('Punta sa next screen')
          }
        }}
        onLongPress={() => this.setState({
          selectMode: !this.state.selectMode
        })}>
          <Row key={itemIndex} style={{ borderBottomWidth: .3, borderColor: '#3b4043', paddingTop: 10, paddingBottom: 10 }}>
            <Col size={10} style={{
                  alignItems: 'center',
                  justifyContent: 'center',
              }}>
            {this.state.selectMode ?
              <MaterialIcons
                name={_.includes(sl, i.accID) ? 'check-box' : 'check-box-outline-blank'}
                size={pRatioToFontSize(-0.1)}
                color={colors.PRIMARY_COLOR}
              />
              :
              null
            }

                </Col>
            <Col size={65}>
              <CustomText>Account Number {itemIndex + 1}</CustomText>
              <CustomText>{i.accID}</CustomText>
              <Text style={{ fontFamily: 'Lato', color: colors.GRAYISHRED }} numberOfLines={1} ellipsizeMode='tail'>{i.serviceLocation}</Text>
            </Col>
            <Col size={45} style={{ alignItems: 'flex-end', paddingTop: 5 }} >
              <CustomText style={{ color: i.validAmountToBePaid ? colors.RED : colors.GRAYISHRED }}>{i.dueDate + ' '}<Icon onPress={() => alert('icon press')} style={{ backgroundColor: colors.WHITE, color: i.validAmountToBePaid ? colors.RED : colors.GRAYISHRED, fontSize: pRatioToFontSize(+1) > 14 ? 14 : pRatioToFontSize(+1) }} name='info-circle' type='FontAwesome5' /></CustomText>
              <CustomText style={{ fontSize: 25, fontWeight: 'bold' }} >${i.arrears.details.PayoffBalance}</CustomText>
            </Col>
            <Col size={10}></Col>
          </Row>
      </TouchableOpacity>
    )
  }
  selectModeFunction() {
    if (this.state.selectMode) {
      return (
        <View style={{
          paddingHorizontal: 7, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10,
          borderBottomColor: '#e2e6ea', borderBottomWidth: 1
        }}>
          <TouchableHighlight
            onPress={() => {
              debugger
              let selected = [];
              let selectedAccountsId = [];
              if (this.state.selectAll) {
                selectedAccountsId = []
                selected = []
              } else {
                let fl = [];
                fl = this.state.accountSummary;
                for (var i = 0; i < fl.length; i++) {
                  selectedAccountsId.push(fl[i].accID);
                  selected.push(fl[i]);
                }
              }
              console.log(selectedAccountsId)
              console.log(selected)
              this.setState({
                selectAll: !this.state.selectAll,
                selectedAccountsId: selected,
                selectedAccounts: selected
              });
            }}
            style={{
              justifyContent: 'center'
            }}
          >
            <View style={{ flexDirection: 'row', }}>
              <MaterialIcons name={this.state.selectAll ? 'check-box' : 'check-box-outline-blank'} style={{ top: 2 }} size={pRatioToFontSize()} color={colors.PRIMARY_COLOR} />
              <CustomText style={{ color: colors.BLACK, fontSize: pRatioToFontSize(), fontWeight: '500', paddingLeft: 5 }}>Select All</CustomText>
            </View>
          </TouchableHighlight>
        </View>
      )
    }
  }

  //RENDER MAIN COMPONENT
  render() {
    return (
      /* MAIN VIEW COMPONENT */
      <Container >
        <CustomHeader
          leftIconName="menu"
          leftButtonFunction={this.props.navigation.openDrawer}
          title="My Accounts"
          RightIcon={<Right style={{ paddingRight: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, flex: 1 }}>
            <Button
              transparent style={{ paddingLeft: 0, elevation: 0 }} onPress={() => console.log('icon')} >
              <Icon style={{ backgroundColor: colors.PRIMARY_COLOR, color: colors.WHITE, fontSize: pRatioToFontSize(+1) > 20 ? 20 : pRatioToFontSize(+1) }} name='user-alt' type='FontAwesome5' />

            </Button>
          </Right>}
        />
        <OfflineNotice />
        {/* <Content> <- This component conflicts with FlatList and crashed the infinite scrolling. */}
        {this.state.isLoading ?
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
          </View>
          :

          <View style={{ flex: 1 }}
            onLayout={event => this.setState({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}
          >
            {/* ACCOUNT MENU */}

            {this.selectModeFunction()}

            {/* END OF ACCOUNT MENU */}

            <FlatList
              style={{ flex: 0 }}
              ref="infiniteList"
              data={this.state.accountSummary}
              keyExtractor={(x, index) => index.toString()}
              renderItem={(data) => {
                return (
                  this.renderItemsInfiniteScroll(data.index, data.item)
                );
              }}
            />
          </View>
        }
        {this.state.selectMode ?
          <Footer>
            <FooterTab style={{ backgroundColor: '#4CAF50' }}>
              <Button full>
                <CustomText style={{ color: colors.WHITE }}>Continue</CustomText>
              </Button>
            </FooterTab>
          </Footer>
          :
          null
        }
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
})(MyAccount);
