import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View, Image, StyleSheet, Alert, TouchableHighlight, Linking, PixelRatio, Platform } from 'react-native';
import { Button, Text, Content, Footer, Icon } from 'native-base';
import { MaterialCommunityIcons, FontAwesome, MaterialIcons, Entypo, Ionicons } from '@expo/vector-icons';
// import { DrawerItems } from 'react-navigation';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { colors, pRatioToFontSize } from '../utils/constants';
import NavigationService from '../NavigationService';
// import { listenToNotifTimeStamp } from '../actions';
import _ from 'lodash';
import UserAvatar from 'react-native-user-avatar';
import CustomText from '../components/CustomText';
import CustomTextBold from '../components/CustomTextBold';

import {
  saveAccountId,
  savePremiseAddress,
  fetchMultipleAddOpptyRequest,
  fetchMultipleLatestBill,
  saveOrderData
} from '../actions/userMyAccounts';

const ContainerView = styled.View`
  flex: 1;
  backgroundColor: #FFFFFF;
  opacity : 0.95;
  
`;

const AvatarContainer = styled.View`
  backgroundColor: #E2E6EA;
  flex: 1;
  flexDirection: row;
  paddingVertical: 50;
  paddingHorizontal: 40;
  overflow: hidden;
  justifyContent: center;
  alignItems: center;
  paddingRight: 0;
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
    justifyContent: 'flex-start',
    marginTop: 15
  },
  drawer_button_icon: {
    marginLeft: 20
  },
  analytics_submenu_container: {
    paddingHorizontal: 20
  },
  drawer_button_text: {
    color: colors.BLACK,
    fontSize: 18,
    paddingLeft: 30,
  }
})


class CustomDrawerContent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      colors: ['#1788c7']
    }
  }

  componentWillMount() {

  }


  componentDidMount() {


  }


  render() {
    var fullName = _.get(this.props.dashboard.userAccountDetails, 'fullName', 'Not Applicable NONO')
    var finalFullName = fullName.split(' ').slice(0, -1).join(' '); // returns 
    
    return (
      <ContainerView>
        <AvatarContainer>
          <UserAvatar
            name={finalFullName}
            // scr={this.props.userObject.social_img}
            color={colors.PRIMARY_COLOR}
            size={'70'}
          />
          <View style={{
            justifyContent: 'center',
            alignItems: 'flex-start',
            // width : PixelRatio.getPixelSizeForLayoutSize(100),
            // paddingVertical: PixelRatio.getPixelSizeForLayoutSize(Platform.OS === 'ios' ? 10 : 20), 
            // paddingHorizontal: PixelRatio.getPixelSizeForLayoutSize(10), 
            width: 200,
            paddingVertical: pRatioToFontSize(),
            paddingHorizontal: pRatioToFontSize(),
          }}>
            <Text
              style={{
                color: colors.BLACK,
                fontSize: pRatioToFontSize() > 30 ? 30 : pRatioToFontSize(),
              }}
              ellipsizeMode='tail'
              numberOfLines={1}
            >
             {_.get(this.props.dashboard.userAccountDetails, 'fullName', 'NA')}</Text> 
              {/* {this.props.dashboard.userAccountDetails.fullName}</Text> */}

          </View>
        </AvatarContainer>
        <ItemContainer>
          <ScrollView>
            {/* <DrawerItems {...this.props} /> */}
            <Content contentContainerStyle={{ flex: 1, paddingTop: 20 }}>

              {this.summaryDrawerButton()}
              {this.profileDrawerButton()}
              {/* {this.myAccountsDrawerButton()} */}
              <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginHorizontal: 30, marginTop: 15 }} />
              {this.surveyDrawerButton()}
              {this.newsDrawerButton()}
              {this.helpAndSupportDrawerButton()}
              {/*LOG-OUT*/}
              {this.logoutDrawerButton()}

            </Content>
            {/* FOOTER FOR LOG OUT BUTTON */}
          </ScrollView>
        </ItemContainer>
      </ContainerView>
    )
  }

  // ACCOUNT SUMMARY BUTTON
  summaryDrawerButton() {
    return (
      <Button transparent block onPress={() => {
        // NavigationService.navigate('Survey')
      }} style={styles.drawer_button}>
        <CustomText uppercase={false} style={styles.drawer_button_text}>Account Summary</CustomText>
      </Button>
    )
  }

  // ACCOUNT PROFILE BUTTON
  profileDrawerButton() {
    return (
      <Button transparent block onPress={() => {
        this.props.navigation.navigate('AccountProfile', {
          getApiData: () => this.getApiData()
        })
      }} style={styles.drawer_button}>
        <CustomText uppercase={false} style={styles.drawer_button_text}>Account Profile</CustomText>
      </Button>
    )
  }

  // MyyAccounts DRAWER BUTTON
  myAccountsDrawerButton() {
    return (
      <Button iconLeft transparent block onPress={() => {
        NavigationService.navigate('MyAccounts')
      }} style={styles.drawer_button}>
        <Icon style={{ color: colors.BLACK, marginLeft: 30 }} name='th-list' type='FontAwesome' />
        <CustomText uppercase={false} style={styles.drawer_button_text}>My Accounts</CustomText>
      </Button>
    )
  }

  // SURVEY DRAWER BUTTON
  surveyDrawerButton() {
    return (
      <Button transparent block onPress={() => {
        NavigationService.navigate('Survey')
      }} style={styles.drawer_button}>
        <CustomText uppercase={false} style={styles.drawer_button_text}>Survey</CustomText>
      </Button>
    )
  }

  helpAndSupportDrawerButton() {
    return (
      <Button transparent block onPress={() => {
        NavigationService.navigate('HelpAndSupport')
      }} style={styles.drawer_button}>
        <CustomText uppercase={false} style={styles.drawer_button_text}>Help & Support</CustomText>
      </Button>
    )
  }

  newsDrawerButton() {
    return (
      <Button transparent block onPress={() => {
        // NavigationService.navigate('News')
        Linking.openURL('http://guamwaterworks.org/')
      }} style={styles.drawer_button}>
        <CustomText uppercase={false} style={styles.drawer_button_text}>News</CustomText>
      </Button>
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
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'Yes', onPress: () => NavigationService.navigate('Login') },
          ],
          { cancelable: true },
        );

      }} style={styles.drawer_button}>
        <Text uppercase={false} style={styles.drawer_button_text}>Logout</Text>
      </Button>
    )
  }

};

const mapStateToProps = (state) => ({
  userPersonId: state.userState.userPersonId,
  accountIds: state.userState.accountIds,
  accountId: state.userState.accountId,
  dashboard: state.dashboard
})

const mapDispatchToProps = (dispatch) => ({
  // listenToNotifTimeStamp: (userId) => dispatch(listenToNotifTimeStamp(userId))
})

export default connect(mapStateToProps, {
  saveAccountId,
  savePremiseAddress,
  fetchMultipleAddOpptyRequest,
  fetchMultipleLatestBill,
  saveOrderData
})(CustomDrawerContent);
