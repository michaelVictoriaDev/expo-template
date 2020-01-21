import React, { Component } from 'react';
import { View, StyleSheet, AsyncStorage, Linking } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { WEB_URL } from 'react-native-dotenv';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import _ from 'lodash';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

class ExpireBanner extends Component {

  constructor(props){
    super(props);
    this.state = {
      plan_expiry_date : this.props.userObject.plan_expiry_date,
      pay_plan_name : null,
      
    }
  }

  redirectToWeb = () => {
    Linking.openURL( WEB_URL + '/web/settings?billing=true')
  }

  componentWillMount() {
    // console.log(this.props.userObject.plan_expiry_date)
    this.props.userObject.pay_plan.map((item, index) => {
      let payPlanId = this.props.userObject.pay_plan_id;

      if(payPlanId == item.pay_plan_id){
        this.setState({ 
          pay_plan_name : item.plan_description,
        }); 
      }
    }) 
  }

  render() {
    if (_.isNil(this.state.plan_expiry_date)) {
        let accountDisabled =  this.props.userObject.is_disabled
        if (_.isEqual(accountDisabled, 1)) {
          return (
            <View style={styles.container}>
              <Button full transparent
                onPress={() => { this.redirectToWeb() }}>
                <Text uppercase={false} style={styles.warn_message}>
                  {
                    `Your ${this.state.pay_plan_name} is already expired`
                  }
                </Text>
                <Ionicons color="#f44343" name='md-information-circle' size={30} />
              </Button>
            </View>
          )
        } else {
          return null;
        }
    } else {
        let remainingDays = moment(this.state.plan_expiry_date).diff(moment(), 'days') + 1;

        if (remainingDays <= 10) {
          return (
            <View style={styles.container}>
              <Button full transparent
                onPress={() => { this.redirectToWeb() }}>
                <Text uppercase={false} style={styles.warn_message}>
                  {
                    remainingDays <= 0 ?
                      `Your ${this.state.pay_plan_name} is already expired`
                      :
                      `Your ${this.state.pay_plan_name} expires in ${remainingDays} day(s).`
                  }

                </Text>
                <Ionicons color="#f44343" name='md-information-circle' size={30} />
              </Button>
            </View>
          );
      }
      else {
        return null;
      }
    }

  }



}

const mapStateToProps = (state) => ({
  userObject : state.userState.userObject
})

export default connect(mapStateToProps)(ExpireBanner);

const styles = StyleSheet.create({
  container: {
    // flex : 0.5,
    height : hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCF8E3',
  },
  warn_message : {
    color : '#8a6d3b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  renew_button_icon : {
    backgroundColor : '#f44343',
  }
});