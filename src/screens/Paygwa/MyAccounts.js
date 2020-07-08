import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Footer, FooterTab, Icon, Text } from 'native-base';
import {
  TouchableHighlight, FlatList, View, ActivityIndicator, TouchableOpacity, StyleSheet
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
import CustomTextBold from '../../components/CustomTextBold';

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

    // this.getApiData()
    //Here is the Trick
    const { navigation } = this.props;
    //Adding an event listner om focus
    //So whenever the screen will have focus it will set the state to zero
    this.focusListener = navigation.addListener('didFocus', () => {
      this.getApiData()
    });
  }


componentWillUnmount() {
  // Remove the event listener before removing the screen from the stack
  this.focusListener.remove();
}

getApiData() {
  // accountIds multiple accounts
  // accountId single account
  // debugger
  this.setState({ isLoading: true })
  if (_.isEmpty(this.props.accountIds)) {
    var usethis = this.props.accountId
  } else {
    var usethis = this.props.accountIds
  }



  this.props.saveAccountId(usethis[0][0])
    .then(() => {
      this.props.savePremiseAddress(usethis[0][1])
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
  let sortedAccountId = [];
  let allResidAccts = [];
  let allNonResidAccts = [];
  let sortedAccountSummary = [];
  for (let count = 0; count < this.props.dashboard.orderData.accountSummary.length; count++) {
    sortedAccountId.push(this.props.dashboard.orderData.accountSummary[count].accID)
  }
  //get all resid accounts
  for (let count = 0; count < this.props.dashboard.orderData.accountSummary.length; count++) {
    if (this.props.dashboard.orderData.accountSummary[count].className === "RESID") {
      allResidAccts.push(this.props.dashboard.orderData.accountSummary[count]);
    }
  }
  //get all non-resid accounts
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

getLocalData() {
  // ls meaning =localStorage
  //session storage key search
  let sessionAccountId, sessionPersonId;
  let lsAccountId = this.props.accountId // Single Account
  let lsAccountIds = this.props.accountIds // Multiple Account
  console.log('lsAccountId', this.props.accountId)
  console.log('lsAccountIds', this.props.accountIds)

  if (!(lsAccountId === '' || lsAccountId === null || lsAccountId === undefined)) {
    var accountId = [];
    var arrAccountId = lsAccountId
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
  console.log('selectedAccountId', this.props.dashboard.selectedAccountId)
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
  })


  console.log('***accountId', accountId)
  console.log('***personId', sessionPersonId)
  this.executeRequests(sessionAccountId, this.props.dashboard.selectedAccountId, sessionPersonId)
}

async executeRequests(sessionAccountId, accountId, personId) {
  console.log('CALLED', sessionAccountId)

  this.props.saveAccountId(accountId)
  try {
    let [result1, result2] = await Promise.all([this.props.fetchMultipleLatestBill(sessionAccountId), this.props.fetchMultipleAddOpptyRequest(accountId, personId)]);
    if (result1 && result2.dataFetched) {
      const userAccountDetails = this.props.dashboard.userAccountDetails;
      console.log(userAccountDetails, 'userAccountDetails')
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
      this.getApiData()
    }, 1000);
  }
}
//ON PRESS ON LEAD

onPressOnAccount(i) {

  let selected = this.state.selectedAccounts;
  let selectedAccountsId = this.state.selectedAccountsId


  if (selectedAccountsId.indexOf(i.accID[0]) == -1) {
    selectedAccountsId.push(i.accID[0]);
    selected.push(i) // insert array of object
  } else {
    let index = selectedAccountsId.indexOf(i.accID[0]);
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
  console.log('selectedAccountsId', sl)
  return (
    <TouchableOpacity underlayColor={colors.GRAYISHRED}
      onPress={() => {
        if (this.state.selectMode) {
          this.onPressOnAccount(i)
        } else {

          console.log('accountDetails', i)
          this.props.navigation.navigate('AccountSummary', {
            accountDetails: i
          })
        }
      }}
      onLongPress={() => this.setState({
        selectMode: !this.state.selectMode
      })}>


      <View style={styles.container}>
        <View style={styles.item}>
          <View >
            {this.state.selectMode ?

              <MaterialIcons

                name={
                  // sl.indexOf(i.accID) != -1 
                  _.includes(sl, i.accID[0])
                    ? 'check-box' : 'check-box-outline-blank'
                }
                size={pRatioToFontSize(-0.1)}
                color={colors.PRIMARY_COLOR}
              />
              :
              null
            }
          </View>
        </View>

        <View style={styles.itemTwo}>
          <CustomText style={{ fontsize: 24, alignItems: 'center' }} numberOfLines={1} ellipsizeMode='tail'>{i.accID[0]}{' '}{i.accID[2] === 'COMM' ?
            <Icon type={'FontAwesome5'} name='building' style={{ fontSize: 20 }} />
            :
            <Icon type={'Entypo'} name='home' style={{ fontSize: 20, }} />

          }</CustomText>

          <CustomText style={{ color: colors.GRAYISHRED }} numberOfLines={1} ellipsizeMode='tail'>{i.serviceLocation}</CustomText>
        </View>
        <View style={styles.itemBlocker} />

        <View style={styles.itemThree}>

          <CustomText numberOfLines={1} ellipsizeMode='tail'
            style={{ fontSize: 25, fontWeight: 'bold' }} >${i.arrears.details.PayoffBalance}</CustomText>
          <CustomText style={{ color: i.validAmountToBePaid ? colors.RED : colors.GRAYISHRED }}>{_.replace(i.dueDate, /\//g, '.') + ' '}<Icon onPress={() => alert('icon press')} style={{ backgroundColor: colors.WHITE, color: i.validAmountToBePaid ? colors.RED : colors.GRAYISHRED, fontSize: pRatioToFontSize(+1) > 14 ? 14 : pRatioToFontSize(+1) }} name='info-circle' type='FontAwesome5' /></CustomText>
        </View>
        {/* <View style={styles.itemFour}></View> */}

      </View>



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
        <TouchableOpacity
          underlayColor={colors.GRAYISHRED}
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
                selectedAccountsId.push(fl[i].accID[0]);
                selected.push(fl[i]);
              }
            }
            console.log('selectedAccountsIdselectModeFunction', selectedAccountsId)
            console.log('selectedselectModeFunction', selected)
            this.setState({
              selectAll: !this.state.selectAll,
              selectedAccountsId: selectedAccountsId,
              selectedAccounts: selected
            });
          }}
          style={{
            justifyContent: 'center'
          }}
        >
          <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
            <MaterialIcons name={this.state.selectAll ? 'check-box' : 'check-box-outline-blank'} style={{ top: 2 }} size={pRatioToFontSize()} color={colors.PRIMARY_COLOR} />
            <CustomTextBold style={{ color: colors.BLACK, fontSize: 14, fontWeight: '500', paddingLeft: 5 }}>Select All</CustomTextBold>
          </View>
        </TouchableOpacity>
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
        leftIconName="navicon"
        leftButtonFunction={this.props.navigation.openDrawer}
        title="My Accounts"
        RightIcon={<Right style={{ paddingRight: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, flex: 1 }}>
          <Button
            disabled={this.state.isLoading}
            transparent style={{ paddingLeft: 0, elevation: 0 }}
            onPress={() =>
              this.props.navigation.navigate('AccountProfile', {
                // getApiData: () => this.getApiData()
              })} >
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
              onPress={() => {
                let subtotal = 0
                const arrAccountSummary = this.state.selectedAccounts

                _.map(arrAccountSummary, (data, index) => {
                  subtotal = subtotal + parseFloat(data.amountToBePaid === "" ? 0 : data.amountToBePaid)
                })

                console.log(this.state.selectedAccountsId)

                this.props.navigation.navigate('PaymentInput',
                  {
                    selectedAccounts: this.state.selectedAccounts,
                    selectedAccountsId: this.state.selectedAccountsId,
                    subtotal: subtotal
                  })
                this.setState({
                  selectMode: false,
                  selectedAccounts: [],
                  selectedAccountsId: []

                })
              }}
            >
              <CustomText style={{ color: colors.WHITE }}>Make Payment</CustomText>

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

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: .3, borderColor: '#3b4043', paddingVertical: 20,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right,

  },
  item: {
    paddingVertical: 20,
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBlocker: {
    width: '5%'
  },
  itemTwo: {
    width: '55%',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right,
  },
  itemThree: {
    width: '30%',
    alignItems: 'flex-start',
    paddingTop: 5
  },
  itemFour: {
    width: '10%'
  }
});

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

