import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button, Container, Header, Left, Body, Right, Badge, Footer, FooterTab, Icon, Input, Picker, Toast, CheckBox, Content, ListItem, Form, Item, Text } from 'native-base';
import {
    PixelRatio, StyleSheet, Dimensions, TouchableHighlight, Image, Alert, AppState, FlatList, Linking, View, ActivityIndicator, Platform, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserAvatar from 'react-native-user-avatar';
import Moment from 'moment';
import Modal from 'react-native-modal';
// import ProgressSteps from '../../../components/ProgressSteps/ProgressSteps'
// import ProgressStep  from '../../../components/ProgressSteps/ProgressStep';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps'
import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import CustomTextBold from '../../../components/CustomTextBold';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import { Grid, Row, Col } from 'react-native-easy-grid';
import {
    checkAccountNumber,
    getOtherDetails,
    getPremiseInfo,
    getAcovInfo
} from '../../../actions/userSignUp';

class SignUpCreateAccount extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            billAddressSource: '',
            resultMessage: '',
            isSuccess: false,
            showSample: false,
            isLoading: false,
            accountId: '',
            isValid: false,
            errors: false
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
// For Function ProgressStep
    defaultScrollViewProps = {
        keyboardShouldPersistTaps: 'handled',
        contentContainerStyle: {
            flex: 1,
            justifyContent: 'center'
        }
    };


    onNextStep = () => {


    };

    onPaymentStepComplete = () => {

    };

    onPrevStep = () => {
        console.log('called previous step');
    };

    onSubmitSteps = () => {
        console.log('called on submit step.');
    };

// end of ProgressStep


// Account Number Details Function



    onSubmit = () => {
        this.setState({
            isLoading: true,
        })
        this.props.checkAccountNumber(this.state.accountId)
            .then((response) => {
                if (response.status === "False") {
                    //first check if response.data is array, if true get index 0
                    if (Array.isArray(response.data)) {
                        for (var index = 0; index < response.data.length; index++) {
                            if (response.data[index].accountRelationshipType === "MAIN") {
                                if (response.data[index].billAddressSource === 'PER') {
                                    this.setState({
                                        billAddressSource: 'PER'
                                    })
                                    this.props.getOtherDetails(response.data[index].personId)
                                        .then(() => {
                                            console.log("PER")
                                            this.setState({
                                                isLoading: false,
                                                 errors: false
                                            })
                                        })
                                }
                                else if (response.data[index].billAddressSource === 'PREM') {
                                    this.setState({
                                        billAddressSource: 'PREM'
                                    })
                                    this.props.getPremiseInfo(this.state.accountId)
                                        .then(() => {
                                            console.log('PREM')
                                                 this.setState({
                                                isLoading: false,
                                                 errors: false
                                            })
                                        })
                                }
                                else if (response.data[index].billAddressSource === 'ACOV') {
                                    this.setState({
                                        billAddressSource: 'ACOV'
                                    })
                                    const postData = response.data[index].personAddressOverride
                                    this.props.getOtherDetails(response.data[index].personId)
                                        .then(() => {
                                            this.props.getAcovInfo(postData)
                                            console.log('ACOV')
                                                 this.setState({
                                                isLoading: false,
                                                 errors: false
                                            })
                                        })
                                }
                            }
                        }
                    }
                    else {
                        if (response.data.billAddressSource === 'PER') {
                            this.setState({
                                billAddressSource: 'PER'
                            })
                            this.props.getOtherDetails(response.data.personId)
                                .then(() => {
                                   
                                       this.setState({
                                                isLoading: false,
                                                 errors: false
                                            })
                                    console.log('PER - else ', this.state.errors)
                                })
                        }
                        else if (response.data.billAddressSource === 'PREM') {
                            this.setState({
                                billAddressSource: 'PREM'
                            })
                            this.props.getOtherDetails(response.data.personId)
                                .then(() => {
                                    this.props.getPremiseInfo(this.state.accountId)
                                        .then(() => {
                                            console.log('PREM - else ')
                                                 this.setState({
                                                isLoading: false,
                                                 errors: false
                                            })
                                        })
                                })
                        }
                        else if (response.data.billAddressSource === 'ACOV') {
                            this.setState({
                                billAddressSource: 'ACOV'
                            })
                            const postData = response.data.personAddressOverride
                            this.props.getOtherDetails(response.data.personId)
                                .then(() => {
                                    this.props.getAcovInfo(postData)
                                    console.log('ACOV - else ')
                                       this.setState({
                                                isLoading: false,
                                                 errors: false
                                            })
                                })
                        }
                    }
                }
                else {
                    this.setState({ isValid: true, resultMessage: response.description, isLoading: false, error: true })
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    onChange = (e) => {
        this.setState({
            ...this.state,
            accountId: e.target.value
        })
    }

    handleClose() {
        this.setState({ showSample: false });
    }

    handleShow(e) {
        this.setState({ showSample: true });
    }

// End of Account Number Details Function

    
    //RENDER MAIN COMPONENT
    render() {
        return (
            /* MAIN VIEW COMPONENT */
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={this.props.navigation.goBack}
                    title="SignUpCreateAccount"
                    RightIcon={<Right />}
                />
                <OfflineNotice />
                <Content style={{ backgroundColor: '#ECEFF2', paddingHorizontal: 40 }} >

                    <ProgressSteps 
                    progressBarColor={'#D0D1D3'}
                    activeStepIconBorderColor={colors.PRIMARY_COLOR}
                    activeStepIconBorderColor={colors.PRIMARY_COLOR}
                    completedProgressBarColor={colors.PRIMARY_COLOR}
                    completedStepIconColor={colors.PRIMARY_COLOR}
                    disabledStepIconColor={'#D0D1D3'}
                    activeLabelColor={colors.BLACK}
                    >
                        <ProgressStep
                            errors={this.state.errors}
                            // nextBtnText={this.state.isLoading ? 'Verifying...' : 'Continue'}
                            nextBtnTextStyle={{color: '#ffff'}}
                            nextBtnText={'Continue'}
                            label="ENTER ACCOUNT NO."
                            onNext={this.onNextStep}
                            nextBtnDisabled={this.state.isLoading}
                            onPrevious={this.onPrevStep}
                            scrollViewProps={this.defaultScrollViewProps}
                        >
                            <CustomText style={{ paddingVertical: 5}}>Enter the 10-digit account number </CustomText>
                            {this.state.isValid ? 
                                <CustomText style={{ color: colors.RED, paddingVertical: 5 }}>{this.state.resultMessage}</CustomText>
                            :
                            null
                            }
                            
                            <Item regular 
                                style={{
                                    borderStyle: 'solid',
                                    marginLeft: 0,
                                    backgroundColor: colors.WHITE,
                                    borderRadius: 6,
                                    borderColor: this.state.isValid ? 'red' : 'lightgray',
                                    marginBottom: 5,
                                    borderWidth: 1
                                }}>
                                <Input
                                    keyboardType='numeric'
                                    autoCapitalize='none'
                                    value={this.state.accountId}
                                    onChangeText={ (text) => {
                                        this.setState({
                                            ...this.state,
                                            accountId: text
                                        })
                                    }}
                                />
                                {this.state.isValid ? 
                                    <Icon onPress={()=> {
                                        this.setState({
                                            ...this.state,
                                            accountId: ''
                                        })
                                    }} style={{ color: colors.RED }} name='close-circle' />
                                    :
                                    null
                                }
                               
                            </Item>
                            <Button full primary>
                                <Text>Verify</Text>
                            </Button>
                            <Button full Success>
                                <Text>Verify</Text>
                            </Button>
                        </ProgressStep>
                        <ProgressStep
                            label="ACCOUNT DETAILS"
                            nextBtnText='Continue'
                            onNext={this.onNextStep}
                            onPrevious={this.onPrevStep}
                            scrollViewProps={this.defaultScrollViewProps}
                        >
                            <View style={{ alignItems: 'center' }}>
                                <Text>ACCOUNT DETAILS step content</Text>
                            </View>
                        </ProgressStep>
                        <ProgressStep
                            label="LOGIN DETAILS"
                            nextBtnText='Continue'
                            onNext={this.onNextStep}
                            onPrevious={this.onPrevStep}
                            scrollViewProps={this.defaultScrollViewProps}
                        >
                            <View style={{ alignItems: 'center' }}>
                                <Text>LOGIN DETAILS step content</Text>
                            </View>
                        </ProgressStep>
                    </ProgressSteps>

                </Content>

            </Container>
        )
    }
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, {
    checkAccountNumber,
    getOtherDetails,
    getPremiseInfo,
    getAcovInfo
})(SignUpCreateAccount);
