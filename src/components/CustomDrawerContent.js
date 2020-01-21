import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View, Image, StyleSheet, Alert, TouchableHighlight, Linking, PixelRatio, Platform } from 'react-native';
import { Button, Text, Content, Footer } from 'native-base';
import { MaterialCommunityIcons, FontAwesome, MaterialIcons, Entypo, Ionicons } from '@expo/vector-icons';
// import { DrawerItems } from 'react-navigation';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { colors, pRatioToFontSize } from '../utils/constants';
import NavigationService from '../NavigationService';
import Leads from '../screens/Leads';
import { API_URL, WEB_URL } from 'react-native-dotenv';
import { listenToNotifTimeStamp } from '../actions';
import _ from 'lodash';

const ContainerView = styled.View`
  flex: 1;
  backgroundColor: #3F71D7;
  opacity : 0.95;
  
`;

// const Avatar = styled.View`
//   width: 120;
//   height: 120;
//   borderRadius: 60;
//   backgroundColor: #3F71D7;
// `;

const ItemContainer = styled.View`
  flex: 8;
  flexDirection: column;
  justifyContent: center;
`;


const styles = StyleSheet.create({
  drawer_button: {
    justifyContent: 'flex-start'
  },
  drawer_button_icon: {
    marginLeft: 20
  },
  analytics_submenu_container: {
    paddingHorizontal: 20
  },
  drawer_button_text: {
    color: colors.WHITE,
    fontSize: 16,
    paddingLeft: 20,
  }
})


class CustomDrawerContent extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentWillMount() {

  }

  render() {
    
    return (
      <ContainerView>

        <ItemContainer>
          <ScrollView>
            {/* <DrawerItems {...this.props} /> */}
            <Content contentContainerStyle={{ flex: 1 }}>
            
              {/*LOG-OUT*/}
              {this.logoutDrawerButton()}

            </Content>
            {/* FOOTER FOR LOG OUT BUTTON */}
          </ScrollView>
        </ItemContainer>
      </ContainerView>
    )
  }
 

  // LOG OUT DRAWER BUTTON
  logoutDrawerButton() {
    return (
      <Button transparent block onPress={() => {
        Alert.alert(
          'Log out',
          'Are you sure?',
          [
            {
              text: 'Cancel',
              onPress: () =>  console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'Yes', onPress: () => NavigationService.navigate('Login') },
          ],
          { cancelable: true },
        );

      }} style={styles.drawer_button}>
        <MaterialCommunityIcons name="logout" color='#FFF' size={20} style={styles.drawer_button_icon} />
        <Text uppercase={false} style={styles.drawer_button_text}>Logout</Text>
      </Button>
    )
  }
  
};

const mapStateToProps = (state) => ({
  // userObject: state.userState.userObject,
  // notificationObject: state.notificationStore.notificationObject,
})

const mapDispatchToProps = (dispatch) => ({
  // listenToNotifTimeStamp: (userId) => dispatch(listenToNotifTimeStamp(userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawerContent);
