import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Footer, FooterTab, Icon, Text , Toast} from 'native-base';
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
import CustomTextMedium from '../../components/CustomTextMedium';

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
   
  }


  componentWillUnmount() {
    // Remove the event listener before removing the screen from the stack
    // this.focusListener.remove();
  }

 

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
              onPress={() => {

                console.log('test')

              }
              } >
              <Icon style={{ backgroundColor: colors.PRIMARY_COLOR, color: colors.WHITE, fontSize: pRatioToFontSize(+1) > 20 ? 20 : pRatioToFontSize(+1) }} name='user-alt' type='FontAwesome5' />

            </Button>
          </Right>}
        />
        <OfflineNotice />
        {/* <Content> <- This component conflicts with FlatList and crashed the infinite scrolling. */}
  
              <CustomText>Hello World</CustomText>
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
    paddingTop: 5,
    width: '55%',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right,
  },
  itemThree: {
    width: '30%',
    alignItems: 'flex-start',
    // paddingTop: 5
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

