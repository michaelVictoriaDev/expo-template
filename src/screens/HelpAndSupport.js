import React, { Component } from 'react';
import { Container, Right, Content, Item, ListItem, Separator, Text, Left, Body, View, Button, Icon, Form, Picker, Footer, FooterTab, Input, Toast } from 'native-base';
import { KeyboardAvoidingView, TextInput, ActivityIndicator, Keyboard } from 'react-native'
import { connect } from 'react-redux';
import { colors, pRatioToFontSize } from '../utils/constants';
import _ from 'lodash';
import CustomText from '../components/CustomText';
import CustomTextBold from '../components/CustomTextBold';
import OfflineNotice from '../components/OfflineNotice';
import CustomHeader from '../components/MultiCustomHeader'
import { Grid, Row, Col } from 'react-native-easy-grid';
import { PAYGWA_URL, DASHBOARD_URL, PAYNOW_URL } from 'react-native-dotenv';
import axios from 'react-native-axios'

class HelpAndSupport extends Component {

    constructor(props) {
        super(props);
        // local state
        this.state = {
            pixelDensity: 0,
            contactType: [{
                label: 'Technical Query',
                value: 'TECHNICAL'
            }, {
                label: 'Comment or Complaint',
                value: 'COMPLAINT'
            }],
            selected: 'TECHNICAL',
            message: '',
            emailAdd: this.props.dashboard.userAccountDetails.emailAddress,
            customerName: this.props.dashboard.userAccountDetails.fullName


        }
    }

    componentDidMount() {
        console.log('test', this.props.userPersonId)
    }

    componentWillUnmount() {

    }

    submit() {
        if (_.isEmpty(this.state.message)) {
            alert('Please fill out the message field.')
        } else {
            this.setState({
                ...this.state,
                isLoading: true
            })
            const postData = {
                accountId: this.props.dashboard.selectedAccountId,
                emailAddress: this.state.emailAdd,
                // fullName:     this.state.fname + ' ' + this.state.lname,
                fullName: this.state.customerName,
                contactType: this.state.selected,
                message: this.state.message,
            }
            this.submitHelpAndSupport(postData)
        }

    }


