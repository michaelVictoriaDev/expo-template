import React, { Component } from 'react';
import { SafeAreaView, Platform } from 'react-native';
import { Provider, connect } from 'react-redux';
// import { ThemeProvider } from 'styled-components';
// import styled from 'styled-components/native';
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

import LoginScreen from './src/screens/Login';



import { CustomDrawerContent } from './src/components';
import { Root, Container } from "native-base";

const AuthStack = createStackNavigator(
  {
    Login : {
      screen : LoginScreen,
      navigationOptions : {
        header : null
      }
    }
  },
  {
    initialRouteName : 'Login'
  }
)

// const LeadsStack = createStackNavigator(
//   {
//     Lead: {
//       screen: LeadsScreen,
//     }
//   },
//   {
//     initialRouteName: 'Lead',
//     gesturesEnabled: false,
//     navigationOptions : {
//       header : null,
//     }
//   }
// )


const DrawerStack = createDrawerNavigator(
  {
    Leads : {
      screen : LeadsStack,
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


const CombinedStack = createSwitchNavigator(
  {
    AuthStack : AuthStack,
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
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
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

