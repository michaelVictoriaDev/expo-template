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

// import InitialLoginScreen from './src/screens/Paygwa/InitialLogin';
import LoginScreen from './src/screens/Paygwa/Login';
import MyAccounts from './src/screens/Paygwa/MyAccounts';

//drawer
import SurveyScreen from './src/screens/Paygwa/Survey';
import NewsScreen from './src/screens/Paygwa/News'
import HelpAndSupportScreen from './src/screens/Paygwa/HelpAndSupport'

import { CustomDrawerContent } from './src/components';
import { Root, Container } from "native-base";

const AuthStack = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'Login'
  }
)

const MyAccountsStack = createStackNavigator(
  {
    MyAccounts: {
      screen: MyAccounts
    }
  },{
    initialRouteName: 'MyAccounts',
    gesturesEnabled: false,
    navigationOptions: {
      header: null,
    }
  }
)


const DrawerStack = createDrawerNavigator(
  {
    MyAccounts: {
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
    Login: {
      screen: LoginScreen
    }
  },
  {
    initialRouteName: 'Login',
    gesturesEnabled: false,
    navigationOptions: {
      header: null,
    }
  }
)


const CombinedStack = createSwitchNavigator(
  {
    AuthStack: AuthStack,
    InitialStack: InitialStack,
    DrawerStack: DrawerStack
  },
  {
    initialRouteName: 'AuthStack'
  }
)


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFontLoading: true,
    }
  }


  async componentDidMount() {
    await Font.loadAsync({
      'Lato': require('./assets/fonts/Lato-Regular.ttf'),
      'Lato_Medium': require('./assets/fonts/Lato-Medium.ttf'),
      'Lato_Bold': require('./assets/fonts/Lato-Bold.ttf'),
      'Roboto': require('./assets/fonts/Roboto.ttf'),
      'Roboto_medium': require('./assets/fonts/Roboto-Medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({
      isFontLoading: false
    })
  }

  render() {
    if (this.state.isFontLoading) {
      return (
        <Root>
          <AppLoading />
        </Root>
      )
    }
    else {
      return (
        <Root>
          <Provider store={store}>
            {/* <ConnectedRootContainer /> */}

            <CombinedStack ref={navigationRef => {
              NavigationService.setTopLevelNavigator(navigationRef)
            }
            } />

          </Provider>
        </Root>
      );
    }
  }
}