    submitHelpAndSupport(postData) {
        axios
            .post(
                DASHBOARD_URL + '/api/v1/help-and-support',
                {
                    cis_division: 'GWA',
                    accountId: postData.accountId,
                    personId: this.props.userPersonId,
                    emailAddress: postData.emailAddress,
                    fullName: postData.fullName,
                    contactType: postData.contactType,
                    message: postData.message,
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            .then(response => {
                if (response.data.result.status === 'Success') {
                    this.setState({
                        ...this.state,
                        isLoading: false,
                        message: ''
                    })
                    Toast.show({
                        text: "Your ticket has been submitted successfully!",
                        duration: 3000,
                        type: "success"
                    })
                } else {
                    this.setState({
                        ...this.state,
                        isLoading: false
                    })
                    Toast.show({
                        text: "An error occurred. Please try again!",
                        duration: 3000,
                        type: "warning"
                    })
                }


            })
            .catch(error => {
                console.log(error)
                this.setState({
                    ...this.state,
                    isLoading: false
                })
                Toast.show({
                    text: "Server Error",
                    duration: 3000,
                    type: "danger"
                })

            })
    }
    onContentSizeChange = (event) => {
        const { minHeight, maxHeight } = this.props;
        // Adding 30 to provide extra padding.
        let inputHeight = Math.max(minHeight, event.nativeEvent.contentSize.height + 30);
        if (inputHeight > maxHeight) {
            inputHeight = maxHeight;
        }
        if (this.state.height !== inputHeight) {
            this.setState({
                height: inputHeight,
            });
        }
    }



    onValueChange(value: string) {
        this.setState({
            selected: value
        });
    }

    render() {
        return (
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={this.props.navigation.goBack}
                    title="Help and Support"
                    RightIcon={<Right style={{ paddingRight: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, flex: 1 }} />
                    }
                />
                <OfflineNotice />
                <Content>
                    <KeyboardAvoidingView
                        behavior="padding"
                    >
                        <View style={{ paddingHorizontal: 25, paddingVertical: 25 }}>

                            <CustomTextBold style={{ fontSize: 18, paddingBottom: 14 }}>Customer Feedback</CustomTextBold>

                            <CustomText style={{ paddingVertical: 5 }}>Customer Name</CustomText>
                            <Item regular
                                style={{
                                    borderStyle: 'solid',
                                    marginLeft: 0,
                                    backgroundColor: colors.WHITE,
                                    borderRadius: 6,
                                    borderColor: 'lightgray',
                                    marginBottom: 5,
                                    borderWidth: 1,
                                    backgroundColor: '#e6ebf4'
                                }}>
                                <Input
                                    disabled
                                    onChangeText={(input) => {
                                        this.setState({
                                            customerName: input
                                        })
                                    }}
                                    value={this.state.customerName}
                                    blurOnSubmit={true}
                                />

                            </Item>
                            <CustomText style={{ paddingVertical: 5 }}>Email Address</CustomText>
                            <Item regular
                                style={{
                                    borderStyle: 'solid',
                                    marginLeft: 0,
                                    backgroundColor: colors.WHITE,
                                    borderRadius: 6,
                                    borderColor: 'lightgray',
                                    marginBottom: 5,
                                    borderWidth: 1,
                                    backgroundColor: '#e6ebf4'
                                }}>
                                <Input
                                    disabled
                                    onChangeText={(input) => {
                                        this.setState({
                                            emailAdd: input
                                        })
                                    }}
                                    value={this.state.emailAdd}
                                    blurOnSubmit={true}
                                />
                            </Item>
                            <CustomText style={{ paddingVertical: 5 }}>Contact Type</CustomText>
                            <Form style={{ paddingBottom: 14 }} full>
                                <Item picker style={{
                                    borderColor: "#c9c9c9",
                                    borderBottomWidth: 1,
                                    borderTopWidth: 1,
                                    borderLeftWidth: 1,
                                    borderRightWidth: 1,
                                    borderRadius: 5

                                }}>
                                    <Picker
                                        style={{ width: undefined }}
                                        mode="dropdown"
                                        placeholder="                                                                       "
                                        // iosIcon={<Icon name="arrow-down" />}
                                        selectedValue={this.state.selected}
                                        onValueChange={this.onValueChange.bind(this)}
                                    >
                                        {_.map(this.state.contactType, (data, index) => {
                                            return (
                                                <Picker.Item label={data.label} value={data.value} />
                                            )
                                        })
                                        }

                                    </Picker>
                                </Item>

                            </Form>

                            <CustomText style={{ paddingVertical: 5 }}>Message</CustomText>
                            <Form style={{ paddingBottom: 14 }} full>
                                <Item picker style={{
                                    borderColor: "#c9c9c9",
                                    borderBottomWidth: 1,
                                    borderTopWidth: 1,
                                    borderLeftWidth: 1,
                                    borderRightWidth: 1,
                                    borderRadius: 5,
                                }}>


                                    <TextInput
                                        style={{
                                            width: '100%',
                                            padding: 10,
                                            minHeight: 100,
                                        }}
                                        multiline={true}
                                        numberOfLines={4}


                                        underlineColorAndroid='transparent'

                                        onContentSizeChange={this.onContentSizeChange}
                                        onChangeText={text => this.setState({ message: text })}
                                        value={this.state.message}
                                    />
                                </Item>
                            </Form>
                        </View>
                    </KeyboardAvoidingView>
                </Content>
                <Footer>
                    <FooterTab style={{ backgroundColor: colors.LIGHT_GREEN }}>
                        <Button full
                            disabled={this.state.isLoading}
                            onPress={() => {
                                Keyboard.dismiss()
                                this.submit()
                            }
                            }
                        >
                            {this.state.isLoading ?
                                <ActivityIndicator color={colors.PRIMARY_COLOR} /> :
                                <CustomText style={{ color: colors.WHITE, fontSize: 16 }}>Submit </CustomText>
                            }

                        </Button>
                    </FooterTab>
                </Footer>
            </Container>

        );

    }

}
const mapStateToProps = (state) => ({
    users: state.users,
    dashboard: state.dashboard,
    userPersonId: state.userState.userPersonId,
});

const mapDispatchToProps = (dispatch) => ({

})
export default connect(mapStateToProps)(HelpAndSupport);

