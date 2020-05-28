import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Footer, FooterTab, Icon, Text } from 'native-base';
import {
 TouchableHighlight, FlatList, View, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
import { Row, Col } from 'react-native-easy-grid';

class MyAccount extends Component {
  constructor(props) {
    
    super(props);
    
    this.state = {
      selectedAccountsId: [],
      selectedAccounts: [],
      selectedAmountToBePaid: [],
      selectMode: false,
      isLoading: true,
      selectAll: false,
      isFetching: false
    }
  }

  componentDidMount() {

    this.getApiData()

  }

  getApiData(){

    this.props.saveAccountId(this.props.accountIds[0][0])
      .then(() => {
        this.props.savePremiseAddress(this.props.accountIds[0][1])
          .then(() => {
            let timer = setInterval(() => {
              console.log("loading!!!!!!")
              const sortedAccountSummary = this.sortAccountSummary();
              console.log("sortedAccountSummary.lengthsortedAccountSummary.lengthsortedAccountSummary.length", sortedAccountSummary.length)
              this.setState({
                accountSummary: this.props.dashboard.orderData.accountSummary,
              });
              if (this.state.userAccDetails.accountId.length === this.state.accountSummary.length) {
                console.log("stopped!!!!!!");
                this.setState({
                  isLoading: false,
                  isFetching: false 
                })

                clearInterval(timer);
              }
            }, 3000);
            this.getLocalData()
          })
      })
  }

  sortAccountSummary = () => {
    console.log("sort called")
    let sortedAccountId = [];
    let allResidAccts = [];
    let allNonResidAccts = [];
    let sortedAccountSummary = [];

    // _.map(this.props.dashboard.orderData.accountSummary, (data, index) => {
   
    //   sortedAccountId.push(data.accID)
    // })

    for (let count = 0; count < this.props.dashboard.orderData.accountSummary.length; count++) {
      sortedAccountId.push(this.props.dashboard.orderData.accountSummary[count].accID)
    }

    //get all resid accounts
    // _.map(this.props.dashboard.orderData.accountSummary, (data, index) => {
    //   data.className === "RESID" ? allResidAccts.push(data) : null
    // })


    for (let count = 0; count < this.props.dashboard.orderData.accountSummary.length; count++) {
      if (this.props.dashboard.orderData.accountSummary[count].className === "RESID") {
        allResidAccts.push(this.props.dashboard.orderData.accountSummary[count]);
      }
    }


    //get all non-resid accounts


    // _.map(this.props.dashboard.orderData.accountSummary, (data, index) => {
    //   this.props.dashboard.orderData.accountSummary[index].className != "RESID" ? allNonResidAccts.push(data) : null
    // })
    
    for (let count = 0; count < this.props.dashboard.orderData.accountSummary.length; count++) {
      if (this.props.dashboard.orderData.accountSummary[count].className != "RESID") {
        allNonResidAccts.push(this.props.dashboard.orderData.accountSummary[count]);
      }
    }



    //insert all resid accounts

    for (let count = 0; count < sortedAccountId.sort().length; count++) {
      for (let count1 = 0; count1 < allResidAccts.length; count1++) {
        if (sortedAccountId.sort()[count] === allResidAccts[count1].accID) {
          sortedAccountSummary.push(allResidAccts[count1])
          break;
        }
      }
    }
    //insert all non-resid accounts
    for (let count = 0; count < sortedAccountId.sort().length; count++) {
      for (let count1 = 0; count1 < allNonResidAccts.length; count1++) {
        if (sortedAccountId.sort()[count] === allNonResidAccts[count1].accID) {
          sortedAccountSummary.push(allNonResidAccts[count1]);
          break;
        }
      }
    }
    return sortedAccountSummary;
  }

  getLocalData = () => {
    //session storage key search
    let sessionAccountId, sessionPersonId;
    let lsAccountId = this.props.accountId
    let lsAccountIds = this.props.accountIds
    console.log('lsAccountId', this.props.accountId)
    console.log('lsAccountIds', this.props.accountIds)
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
        console.log(userAccountDetails)
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
          }
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
      selectedAccountsId: selectedAccountsId,
    });
   
  }

  //FUNCTION FOR COMPONENT OF EACH ITEM IN LEAD LISTING
  renderItemsInfiniteScroll(itemIndex, i) {
    let sl = this.state.selectedAccountsId
    return (
      <TouchableOpacity underlayColor={colors.GRAYISHRED}
        onPress={() => {
          if (this.state.selectMode) {
            this.onPressOnAccount(i)
          } else {
            this.props.navigation.navigate('AccountSummary')
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
              <CustomText>Account Number</CustomText>
              <CustomText>{i.accID}</CustomText>
              <Text style={{ fontFamily: 'Lato', color: colors.GRAYISHRED }} numberOfLines={1} ellipsizeMode='tail'>{i.serviceLocation}</Text>
            </Col>
            <Col size={45} style={{ alignItems: 'flex-end', paddingTop: 5 }} >
              <CustomText style={{ color: i.validAmountToBePaid ? colors.RED : colors.GRAYISHRED }}>{i.dueDate + ' '}<Icon onPress={() => alert('icon press')} style={{ backgroundColor: colors.WHITE, color: i.validAmountToBePaid ? colors.RED : colors.GRAYISHRED, fontSize: pRatioToFontSize(+1) > 14 ? 14 : pRatioToFontSize(+1) }} name='info-circle' type='FontAwesome5' /></CustomText>
              <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 25, fontWeight: 'bold' }} >${i.arrears.details.PayoffBalance}</CustomText>
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
          paddingHorizontal: 7, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10,
          borderBottomColor: '#e2e6ea', borderBottomWidth: 1, backgroundColor: '#e2e6ea'
        }}>
          <TouchableHighlight
            onPress={() => {
        
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

  onRefresh() {
    this.setState({ isFetching: true }, function () { this.getApiData() });
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
              transparent style={{ paddingLeft: 0, elevation: 0 }} onPress={() =>
                this.props.navigation.navigate('AccountProfile')} >
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
              data={this.sortAccountSummary()}
              keyExtractor={(x, index) => index.toString()}
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isFetching}
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
            <FooterTab style={{ backgroundColor: colors.LIGHT_GREEN }}>
              <Button full
              onPress={()=> {
                let subtotal = 0
                const arrAccountSummary = this.state.selectedAccounts

                _.map(arrAccountSummary, (data, index) => {
                  subtotal = subtotal + parseFloat(data.amountToBePaid === "" ? 0 : data.amountToBePaid)
                })

                this.props.navigation.navigate('PaymentInput',
                  {
                    selectedAccounts: this.state.selectedAccounts,
                    selectedAccountsId: this.state.selectedAccountsId,
                    subtotal: subtotal
                  })
                this.setState({
                  selectMode: false,
                  selectedAccounts:[],
                  selectedAccountsId: []

                })
              }}
              >
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
