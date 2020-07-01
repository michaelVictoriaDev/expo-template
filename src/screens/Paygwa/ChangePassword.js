import React, { Component } from 'react';
import { Container, Right, Content, List, ListItem, Separator, Text, Left, Body, View, Button, Icon, Input, Item } from 'native-base';
import { ActivityIndicator, Keyboard, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { colors, pRatioToFontSize } from '../../utils/constants';
import _ from 'lodash';
import CustomText from '../../components/CustomText';
import CustomTextBold from '../../components/CustomTextBold';
import OfflineNotice from '../../components/OfflineNotice';
import CustomHeader from '../../components/MultiCustomHeader'
import { Grid, Row, Col } from 'react-native-easy-grid';
import { updateUserPassword } from '../../actions/userMyAccounts'
import Modal from 'react-native-modal';

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        // local state
        this.state = {
            pixelDensity: 0,
            isLoadingData: false,
            userDetails: {
                currentPassword: '',
                password: '',
                passwordConfirm: '',
            },
            successModal: false,
            errorModal: false

        }
    }

    componentWillMount() {



    }

    componentWillUnmount() {

    }

    submitPassword() {
        this.setState({ isLoadingData: true })
        // setTimeout(() => {
        //     this.setState({ isLoadingData: true },
        //         () => {
        //             console.log('isLoadingData', this.state.isLoadingData)
                    
        //         });
        // }, 2000)

        if (this.state.userDetails.password == '' || this.state.userDetails.currentPassword == '' || this.state.userDetails.passwordConfirm == '') {
            alert('Please fill out all the fields.')
            this.setState({
                isLoadingData: false
            })
        } else {
            console.log('proceed')
  
            const postData = {
                personId: this.props.userPersonId,
                oldPassword: this.state.userDetails.currentPassword,
                password: this.state.userDetails.password
            }
            this.props.updateUserPassword(postData)
                .then((response) => {
                    if (response.result.status === "True") {
                        this.setState({
                            isLoadingData: false,
                            successModal: true,
                            errorModal: false,
                            successMessage: response.result.description,
                            errorMessage: '',
                            userDetails: {
                                ...this.state.userDetails,
                                currentPassword: '',
                                password: '',
                                passwordConfirm: '',
                            }

                        })
                    } else {
                        this.setState({
                            isLoadingData: false,
                            successModal: false,
                            errorModal: true,
                            successMessage: '',
                            errorMessage: response.result.description
                        })
                    }
                })
                .catch((error) => {
                    this.setState({
                        ...this.state,
                        isLoadingData: false
                    })
                    Toast.show({
                        text: "Server error! Please try again later!",
                        duration: 3000
                    })
                })
        }

    }


    render() {
        return (
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={this.props.navigation.goBack}
                    title="Password Settings"
                    RightIcon={<Right />}
                />
                <OfflineNotice />
                {this.state.successModal ?
                    <Modal isVisible={this.state.successModal} backdropColor={'rgba(0,0,0,.4)'} backdropOpacity={1}
                        avoidKeyboard={true}
                        onBackdropPress={() => this.setState({ successModal: false })}
                    >
                        <View style={{ backgroundColor: colors.WHITE, paddingVertical: 20 }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-end'

                            }}>
                                <Button transparent small onPress={() => this.setState({ successModal: false })}  >
                                    <Icon style={{ color: '#656667', fontSize: 24 }} name='md-close-circle' type='Ionicons' />
                                </Button>

                            </View>
                            <View style={{
                                paddingHorizontal: 20, paddingVertical: 20,
                                justifyContent: 'center',
                            }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
                                    <Icon style={{ color: colors.LIGHT_GREEN, fontSize: 60 }}
                                        name='check-circle' type='FontAwesome' />
                                </View>
                                <CustomText style={{ textAlign: 'center', fontSize: 26 }}>
                                    Success!
                            </CustomText>
                                <CustomText style={{ textAlign: 'center', fontSize: 26 }}>
                                    {this.state.successMessage}
                                </CustomText>

                                <Button style={{ borderRadius: 6 }} transparent block onPress={() =>
                                    this.props.navigation.pop(3)
                                } >
                                    <CustomText uppercase={false} style={{ color: '#1688ca', textDecorationLine: 'underline', fontSize: 16 }} >Back to Dashboard</CustomText>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                    :
                    false}

                {this.state.errorModal ?
                    <Modal isVisible={this.state.errorModal} backdropColor={'rgba(0,0,0,.4)'} backdropOpacity={1}
                        avoidKeyboard={true}
                        onBackdropPress={() => this.setState({ errorModal: false })}
                    >
                        <View style={{ backgroundColor: colors.WHITE, paddingVertical: 20 }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-end'

                            }}>
                                <Button transparent small onPress={() => this.setState({ errorModal: false })}  >
                                    <Icon style={{ color: '#656667', fontSize: 24 }} name='md-close-circle' type='Ionicons' />
                                </Button>

                            </View>
                            <View style={{
                                paddingHorizontal: 20, paddingVertical: 20,
                                justifyContent: 'center',
                            }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
                                    <Icon style={{ color: colors.RED, fontSize: 60 }}
                                        name='warning' type='FontAwesome' />
                                </View>
                                <CustomText style={{ textAlign: 'center', fontSize: 26 }}>
                                    Error!
                                </CustomText>
                                <CustomText style={{ textAlign: 'center', fontSize: 26 }}>
                                    {this.state.errorMessage}
                                </CustomText>

                                <Button style={{ borderRadius: 6 }} transparent block onPress={() =>
                                    this.setState({ errorModal: false })
                                } >
                                    <CustomText uppercase={false} style={{ color: '#1688ca', textDecorationLine: 'underline', fontSize: 16 }} >Update Password</CustomText>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                    :
                    false}

               
                <Content>

                    <List >
                        <ListItem itemDivider style={{ paddingLeft: 25, paddingRight: 25, paddingTop: 18, paddingBottom: 18, borderColor: '#c9c9c9', borderBottomWidth: 1, backgroundColor: '#e2e6eb' }} >
                            <CustomText style={{ fontSize: 16 }} >Contact Information</CustomText>
                        </ListItem>
                        <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, }}>
                            <Col size={5} style={{ justifyContent: 'center' }}>
                                <CustomText>Current Password</CustomText>
                            </Col>
                            <Col size={5}>
                                <Item>
                                    <Input
                                        secureTextEntry={!this.state.hideCurrentPassword}
                                        onChangeText={(text) => {

                                            this.setState({
                                                ...this.state,
                                                userDetails: {
                                                    ...this.state.userDetails,
                                                    currentPassword: text
                                                }
                                            })
                                        }}
                                        value={this.state.userDetails.currentPassword}
                                        blurOnSubmit={true}
                                    />
                                    <Icon name='eye' onPress={() => {
                                        //TOGGLE EYE COLOR
                                        if (this.state.hideCurrentPassword == true) {
                                            this.setState({ eyeColorCurrent: 'black' })
                                        } else {
                                            this.setState({ eyeColorCurrent: 'lightgray' })
                                        }
                                        this.setState({ hideCurrentPassword: !(this.state.hideCurrentPassword) })
                                    }}
                                        style={{ color: this.state.eyeColorCurrent, }} />
                                </Item>
                            </Col>
                        </Row>
                        <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1 }}>
                            <Col size={5} style={{ justifyContent: 'center' }}>
                                <CustomText>New Password</CustomText>
                            </Col>
                            <Col size={5}>
                                <Item>
                                    <Input
                                        // placeholder={'Password'}
                                        // placeholderTextColor='lightgray'
                                        onBlur={e => {
                                            if (this.state.userDetails.password.length < 8) {
                                                this.setState({
                                                    ...this.state,
                                                    userDetails: {
                                                        ...this.state.userDetails,
                                                        errorPassword: `Your password must be between 8 – 15 characters long`
                                                    }
                                                })



                                            }
                                            else {
                                                this.setState({
                                                    ...this.state,
                                                    userDetails: {
                                                        ...this.state.userDetails,
                                                        errorPassword: ''
                                                    }
                                                })
                                            }
                                        }}
                                        secureTextEntry={!this.state.hidePassword}
                                        onChangeText={(text) => {

                                            this.setState({
                                                ...this.state,
                                                userDetails: {
                                                    ...this.state.userDetails,
                                                    password: text
                                                }
                                            })
                                        }}
                                        value={this.state.userDetails.password}
                                        blurOnSubmit={true}
                                    />
                                    <Icon name='eye' onPress={() => {
                                        //TOGGLE EYE COLOR
                                        if (this.state.hidePassword == true) {
                                            this.setState({ eyeColor: 'black' })
                                        } else {
                                            this.setState({ eyeColor: 'lightgray' })
                                        }
                                        this.setState({ hidePassword: !(this.state.hidePassword) })
                                    }}
                                        style={{ color: this.state.eyeColor, }} />

                                </Item>

                            </Col>
                        </Row>
                        <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1 }}>
                            <Col size={5} style={{ justifyContent: 'center' }}>
                                <CustomText>Confirm Password</CustomText>
                            </Col>
                            <Col size={5}>
                                <Item >
                                    <Input
                                        // placeholder={'Password'}
                                        // placeholderTextColor='lightgray'
                                        onBlur={e => {
                                            console.log('Match', this.state.userDetails.password !== this.state.userDetails.passwordConfirm)
                                            if (this.state.userDetails.password !== this.state.userDetails.passwordConfirm) {
                                                this.setState({
                                                    ...this.state,
                                                    userDetails: {
                                                        ...this.state.userDetails,
                                                        errorPasswordConfirm: "The password and confirmation password did not match."
                                                    }
                                                })



                                            }
                                            else {
                                                this.setState({
                                                    ...this.state,
                                                    userDetails: {
                                                        ...this.state.userDetails,
                                                        errorPasswordConfirm: ''
                                                    }
                                                })
                                            }
                                        }}
                                        secureTextEntry={!this.state.hidePasswordConfirm}
                                        value={this.state.userDetails.passwordConfirm}
                                        onChangeText={(text) => {

                                            this.setState({
                                                ...this.state,
                                                userDetails: {
                                                    ...this.state.userDetails,
                                                    passwordConfirm: text
                                                }
                                            })


                                        }}
                                        blurOnSubmit={true}
                                    />
                                    <Icon name='eye' onPress={() => {
                                        //TOGGLE EYE COLOR
                                        if (this.state.hidePasswordConfirm == true) {
                                            this.setState({ eyeColorCormfirmPassword: 'black' })
                                        } else {
                                            this.setState({ eyeColorCormfirmPassword: 'lightgray' })
                                        }
                                        this.setState({ hidePasswordConfirm: !(this.state.hidePasswordConfirm) })
                                    }}
                                        style={{ color: this.state.eyeColorCormfirmPassword, }} />

                                </Item>
                            </Col>
                        </Row>

                    </List>

                    <View style={{ paddingHorizontal: 25 }}>
                        {_.isEmpty(this.state.userDetails.errorPassword) ?
                            null :
                            <CustomText style={{ paddingVertical: 5, color: colors.RED }}>*PASSWORD - {this.state.userDetails.errorPassword}</CustomText>

                        }
                        {_.isEmpty(this.state.userDetails.errorPasswordConfirm) ?
                            null :
                            <CustomText style={{ paddingVertical: 5, color: colors.RED }}>*CONFIRM PASSWORD - {this.state.userDetails.errorPasswordConfirm}</CustomText>
                        }
                    </View>

                    <View style={{ paddingTop: 30, paddingHorizontal: 30 }}>

                        <Button style={{ borderRadius: 6 }} block success
                            disabled={!_.isEmpty(this.state.userDetails.errorPassword) || !_.isEmpty(this.state.userDetails.errorPasswordConfirm) || this.state.isLoadingData}
                            onPress={() => {
                                // NavigationService.navigate('SuccessScreen')
                              
                                Keyboard.dismiss()

                                this.submitPassword()
                                this.setState({
                                    ...this.state,
                                    userDetails: {
                                        ...this.state.userDetails,
                                        errorPassword: '',
                                        errorPasswordConfirm: '',

                                    }
                                }, )


                            }

                            } >

                            <Text uppercase={false} > {this.state.isLoadingData ? `Verifying` : `Submit`}</Text>
                        </Button>
                    </View>
                    <View style={{ paddingVertical: 15, paddingHorizontal: 30 }} >
                        <Button style={{ borderRadius: 6 }} transparent block onPress={() =>
                            this.props.navigation.goBack
                        } >
                            <Text uppercase={false} style={{ color: colors.GRAYISHRED, textDecorationLine: 'underline' }} >Cancel</Text>
                        </Button>
                    </View>



                </Content>

            </Container>
        );

    }

}
const mapStateToProps = (state) => ({
    dashboard: state.dashboard,
    userName: state.userState.userName,
    userPersonId: state.userState.userPersonId,

});

const mapDispatchToProps = (dispatch) => ({

})
export default connect(mapStateToProps, {
    updateUserPassword,
})(ChangePassword);

