import React, { Component } from 'react';
import { PixelRatio, StyleSheet } from 'react-native';
import { Header, Left, Body, Right, Icon, Title, Button, View, Text, Badge} from 'native-base';
import { colors, pRatioToFontSize } from '../utils/constants';
import { connect } from 'react-redux';
import { getNotifCount } from '../actions';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import _ from 'lodash'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationService from '../NavigationService';
import IconBadge from 'react-native-icon-badge';

class CustomHeader extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.leftIconName == 'menu') {
      this.props.getNotifCount(this.props.userDetails.user_id);
    }
    pRatioToFontSize()
    // console.log(pRatioToFontSize())
  }

  render() {
    return (
      <Header style={{
        backgroundColor: colors.PRIMARY_COLOR,
      }}
      >
        <Left style={{ flex: 1 }}>
          {this.props.LeftIcon == null ?

            <Button style={{ paddingLeft: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, elevation: 0 }} onPress={() => this.props.leftButtonFunction()
            }>
              <Icon
                style={{ color: colors.WHITE, fontSize: pRatioToFontSize(+2) > 30 ? 30 : pRatioToFontSize(+2) }}
                name={this.props.leftIconName == null ? 'arrow-back' : this.props.leftIconName}
              />
            </Button>

            :
            this.props.LeftIcon
          }
        </Left>

        <Body style={{ flex: 1, alignItems: 'center' }}>
          <Title style={{ color: colors.WHITE, fontSize: pRatioToFontSize(-.5) > 25 ? 25 : pRatioToFontSize(-.5) }}>{this.props.title}</Title>
        </Body>
        <Right style={{ paddingRight: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, flex: 1 }}>
          {
            this.props.notificationStore.unreadNotifs > 0 && this.props.leftIconName == 'menu' ?
              <Button style={{ paddingLeft: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, elevation: 0, paddingRight: 0 }} onPress={() => NavigationService.navigate('Notification')} >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                  <IconBadge
                    MainElement={
                      <View style={{
                        backgroundColor: colors.PRIMARY_COLOR,
                        // width: 33,
                        // height: 33,
                        marginTop: 6,
                        marginRight: 8,

                        position: 'relative'
                      }} >
                        <FontAwesome
                          style={{
                            color: this.props.notificationStore.unreadNotifs > 0 ? 'red' : 'white',
                            fontSize: pRatioToFontSize(+1) > 20 ? 20 : pRatioToFontSize(+1)
                          }} name={'bell'} />
                      </View>
                    }
                    IconBadgeStyle={{ zIndex: 1 }}
                    BadgeElement={
                      this.props.notificationStore.unreadNotifs >= 1000 ? 
                      <Text style={{ color: '#FFFFFF', fontSize: 10 }}>1k+</Text>
                        :
                        <Text style={{ color: '#FFFFFF', fontSize: 10 }}>{this.props.notificationStore.unreadNotifs}</Text>
                    }
                    Hidden={this.props.notificationStore.unreadNotifs == 0}
                  />
                </View>
              </Button>
              :
              this.props.rightButtonFunction != null ?

                this.props.RightIcon == null
                  ?
                  <Button style={{ paddingRight: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, elevation: 0 }} onPress={() => this.props.rightButtonFunction()}>
                    <Icon
                      style={{ color: colors.WHITE, fontSize: pRatioToFontSize(+1) > 30 ? 30 : pRatioToFontSize(+1) }}
                      name={this.props.rightIconName == null ? 'md-checkmark' : this.props.rightIconName}
                    />
                  </Button>
                  :
                  this.props.RightIcon
                  :
                null
          }
        </Right>
      </Header>
    );
  }
}

const mapStateToProps = (state) => ({
  userDetails: state.userState.userDetails,
  notificationStore: state.notificationStore.notificationObject,
})

const mapDispatchToProps = (dispatch) => ({
  getNotifCount: (userId) => dispatch(getNotifCount(userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomHeader);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});