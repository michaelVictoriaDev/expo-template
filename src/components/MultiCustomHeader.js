import React, {Component} from 'react';
import { PixelRatio, StyleSheet } from 'react-native';
import { Header, Left, Body, Right, Icon, Title, Button, View, Text } from 'native-base';
import { colors, pRatioToFontSize } from '../utils/constants';
import { connect } from 'react-redux';
import RF from "react-native-responsive-fontsize";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import _ from 'lodash'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationService from '../NavigationService';

// const MultiCustomHeader = (props) => {
class MultiCustomHeader extends Component {

  constructor(props){
    super(props);
  }

  componentWillMount() {
    pRatioToFontSize()
    // console.log('test2' + pRatioToFontSize(+1))
  }


  render() { 
    return (
      <Header style={{ 
          backgroundColor: colors.PRIMARY_COLOR, 
        }}
        >
        <Left style={{ flex: 1 }}>
          { this.props.LeftIcon == null ? 
  
          <Button style={{paddingLeft: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, elevation : 0}} onPress={() => this.props.leftButtonFunction()
          }>
            <Icon
                style={{ color: colors.WHITE, fontSize: pRatioToFontSize(+1) > 30 ? 30 : pRatioToFontSize(+1) }}
              name={this.props.leftIconName == null ? 'arrow-back' : this.props.leftIconName}
            />
          </Button> 
  
          :
            this.props.LeftIcon 
  }
        </Left>
        <Body style={{ flex: 1, alignItems : 'center' }}>
          <Title style={{ color: colors.WHITE, fontSize: pRatioToFontSize(-.5) > 20 ? 20 : pRatioToFontSize(- .5)}}>{this.props.title}</Title>
        </Body>
        <Right style={{ paddingRight: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, flex: 1 }} >
          {
            this.props.RightIcon == null
              ?
              <Button style={{ paddingRight: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, elevation: 0 }} onPress={() => this.props.rightButtonFunction()}>
                <Icon
                  style={{ color: colors.WHITE, fontSize: pRatioToFontSize() > 30 ? 30 : pRatioToFontSize() }}
                  name={this.props.rightIconName == null ? 'md-checkmark' : this.props.rightIconName}
                />
              </Button>
              :
              this.props.RightIcon
          }

        </Right>
      </Header>
    );
  }
}

const mapStateToProps = (state) => ({
  userObject : state.userState.userObject,
})


export default connect(mapStateToProps)(MultiCustomHeader);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});