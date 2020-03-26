import React, { Component } from 'react';
import { SafeAreaView, Platform } from 'react-native';
import { Provider, connect } from 'react-redux';
// import { ThemeProvider } from 'styled-components';
// import styled from 'styled-components';
// import { FormattedWrapper } from 'react-native-globalize';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';


// import messages from './Messages';
import store from './src/store';

// import Navigator from './Navigator';

import { colors } from './src/utils/constants';

import { createStackNavigator, createSwitchNavigator, createDrawerNavigator, createAnimatedSwitchNavigator } from 'react-navigation';
import NavigationService from './src/NavigationService';

import InitialLoginScreen from './src/screens/Paygwa/InitialLogin';
import LoginScreen from './src/screens/Paygwa/Login';
import MyAccounts from './src/screens/Paygwa/MyAccounts';

//Payment
import PaymentInputScreen from './src/screens/Paygwa/Payment/PaymentInput';
import PaymentViewScreen from './src/screens/Paygwa/Payment/PaymentView';
import PaymentPayNowScreen from './src/screens/Paygwa/Payment/PaymentPayNow';

//PaymentResult
import PaymentSuccessScreen from './src/screens/Paygwa/Payment/PaymentResult/PaymentSuccess';
import PaymentUserFailedScreen from './src/screens/Paygwa/Payment/PaymentResult/PaymentUserFailed';
import PaymentServerFailedScreen from './src/screens/Paygwa/Payment/PaymentResult/PaymentServerFailed';

//SignUp Create Account
import SignUpCreateAccountScreen from './src/screens/Paygwa/SignUp/SignUpCreateAccount';

//PaynowIninitialLogin
import PaynowScreen from './src/screens/Paygwa/PayNow/PayNowCustomerInformation';

//Account Profile
import AccountProfileScreen from './src/screens/Paygwa/AccountProfile';

//AccountSummary
import AccountSummaryScreen from './src/screens/Paygwa/AccountSummary/AccountSummary';
import AccountSummaryBillScreen from './src/screens/Paygwa/AccountSummary/AccountSummaryBill';
import AccountSummaryConsumptionScreen from './src/screens/Paygwa/AccountSummary/AccountSummaryConsumption';
import AccountSummaryHistoryScreen from './src/screens/Paygwa/AccountSummary/AccountSummaryHistory';


//drawer
import SurveyScreen from './src/screens/Paygwa/Survey';
import NewsScreen from './src/screens/Paygwa/News'
import HelpAndSupportScreen from './src/screens/Paygwa/HelpAndSupport'

import { CustomDrawerContent } from './src/components';
import { Root, Container } from "native-base";

const AuthStack = createStackNavigator(
  {
    InitialLogin : {
      screen: InitialLoginScreen,
      navigationOptions : {
        header : null
      }
    }
  },
  {
    initialRouteName: 'InitialLogin'
  }
)

const MyAccountsStack = createStackNavigator(
  {
    MyAccounts: {
      screen: MyAccounts
    },
    Survey: {
      screen: SurveyScreen
    },
    News: {
      screen: NewsScreen
    },
    HelpAndSupport: {
      screen: HelpAndSupportScreen
    },
    AccountProfile:{
      screen: AccountProfileScreen
    },
    AccountSummary: {
      screen: AccountSummaryScreen
    },
    AccountSummaryBill : {
      screen: AccountSummaryBillScreen
    },
    AccountSummaryConsumption : {
      screen: AccountSummaryConsumptionScreen
    },
    AccountSummaryHistory : {
      screen: AccountSummaryHistoryScreen
    },
    PaymentInput: {
      screen: PaymentInputScreen
    },
    PaymentView: {
      screen: PaymentViewScreen
    },
    PaymentPayNow: {
      screen: PaymentPayNowScreen
    },
    PaymentSuccess: {
      screen: PaymentSuccessScreen
    },
    PaymentUserFailed: {
      screen: PaymentUserFailedScreen
    },
    PaymentServerFailed: {
      screen: PaymentServerFailedScreen
    }
  },
  {
    initialRouteName: 'MyAccounts',
    gesturesEnabled: false,
    navigationOptions : {
      header : null,
    }
  }
)


const DrawerStack = createDrawerNavigator(
  {
    MyAccounts : {
      screen: MyAccountsStack,
    }
  },
  {
    contentComponent: CustomDrawerContent,
    contentOptions: {
      activeBackgroundColor: colors.PRIMARY_COLOR,
      activeTintColor: colors.WHITE,
      inactiveTintColor: colors.PRIMARY_COLOR,
    }
  }
)

const InitialStack = createStackNavigator(
  {
    InitialLogin: {
      screen: InitialLoginScreen,
    },
    Paynow: {
      screen: PaynowScreen
    },
    Login: {
      screen: LoginScreen
    },
    SignUpCreateAccount: {
      screen: SignUpCreateAccountScreen
    },
  },
  {
    initialRouteName: 'InitialLogin',
    gesturesEnabled: false,
    navigationOptions: {
      header: null,
    }
  }
)


const CombinedStack = createSwitchNavigator(
  {
    AuthStack : AuthStack,
    InitialStack: InitialStack,
    DrawerStack: DrawerStack
  },
  {
    initialRouteName : 'AuthStack'
  }
)


export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      isFontLoading : true,
    }
  }

  
  async componentDidMount() {
    await Font.loadAsync({
      'Lato': require('./assets/fonts/Lato-Regular.ttf'),
      'Lato_Bold': require('./assets/fonts/Lato-Bold.ttf')
    });
    this.setState({
      isFontLoading : false
    })
  }

  render() {
    if( this.state.isFontLoading ) {
      return(
        <Root>
          <AppLoading/>
        </Root>
      )
    }
    else {
      return (
        <Root>
          <Provider store={store}>
            {/* <ConnectedRootContainer /> */}
    
            <CombinedStack ref={ navigationRef => 
              {
                NavigationService.setTopLevelNavigator(navigationRef)
              }
            }/>
  
          </Provider>
        </Root>
      );
    }
  }
}

