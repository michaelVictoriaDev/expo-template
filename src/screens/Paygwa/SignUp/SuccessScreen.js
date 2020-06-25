import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Icon, Input, Picker, Content, Item, Text, CheckBox, ListItem, Body, Toast } from 'native-base';
import {
    KeyboardAvoidingView, View, Alert, BackHandler, Linking
} from 'react-native';

import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import StepIndicator from 'react-native-step-indicator';
import SignUpAccountDetails from './SignUpAccountDetails'
import NavigationService from '../../../NavigationService';
import axios from 'react-native-axios';
import { PAYGWA_URL, DASHBOARD_URL, PAYNOW_URL } from 'react-native-dotenv';

class SuccessScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    // onSubmit() {
    //     const userDetails = this.state.userDetails
    //     if (userDetails.password)

    // }

    handleBackButtonClick() {
        NavigationService.goBack('Login')
        return true;
    }



    //RENDER MAIN COMPONENT
    render() {
        return (
            /* MAIN VIEW COMPONENT */
            <Container >
                <CustomHeader
                    LeftIcon={<Right />}
                    // leftButtonFunction={() => NavigationService.goBack('Login')}
                    title="Create Account"
                    RightIcon={<Right />}
                />
                <OfflineNotice />
                <Content style={{ backgroundColor: '#FFFF', paddingTop: 30, paddingHorizontal: 60 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon
                            style={{ color: colors.LIGHT_GREEN, fontSize: 80, paddingTop: 40 }}
                            name={'check-circle'} type='FontAwesome'
                        />

                        <CustomTextBold style={{ paddingVertical: 20, textAlign: 'center', fontSize: 24 }}>
                            Thank you for registering your PayGWA Account
                        </CustomTextBold>

                        <CustomText style={{ paddingVertical: 20, textAlign: 'center', fontSize: 16 }}>
                            You will receive an email confirming your registration.
                        </CustomText>


                        <CustomText style={{ paddingVertical: 20, textAlign: 'center', fontSize: 16 }}>
                            Remember to check your junk or spam folder as the email may have been caught by your spam filter.
                        </CustomText>
                        <View style={{ paddingTop: 15 }} />
                        <Button style={{ borderRadius: 6 }} block success
                            onPress={() => {
                                NavigationService.navigate('Login')
                            }


                            }>
                            <Text uppercase={false} > Login Here</Text>
                        </Button>
                    </View>



                </Content>

            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    users: state.users
})

export default connect(mapStateToProps, {

})(SuccessScreen);
