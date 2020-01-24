import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button, Container, Header, Left, Body, Right, Badge, Footer, FooterTab, Icon, Input, Picker, Toast, CheckBox, Content, ListItem, Form, Item } from 'native-base';
import {
  PixelRatio, StyleSheet, Dimensions, TouchableHighlight, Image, Alert, AppState, FlatList, Linking, View, ActivityIndicator, Platform
} from 'react-native';
import { SimpleLineIcons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { FontAwesome } from 'react-native-vector-icons';
import UserAvatar from 'react-native-user-avatar';
import Moment from 'moment';
import Modal from 'react-native-modal';
import { colors, pRatioToFontSize } from '../../utils/constants';
import CustomText from '../../components/CustomText';
import OfflineNotice from '../../components/OfflineNotice';
import CustomHeader from '../../components/MultiCustomHeader'

const styles = StyleSheet.create({
  func_buttons: {
    flex: 1,
    paddingTop: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: .5,
    width: 200,
    borderColor: '#98a6a6',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  social_media_container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'center'
  },
  prof_container_bottom: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    width: Dimensions.get('window').width,
  },
  date_container: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#069ebe',
    padding: 10
  },
  date_text: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
  },
  func_buttons: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.PRIMARY_COLOR,
    height: 70,
  },
  func_buttons_img: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginBottom: 5
  },
  prof_container_top: {
    padding: 30,
    paddingTop: 20,
    backgroundColor: '#25cef1',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    position: 'relative',
    width: Dimensions.get('window').width
  },
  bg_image: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    resizeMode: 'stretch',
  },
  full_name: {
    textAlign: 'center',
    paddingTop: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  lead_status: {
    paddingTop: 5,
    fontSize: 16,
    paddingBottom: 7
  },
  activity_btn: {
    padding: 10,
    paddingHorizontal: 100,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginTop: 15,
  }
});

class MyAccount extends Component {
  constructor(props) {
    super(props);
    // const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
     
    }
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
              transparent style={{ paddingLeft: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, elevation: 0 }} onPress={() => console.log('icon')} >
              <Icon  >
                <SimpleLineIcons
                  style={{ backgroundColor: colors.WHITE, color: colors.WHITE , fontSize: pRatioToFontSize(+1) > 20 ? 20 : pRatioToFontSize(+1) }} name={'user'} />
              </Icon>
            </Button>
          </Right>}
        />
        <OfflineNotice />
        {/* <Content> <- This component conflicts with FlatList and crashed the infinite scrolling. */}
        <View style={{ flex: 1 }}
          onLayout={event => this.setState({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}
        >
        <CustomText>
           Test
        </CustomText>
         </View>
        
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({

})
export default connect(mapStateToProps)(MyAccount);