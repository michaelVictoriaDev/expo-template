import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button, Container, Header, Left, Body, Right, Badge, Footer, FooterTab, Icon, Input, Picker, Toast, CheckBox, Content, ListItem, Form, Item, Text } from 'native-base';
import {
  PixelRatio, StyleSheet, Dimensions, TouchableHighlight, Image, Alert, AppState, FlatList, Linking, View, ActivityIndicator, Platform
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
      selectedAccounts :[],
      selectMode: false,
      isLoading: true
    }
  }

  componentDidMount() {
    let timer = setInterval(() => {
      console.log("loading!!!!!!")
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
      this.setState({
        accountSummary: sortedAccountSummary,
      });
      if (this.state.accountSummary.length >= this.state.userAccDetails.accountId.length) {
        console.log("stopped!!!!!!")
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
    this.setState({
      isMultipleAccount: sessionAccountId.length > 1 ? true : false
    }, () => {
      this.props.saveAccountId(sessionAccountId[0][0])
        .then(() => {
          this.props.savePremiseAddress(sessionAccountId[0][1])
            .then(() => {
              this.setState({
                ...this.state,
                child: MultipleAccView
              })
            })
        })
    })
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

  //FUNCTION FOR COMPONENT OF EACH ITEM IN LEAD LISTING
  renderItemsInfiniteScroll(itemIndex, i) {
    let sl = this.state.selectedLeads;
    return (
      <TouchableHighlight underlayColor={colors.GRAYISHRED} onPress={() => alert('You tapped the button!')} onLongPress={() => alert('You long-pressed the button!') }>
      <Grid>
        <Row key={itemIndex} style={{ borderBottomWidth: .3, borderColor: '#3b4043', paddingTop: 10, paddingBottom: 10 }}>
        <Col size={10} style={{
            display: 'flex',
            alignItems: 'center',
          justifyContent: 'center',
                }}>
                
            <MaterialIcons
              // style={{ position: 'absolute', top: 17, }}
              // name={_.indexOf(sl, i.accID) != -1 ? 'check-box' : 'check-box-outline-blank'} 
              name={'check-box'}
              size={this.state.selectMode ? pRatioToFontSize(-0.1) : pRatioToFontSize(-0.1)}
              color={colors.PRIMARY_COLOR}
            />
        </Col>
          <Col size={65}>
            <CustomText>Account Number {itemIndex + 1}</CustomText>
            <CustomText>{i.accID}</CustomText>
            <Text style={{ fontFamily: 'Lato', color: colors.GRAYISHRED}} numberOfLines={1} ellipsizeMode='tail'>{i.serviceLocation}</Text>
          </Col> 
          <Col size={45} style={{ alignItems: 'flex-end', paddingTop: 5 }} >
              <CustomText style={{ color: i.validAmountToBePaid ? colors.RED : colors.GRAYISHRED }}>{i.dueDate + ' '}<Icon onPress={() => alert('icon press')} style={{ backgroundColor: colors.WHITE, color: i.validAmountToBePaid ? colors.RED : colors.GRAYISHRED, fontSize: pRatioToFontSize(+1) > 14 ? 14 : pRatioToFontSize(+1) }} name='info-circle' type='FontAwesome5' /></CustomText>
            <CustomText style={{ fontSize: 25 , fontWeight: 'bold' }} >${i.arrears.details.PayoffBalance}</CustomText>
          </Col>
          <Col size={10}></Col>
        </Row>
      </Grid>
      </TouchableHighlight>
    )
  }
  selectModeFunction() {
    if (!this.state.selectMode) {
      return (
        <TouchableHighlight underlayColor={colors.GRAYISHRED} onPress={() => { this.setState({ selectMode: true }); }}>
          <Grid>
            <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
              <Col size={10} >
                <Text style={{ color: colors.PRIMARY_COLOR }}>Hold to select <Ionicons style={{ left: 13 }} name='ios-arrow-forward' size={14} color={colors.PRIMARY_COLOR} /></Text> 
              </Col>
              <Col size={65} />
              <Col size={45} />
              <Col size={10} />
            </Row>
          </Grid>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight
          onPress={() => {
            // let selected = [];
            // if (this.state.selectAll) {
            //   selected = []
            // } else {
            //   alert('Note: This will only select all the shown leads on this list.');
            //   let fl = [];
            //   if (this.state.filteredLeads.length == 0) {
            //     fl = this.state.leads;
            //   } else {
            //     fl = this.state.filteredLeads;
            //   }
            //   for (var i = 0; i < fl.length; i++) {
            //     if (!_.isNil(fl[i].contact_details[0])) {
            //       selected.push(fl[i].lead_id);
            //     }
            //     else {
            //       selected.push(fl[i].lead_id);
            //     }
            //   }
            // }
            // this.setState({
            //   selectAll: !this.state.selectAll,
            //   selectedLeads: selected,
            // });
          }}
          style={{
            justifyContent: 'center'
          }}
        >
          <View style={{ flexDirection: 'row', backgroundColor: colors.BLACK }}>
            <MaterialIcons name={this.state.selectAll ? 'check-box' : 'check-box-outline-blank'} style={{ top: 2 }} size={pRatioToFontSize()} color={colors.PRIMARY_COLOR} />
            <Text style={{ color: colors.PRIMARY_COLOR, fontSize: pRatioToFontSize(), fontWeight: 'bold', paddingLeft: 5 }}>Select All</Text>
          </View>
        </TouchableHighlight>
      );
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
          {this.selectModeFunction()}
            <FlatList
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

const styles = StyleSheet.create({
  func_buttons: {
    flex: 1,
    paddingTop: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: .5,
    width: 200,
    borderColor: '#98a6a6',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  social_media_container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'center'
  },
  prof_container_bottom: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    width: Dimensions.get('window').width,
  },
  date_container: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#069ebe',
    padding: 10
  },
  date_text: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
  },
  func_buttons: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.PRIMARY_COLOR,
    height: 70,
  },
  func_buttons_img: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginBottom: 5
  },
  prof_container_top: {
    padding: 30,
    paddingTop: 20,
    backgroundColor: '#25cef1',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    position: 'relative',
    width: Dimensions.get('window').width
  },
  bg_image: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    resizeMode: 'stretch',
  },
  full_name: {
    textAlign: 'center',
    paddingTop: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  lead_status: {
    paddingTop: 5,
    fontSize: 16,
    paddingBottom: 7
  },
  activity_btn: {
    padding: 10,
    paddingHorizontal: 100,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginTop: 15,
  }
});