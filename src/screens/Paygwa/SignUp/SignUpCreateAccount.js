import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Icon, Input, Content, Item, Text } from 'native-base';
import {
    View
} from 'react-native';

import SignUpAccountDetails from './SignUpAccountDetails'
import { colors, pRatioToFontSize } from '../../../utils/constants';
import CustomText from '../../../components/CustomText';
import OfflineNotice from '../../../components/OfflineNotice';
import CustomHeader from '../../../components/MultiCustomHeader'
import _ from 'lodash'
import {
    checkAccountNumber,
    getOtherDetails,
    getPremiseInfo,
    getAcovInfo
} from '../../../actions/userSignUp';

import NavigationService from '../../../NavigationService';
import StepIndicator from 'react-native-step-indicator';


const labels = ["ENTER ACCOUNT NO.", "ACCOUNT DETAILS", "LOGIN DETAILS" ];
const customStyles = {
    stepIndicatorSize: 35,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: colors.PRIMARY_COLOR,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: colors.PRIMARY_COLOR,
    stepStrokeUnFinishedColor: colors.LINK_WATER,
    separatorFinishedColor: colors.PRIMARY_COLOR,
    separatorUnFinishedColor: colors.LINK_WATER,
    stepIndicatorFinishedColor: colors.PRIMARY_COLOR,
    stepIndicatorUnFinishedColor: colors.LINK_WATER,
    stepIndicatorCurrentColor: colors.PRIMARY_COLOR,
    stepIndicatorLabelFontSize: 14,
    currentStepIndicatorLabelFontSize: 14,
    stepIndicatorLabelCurrentColor: colors.WHITE,
    stepIndicatorLabelFinishedColor: colors.WHITE,
    stepIndicatorLabelUnFinishedColor: colors.WHITE,
    labelColor: colors.BLACK,
    labelSize: 14,
    currentStepLabelColor: colors.BLACK
}

class SignUpCreateAccount extends Component {

    constructor(props) {
        super(props);

        this.state = {
            billAddressSource: '',
            resultMessage: '',
            isSuccess: false,
            showSample: false,
            isLoading: false,
            // accountId: '0103703286',
            accountId: '',
            isValid: false,
            errors: false,
            currentPosition: 0
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


    onPaymentStepComplete = () => {

    };



    onSubmit = () => {
        this.setState({
            isLoading: false,
            isSuccess: true,
            
        })


        // this.setState({
        //     isLoading: true,
        // })
        // this.props.checkAccountNumber(this.state.accountId)
        //     .then((response) => {
        //         if (response.status === "False") {
        //             //first check if response.data is array, if true get index 0
        //             if (Array.isArray(response.data)) {
        //                 for (var index = 0; index < response.data.length; index++) {
        //                     if (response.data[index].accountRelationshipType === "MAIN") {
        //                         if (response.data[index].billAddressSource === 'PER') {
        //                             this.setState({
        //                                 billAddressSource: 'PER'
        //                             })
        //                             this.props.getOtherDetails(response.data[index].personId)
        //                                 .then(() => {
        //                                     console.log("PER")
        //                                     this.setState({
        //                                         isLoading: false,
        //                                         isSuccess: true
        //                                     })
        //                                 })
        //                         }
        //                         else if (response.data[index].billAddressSource === 'PREM') {
        //                             this.setState({
        //                                 billAddressSource: 'PREM'
        //                             })
        //                             this.props.getPremiseInfo(this.state.accountId)
        //                                 .then(() => {
        //                                     console.log('PREM')
        //                                     this.setState({
        //                                         isLoading: false,
        //                                         isSuccess: true
        //                                     })
        //                                 })
        //                         }
        //                         else if (response.data[index].billAddressSource === 'ACOV') {
        //                             this.setState({
        //                                 billAddressSource: 'ACOV'
        //                             })
        //                             const postData = response.data[index].personAddressOverride
        //                             this.props.getOtherDetails(response.data[index].personId)
        //                                 .then(() => {
        //                                     this.props.getAcovInfo(postData)
        //                                     console.log('ACOV')
        //                                     this.setState({
        //                                         isLoading: false,
        //                                         isSuccess: true
        //                                     })
        //                                 })
        //                         }
        //                     }
        //                 }
        //             }
        //             else {
        //                 if (response.data.billAddressSource === 'PER') {
        //                     this.setState({
        //                         billAddressSource: 'PER'
        //                     })
        //                     this.props.getOtherDetails(response.data.personId)
        //                         .then(() => {

        //                             this.setState({
        //                                 isLoading: false,
        //                                 isSuccess: true
        //                             })
        //                             console.log('PER - else ', this.state.errors)
        //                         })
        //                 }
        //                 else if (response.data.billAddressSource === 'PREM') {
        //                     this.setState({
        //                         billAddressSource: 'PREM'
        //                     })
        //                     this.props.getOtherDetails(response.data.personId)
        //                         .then(() => {
        //                             this.props.getPremiseInfo(this.state.accountId)
        //                                 .then(() => {
        //                                     console.log('PREM - else ')
        //                                     this.setState({
        //                                         isLoading: false,
        //                                         isSuccess: true
        //                                     })
        //                                 })
        //                         })
        //                 }
        //                 else if (response.data.billAddressSource === 'ACOV') {
        //                     this.setState({
        //                         billAddressSource: 'ACOV'
        //                     })
        //                     const postData = response.data.personAddressOverride
        //                     this.props.getOtherDetails(response.data.personId)
        //                         .then(() => {
        //                             this.props.getAcovInfo(postData)
        //                             console.log('ACOV - else ')
        //                             this.setState({
        //                                 isLoading: false,
        //                                 isSuccess: true
        //                             })
        //                         })
        //                 }
        //             }
        //         }
        //         else {
        //             this.setState({ isValid: true, resultMessage: response.description, isLoading: false })
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })
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
           
                (this.state.isSuccess === true) ?
                    <SignUpAccountDetails billAddressSource={this.state.billAddressSource} />
                    :
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={() => NavigationService.goBack('Login')}
                    title="Create Account"
                    RightIcon={<Right />}
                />
                <OfflineNotice />
                    <View style={{ paddingVertical: 20, paddingHorizontal: 40 }} >
                <StepIndicator
                    stepCount={3}
                    customStyles={customStyles}
                    currentPosition={this.state.currentPosition}
                    labels={labels}
                />
                    </View>
                    <Content style={{ backgroundColor: colors.WHITE, paddingHorizontal: 60, paddingTop: 30 }} >
                        <CustomText style={{ paddingVertical: 5 }}>Enter the 10-digit account number </CustomText>
                        {this.state.isValid ?
                            <CustomText style={{
                                color: colors.RED, paddingVertical: 5
                            }}>
                                {
                                    this.state.isValid ?
                                        this.state.resultMessage
                                        :
                                        null
                                }
                            </CustomText>
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
                                    onChangeText={(text) => {
                                        this.setState({
                                            ...this.state,
                                            accountId: text
                                        })
                                    }}
                                />
                                {this.state.isValid ?
                                    <Icon onPress={() => {
                                        this.setState({
                                            ...this.state,
                                            accountId: ''
                                        })
                                    }} style={{ color: colors.RED }} name='close-circle' />
                                    :
                                    null
                                }

                            </Item>
                            <View style={{ paddingVertical: 15 }}>
                                <Button block success onPress={this.onSubmit.bind(this)} disabled={this.state.isLoading}>
                                    <Text>{this.state.isLoading ? 'Verifying' : 'Continue'}</Text>
                                </Button>
                            </View>
                   
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
