import React, { Component, Fragment } from 'react';
import { Container, Right, Content, List, ListItem, Separator, Text, View, Button, Icon, Item, Picker, Toast, Spinner, Header, Title, Left, Body } from 'native-base';
import { TextInput, Keyboard, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux';
import { colors, pRatioToFontSize } from '../../utils/constants';
import _ from 'lodash';
import CustomText from '../../components/CustomText';
import CustomTextBold from '../../components/CustomTextBold';
import OfflineNotice from '../../components/OfflineNotice';
import CustomHeader from '../../components/MultiCustomHeader'
import { Grid, Row, Col } from 'react-native-easy-grid';
import axios from 'react-native-axios';
import { PAYGWA_URL, DASHBOARD_URL, PAYNOW_URL } from 'react-native-dotenv';
import { fetchOldUserDetails, getSequQuestions, getCountry, updateUserDetails, updateUserPassword } from '../../actions/userMyAccounts'

class EditAccountProfile extends Component {

    constructor(props) {
        super(props);
        // local state
        this.state = {
            pixelDensity: 0,
            errorEmailFormat: '',
            saveDetails: {},
            userAccDetails: {
                fullName: '',
                addressLine1: '',
                city: '',
                state: '',
                postal: '',
                country: '',
                home: '',
                mobile: '',
                work: '',
                emailAddress: '',
            },
            isLoading: false,
            isInvalidPhones: {
                homePhone: false,
                mobilePhone: false,
                workPhone: false
            },
            isDeletePhones: {
                homePhone: false,
                mobilePhone: false,
                workPhone: false
            },
        }
    }

    componentWillMount() {
        this.setState({
            isLoading: true
        })


        this.props.getSequQuestions()
            .then(() => {
                this.props.getCountry().then(() => {
                    this.props.fetchOldUserDetails(this.props.userPersonId)
                        .then(() => {
                            console.log('userAccountDetails', this.props.dashboard.userAccountDetails)
                            this.setState({
                                ...this.state,
                                isLoading: false,
                                isAdressEditable: (this.props.dashboard.userOldDataDetails.billAddressSource !== "PER") ? false : true,
                                userAccDetails: {
                                    ...this.state.userAccDetails,
                                    personId: this.props.userPersonId,
                                    accountId: this.props.accountId[0][0],
                                    username: this.props.userName,
                                    fullName: this.props.navigation.state.params.fullName || '',
                                    emailAddress: this.props.navigation.state.params.emailAddress || '',
                                    address1: this.props.navigation.state.params.addressLine1 || '',
                                    address2: this.props.navigation.state.params.addressLine2 || '',
                                    city: this.props.navigation.state.params.city || '',
                                    postal: this.props.navigation.state.params.postal || '',
                                    stateInitials: this.props.navigation.state.params.stateInitials || '',
                                    stateDesc: this.props.navigation.state.params.state || '',
                                    country: this.props.navigation.state.params.country || '',
                                    home: this.props.navigation.state.params.homePhone,
                                    mobile: this.props.navigation.state.params.mobilePhone,
                                    work: this.props.navigation.state.params.workPhone,
                                    oldDateEmail: this.props.dashboard.userOldDataDetails.oldDateEmailAdd || '',
                                    oldDateQuestion: this.props.dashboard.userOldDataDetails.oldDateSecuQuestion || '',
                                    oldDateAnswer: this.props.dashboard.userOldDataDetails.oldDateAnswer || '',
                                    characteristicValue: this.props.dashboard.userOldDataDetails.oldCharValueSecuQues || this.props.dashboard.securityQuestions[0].characteristicValue,
                                    answer: this.props.dashboard.userOldDataDetails.oldAnswerSecuQues || ''
                                }
                            })
                        })
                })
            })

    }

    onValueChange2(value: string) {
        this.setState({
            selectedQuestion: value
        });
        console.log('selectedQuestion', selectedQuestion)
    }


    getOldData() {
        axios
            .post(DASHBOARD_URL + '/api/v1/user-details-edit-account',
                {
                    personID: this.props.userPersonId,
                    division: 'GWA'
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                })
            .then(response => {
                const oldData = response.data.result.otherDetails
                var userOldDetails = {}
                // userOldDetails.billAddressSource    = response.data.result.details.billAddressSource
                for (var count = 0; count < oldData.length; count++) {
                    if (oldData[count].CharacteristicType === "CMSCAN") {
                        userOldDetails.oldDateAnswer = oldData[count].EffectiveDate
                        userOldDetails.oldAnswerSecuQues = oldData[count].AdhocCharacteristicValue
                    }
                    else if (oldData[count].CharacteristicType === "CMSCQUES") {
                        userOldDetails.oldDateSecuQuestion = oldData[count].EffectiveDate
                        userOldDetails.oldCharValueSecuQues = oldData[count].CharacteristicValue
                    }
                    else if (oldData[count].CharacteristicType === "CMOLDEML") {
                        userOldDetails.oldDateEmailAdd = oldData[count].EffectiveDate
                    }
                }
                console.log('userOldDetails', userOldDetails)
            }
            )
            .catch(error => {
                console.log('getOldData', error)

            })
    }

    onSave() {
        // check the contact Types
        if (_.isEmpty(this.state.userAccDetails.home) && _.isEmpty(this.state.userAccDetails.mobile) && _.isEmpty(this.state.userAccDetails.work)) {
            alert('Please fill at least 1 contact number!')
        } else if (this.state.isInvalidPhones.mobilePhone || this.state.isInvalidPhones.workPhone || this.state.isInvalidPhones.homePhone) {
            alert('Please enter a valid Phone Numbers.')
        } else {
            // check if required field
            if (!_.isEmpty(this.state.errorEmailFormat)) {
                alert('Please check your email address')
            }
            else if (_.isEmpty(this.state.userAccDetails.emailAddress) || _.isEmpty(this.state.userAccDetails.answer)) {
                alert('Please check your email address and security answer.')
            } else {
                this.setState({
                    ...this.state,
                    isProcessing: true,
                })
                const postData = {
                    personId: this.state.userAccDetails.personId,
                    accountId: this.state.userAccDetails.accountId,
                    emailAddress: this.state.userAccDetails.emailAddress,
                    address1: this.state.userAccDetails.address1,
                    address2: this.state.userAccDetails.address2,
                    city: this.state.userAccDetails.city,
                    postal: this.state.userAccDetails.postal,
                    stateInitials: this.state.userAccDetails.stateInitials,
                    stateDesc: this.state.userAccDetails.stateDesc,
                    country: this.state.userAccDetails.country,
                    home: (this.state.userAccDetails.home === this.props.dashboard.userAccountDetails.homePhone) ? '' : this.state.userAccDetails.home,
                    mobile: (this.state.userAccDetails.mobile === this.props.dashboard.userAccountDetails.mobilePhone) ? '' : this.state.userAccDetails.mobile,
                    work: (this.state.userAccDetails.work === this.props.dashboard.userAccountDetails.workPhone) ? '' : this.state.userAccDetails.work,
                    isDeletedHome: (this.props.dashboard.userAccountDetails.homePhone === undefined || this.props.dashboard.userAccountDetails.homePhone === "" || this.props.dashboard.userAccountDetails.homePhone === null) ? false : this.state.isDeletePhones.homePhone,
                    isDeletedMobile: (this.props.dashboard.userAccountDetails.mobilePhone === undefined || this.props.dashboard.userAccountDetails.mobilePhone === "" || this.props.dashboard.userAccountDetails.mobilePhone === null) ? false : this.state.isDeletePhones.mobilePhone,
                    isDeletedWork: (this.props.dashboard.userAccountDetails.workPhone === undefined || this.props.dashboard.userAccountDetails.workPhone === "" || this.props.dashboard.userAccountDetails.workPhone === null) ? false : this.state.isDeletePhones.workPhone,
                    homeSeq: (this.state.userAccDetails.home === this.props.dashboard.userAccountDetails.homePhone) ? '' : this.props.dashboard.userAccountDetails.homePhoneSeq,
                    mobileSeq: (this.state.userAccDetails.mobile === this.props.dashboard.userAccountDetails.mobilePhone) ? '' : this.props.dashboard.userAccountDetails.mobilePhoneSeq,
                    workSeq: (this.state.userAccDetails.work === this.props.dashboard.userAccountDetails.workPhone) ? '' : this.props.dashboard.userAccountDetails.workPhoneSeq,
                    oldDateEmail: this.state.userAccDetails.oldDateEmail,
                    oldDateQuestion: this.state.userAccDetails.oldDateQuestion,
                    oldDateAnswer: this.state.userAccDetails.oldDateAnswer,
                    characteristicValue: this.state.userAccDetails.characteristicValue,
                    answer: this.state.userAccDetails.answer
                }
                console.log('postData', postData)
                this.props.updateUserDetails(postData)
                    .then((response) => {
                        debugger
                        this.setState({
                            ...this.state,
                            isProcessing: false
                        })
                        if (response.result.status === "True") {
                            Toast.show({
                                text: response.result.description,
                                duration: 3000,
                                type: 'success'
                            })

                            this.setState({
                                ...this.state,
                                isProcessing: false,
                                saveDetails: {
                                    ...this.state.saveDetails,
                                    fullName: this.state.userAccDetails.fullName,
                                    emailAddress: this.state.userAccDetails.emailAddress,
                                    home: this.state.userAccDetails.home,
                                    mobile: this.state.userAccDetails.mobile,
                                    work: this.state.userAccDetails.work
                                }
                            })

                            // this.props.navigation.pop(2)

                        }
                        else {
                            Toast.show({
                                text: response.result.description,
                                duration: 3000,
                                type: 'success'
                            })
                            this.setState({
                                ...this.state,
                                isProcessing: false
                            })
                        }
                    })
                    .catch((error) => {
                        Toast.show({
                            text: 'Server error! Please try again later!',
                            duration: 3000,
                            type: 'danger'
                        })
                        this.setState({
                            ...this.state,
                            isProcessing: false
                        })
                    })
            }

        }
    }


    onChangeEditAcc(name, value) {
        if (name === "mobile" || name === "work" || name === "home") {
            var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            this.setState({
                ...this.state,
                userAccDetails: {
                    ...this.state.userAccDetails,
                    [name]: value
                }
            })
            if (value == "") {
                this.setState({
                    isDeletePhones: {
                        ...this.state.isDeletePhones,
                        [name + "Phone"]: true
                    },
                    isInvalidPhones: {
                        ...this.state.isInvalidPhones,
                        [name + "Phone"]: false
                    }
                })
            }
            else if (!(value).match(phoneno)) {
                this.setState({
                    isInvalidPhones: {
                        ...this.state.isInvalidPhones,
                        [name + "Phone"]: true
                    }
                })
            }
            else {
                this.setState({
                    isDeletePhones: {
                        ...this.state.isDeletePhones,
                        [name + "Phone"]: false
                    },
                    isInvalidPhones: {
                        ...this.state.isInvalidPhones,
                        [name + "Phone"]: false
                    }
                })
            }
        }
    }


    // componentWillUnmount() {
    //     this.props.navigation.state.params.getApiData()
    //   }

    render() {

        return (
            <Container >
                <Header style={{
                    backgroundColor: colors.PRIMARY_COLOR,
                }}
                >
                    <Left style={{ flex: 1 }}>

                        <Button style={{ paddingLeft: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, elevation: 0 }}
                            onPress={() => {
                                // this.props.navigation.goBack()
                                // const userAccountDetails = this.state.userAccDetails
                                // this.props.navigation.state.params.updateData(userAccountDetails)


                                const { navigation } = this.props;
                                const userAccountDetails = this.state.saveDetails
                                console.log('userAccountDetails', userAccountDetails)
                                if (_.isEmpty(userAccountDetails)) {
                                    navigation.goBack();
                                } else {
                                    navigation.goBack();
                                    navigation.state.params.updateData(userAccountDetails);
                                }


                            }
                            }>
                            <Icon
                                style={{ color: colors.WHITE, fontSize: 24 }}
                                name={'chevron-left'} type='FontAwesome'
                            />
                        </Button>
                    </Left>
                    <Body style={{ flex: 3, alignItems: 'center' }}>
                        <Title style={{ color: colors.WHITE, fontSize: 18 }}>Edit Profile</Title>
                    </Body>
                    <Right style={{ paddingRight: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, flex: 1 }}>

                        <Button
                            disabled={this.state.isLoading || this.state.isProcessing}
                            transparent style={{ paddingLeft: 0, elevation: 0 }}
                            onPress={() => {
                                Keyboard.dismiss()
                                this.onSave()
                            }} >

                            <Icon style={{ backgroundColor: colors.PRIMARY_COLOR, color: colors.WHITE, fontSize: 18 }} >
                                {this.state.isProcessing ?
                                    <CustomText style={{ color: colors.WHITE, fontSize: 18 }}>Loading ...</CustomText>
                                    :
                                    <CustomText style={{ color: colors.WHITE, fontSize: 18 }}>Save</CustomText>
                                }


                            </Icon>

                        </Button>
                    </Right>
                </Header>
                <OfflineNotice />


                {this.state.isLoading ?
                    < View style={{
                        alignItems: 'center', justifyContent: 'center', flex: 1
                    }}>
                        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />

                    </View>
                    :
                    <Content>

                        <List >
                            <ListItem itemDivider style={{ paddingLeft: 25, paddingRight: 25, paddingTop: 18, paddingBottom: 18, borderColor: '#c9c9c9', borderBottomWidth: 1, backgroundColor: '#e2e6eb' }} >
                                <CustomText style={{ fontSize: 16 }} >Personal Information</CustomText>
                            </ListItem>
                            <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                                <Col size={5}>
                                    <CustomText>Customer Name</CustomText>
                                </Col>
                                <Col size={5}>
                                    <CustomTextBold style={{ color: '#919192' }} >{_.get(this.state.userAccDetails, 'fullName', 'N/A')}</CustomTextBold>
                                </Col>
                            </Row>
                            <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                                <Col size={5}>
                                    <CustomText>Customer Name</CustomText>
                                </Col>
                                <Col size={5}>
                                    <CustomTextBold style={{ color: '#919192' }} >{this.props.userName}</CustomTextBold>
                                </Col>
                            </Row>
                            <ListItem itemDivider style={{ paddingLeft: 25, paddingRight: 25, paddingTop: 18, paddingBottom: 18, borderColor: '#c9c9c9', borderBottomWidth: 1, backgroundColor: '#e2e6eb' }} >
                                <CustomText style={{ fontSize: 16 }} >Contact Information</CustomText>
                            </ListItem>
                            <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                                <Col size={5}>
                                    <CustomText>Home Number</CustomText>
                                </Col>
                                <Col size={5}>

                                    <TextInput
                                        keyboardType='phone-pad'
                                        onChangeText={text => {
                                            // this.setState({
                                            //     ...this.state,
                                            //     userAccDetails: {
                                            //         ...this.state.userAccDetails,
                                            //         home: text,
                                            //     }
                                            // })
                                            this.onChangeEditAcc('home', text)
                                        }

                                        }
                                        value={this.state.userAccDetails.home}
                                    />
                                    {this.state.isInvalidPhones.homePhone ?
                                        <CustomText style={{ paddingVertical: 5, color: colors.RED }}>Please enter a valid Home Phone.</CustomText>
                                        :
                                        null
                                    }

                                </Col>
                            </Row>
                            <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                                <Col size={5}>
                                    <CustomText>Mobile Number</CustomText>
                                </Col>
                                <Col size={5}>
                                    <TextInput
                                        keyboardType='phone-pad'
                                        onChangeText={text => {
                                            this.onChangeEditAcc('mobile', text)
                                            // this.setState({
                                            //     ...this.state,
                                            //     userAccDetails: {
                                            //         ...this.state.userAccDetails,
                                            //         mobile: text,
                                            //     }
                                            // }) 
                                        }}
                                        value={this.state.userAccDetails.mobile}
                                    />
                                    {this.state.isInvalidPhones.mobilePhone ?
                                        <CustomText style={{ paddingVertical: 5, color: colors.RED }}>Please enter a valid Mobile Phone.</CustomText>
                                        :
                                        null
                                    }
                                </Col>
                            </Row>
                            <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                                <Col size={5}>
                                    <CustomText>Work Number</CustomText>
                                </Col>
                                <Col size={5}>
                                    <TextInput
                                        keyboardType='phone-pad'
                                        onChangeText={text => {
                                            this.onChangeEditAcc('work', text)
                                            // this.setState({
                                            //     ...this.state,
                                            //     userAccDetails: {
                                            //         ...this.state.userAccDetails,
                                            //         work: text,
                                            //     }
                                            // })
                                        }}
                                        value={this.state.userAccDetails.work}
                                    />
                                    {this.state.isInvalidPhones.workPhone ?
                                        <CustomText style={{ paddingVertical: 5, color: colors.RED }}>Please enter a valid Work Phone.</CustomText>
                                        :
                                        null
                                    }
                                </Col>
                            </Row>
                            <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                                <Col size={5}>
                                    <CustomText>Email Address</CustomText>
                                </Col>
                                <Col size={5}>
                                    <TextInput
                                        onBlur={e => {
                                            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

                                            if (reg.test(this.state.userAccDetails.emailAddress) === false) {
                                                console.log("Please enter a valid Email Address.");
                                                this.setState({
                                                    errorEmailFormat: `Please enter a valid Email Address.`
                                                })
                                                return false;
                                            } else {
                                                this.setState({
                                                    errorEmailFormat: ``
                                                })
                                            }
                                        }}
                                        keyboardType='email-address'
                                        onChangeText={text => {
                                            this.setState({
                                                ...this.state,
                                                userAccDetails: {
                                                    ...this.state.userAccDetails,
                                                    emailAddress: text,
                                                }
                                            })
                                        }}
                                        value={this.state.userAccDetails.emailAddress}
                                    />
                                    {_.isEmpty(this.state.errorEmailFormat) ?
                                        null :
                                        <CustomText style={{ paddingVertical: 5, color: colors.RED }}>{this.state.errorEmailFormat}</CustomText>
                                    }
                                </Col>
                            </Row>
                            <ListItem itemDivider style={{ paddingLeft: 25, paddingRight: 25, paddingTop: 18, paddingBottom: 18, borderColor: '#c9c9c9', borderBottomWidth: 1, backgroundColor: '#e2e6eb' }} >
                                <CustomText style={{ fontSize: 16 }} >Security Question</CustomText>
                            </ListItem>
                            <Item regular
                                style={{
                                    flex: 1,
                                    width: null,
                                    marginLeft: 0,
                                    backgroundColor: colors.WHITE,
                                    marginBottom: 5,
                                    borderWidth: 1,
                                    paddingHorizontal: 17, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13
                                }}>

                                <Picker
                                    mode="dropdown"
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.userAccDetails.characteristicValue}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({
                                            ...this.state,
                                            userAccDetails: {
                                                ...this.state.userAccDetails,
                                                characteristicValue: itemValue,
                                            }
                                        })

                                    }}
                                >
                                    {_.map(this.props.dashboard.securityQuestions, (securityQuestions, index) => {
                                        return (
                                            <Picker.Item style={{ color: "#bfc6ea" }} label={securityQuestions.description} value={securityQuestions.characteristicValue} />
                                        )
                                    })
                                    }
                                </Picker>

                            </Item>
                            <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                                <Col >
                                    <TextInput
                                        keyboardType='email-address'
                                        onChangeText={text => {
                                            this.setState({
                                                ...this.state,
                                                userAccDetails: {
                                                    ...this.state.userAccDetails,
                                                    answer: text,
                                                }
                                            })
                                        }}
                                        value={this.state.userAccDetails.answer}
                                    />
                                </Col>
                            </Row>
                        </List>
                        <View style={{ paddingVertical: 35, paddingHorizontal: 80 }} >
                            <Button style={{ borderRadius: 6 }} success block onPress={() =>
                                this.props.navigation.navigate('ChangePassword')
                            } >
                                <CustomText uppercase={false} style={{ color: colors.WHITE, fontSize: 16 }}  >Change Password</CustomText>
                            </Button>
                        </View>
                    </Content>
                }

            </Container >
        );

    }

}
const mapStateToProps = (state) => ({
    dashboard: state.dashboard,
    userName: state.userState.userName,
    userPersonId: state.userState.userPersonId,
    accountId: state.userState.accountId
});

const mapDispatchToProps = (dispatch) => ({

})
export default connect(mapStateToProps, {
    fetchOldUserDetails,
    getSequQuestions,
    getCountry,
    updateUserDetails,
    updateUserPassword,
})(EditAccountProfile);

