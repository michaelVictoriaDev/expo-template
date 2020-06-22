import React, { Component } from 'react';
import { StyleSheet, PixelRatio, Image, Keyboard, Dimensions, Linking, ImageBackground, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { View, Input, Item, Button, Toast, Tab, Tabs, Header, Container, Content } from 'native-base';
import { colors, pRatioToFontSize } from '../../utils/constants';
import { fetchLogin } from '../../actions';
import _, { times } from 'lodash';
import * as AppAuth from 'expo-app-auth';
import CustomText from '../../components/CustomText';
import CustomTextBold from '../../components/CustomTextBold';
import Offline from '../../components/OfflineNotice';
import * as Font from 'expo-font';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'react-native-axios'
import { PAYGWA_URL, DASHBOARD_URL, PAYNOW_URL } from 'react-native-dotenv';


class Login extends Component {

    constructor(props) {
        super(props);
        // local state
        this.state = {
            pixelDensity: 0,
            isOnFocusInput: false,
            hidePassword: true,
            eyeColor: 'lightgray',
            emailAdd: '',
            password: '',
            isOnFocusInputGPA: false,
            hidePasswordGPA: true,
            eyeColorGPA: 'lightgray',
            emailAddGPA: '',
            passwordGPA: '',
            currentTab: 0,
            isModalVisibleUsernameGWA: false,
            isModalVisiblePasswordGWA: false,
            isModalVisibleUsernameGPA: false,
            isModalVisiblePasswordGPA: false,
            // Question
            isModalVisibleQuestionUsernameGWA: false,
            isModalVisibleQuestionPasswordGWA: false,
            // loading modal on submit
            loadingForgotYourUsernameGWA: false,
            loadingForgotYourPasswordGWA: false,


        }
        this.focusNextField = this.focusNextField.bind(this)
        this.componentId = {} //STORE DOM OF TEXT FIELDS (EMAIL AND PASSWORD)
        this.focusNextFieldGPA = this.focusNextFieldGPA.bind(this)
        this.componentIdGPA = {} //STORE DOM OF TEXT FIELDS (EMAIL AND PASSWORD)
    }

    // GLOBAL FUNCTION
    grep(items, callback) {
        // grep
        // https://gabrieleromanato.name/javascript-implementing-the-grep-function#:~:text=The%20grep()%20utility%20is,that%20satisfy%20a%20certain%20condition.

        var filtered = [],
            len = items.length,
            i = 0;
        for (i; i < len; i++) {
            var item = items[i];
            var cond = callback(item);
            if (cond) {
                filtered.push(item);
            }
        }

        return filtered;

    }
    // FORGOT USERNAME GWA
    forgotYourUsernameGWA(accountId, emailAddress) {
        this.setState({
            loadingForgotYourUsernameGWA: true
        })
        axios.post(PAYGWA_URL + '/api/v1/forgot-username',
            {
                accountId: accountId,
                emailAddress: emailAddress,
                division: 'GWA',
            },
            {
                headers: { 'Content-Type': 'application/json' }
            })
            .then((response) => {
                console.log(response.data.result);

                const result = response.data.result.status
                if (result === 'Success') {
                    console.log(response.data.result.description[0].PersonID)
                    const questions = []
                    const answer = []
                    this.grep(response.data.result.description, (e) => {
                        if (e.CharacteristicType == "CMSCQUES") {
                            questions.push(e);
                        }

                    })

                    this.grep(response.data.result.description, (e) => {
                        if (e.CharacteristicType == "CMSCAN") {
                            answer.push(e);
                        }

                    })

                    console.log(questions[0].CharValueDescription)
                    console.log(answer[0].AdhocCharacteristicValue)
                    this.setState({
                        loadingForgotYourUsernameGWA: false,
                        securityQuestionUsernameGWA: questions[0].CharValueDescription,
                        securityFinalAnswerUsernameGWA: answer[0].AdhocCharacteristicValue,
                        isModalVisibleUsernameGWA: false,


                    })
                    this.setState({
                        personIdForgotYourUsernameGWA: response.data.result.description[0].PersonID,
                        isModalVisibleQuestionUsernameGWA: true,
                        usernameWarningAccountNumberGWA: '',
                        usernameWarningEmailAddressGWA: ''
                    })
                    console.log('isModalVisibleQuestionUsernameGWA', this.state.isModalVisibleQuestionUsernameGWA)

                } else {
                    this.setState({
                        usernameWarningAccountNumberGWA: response.data.result.description + '.',
                        usernameWarningEmailAddressGWA: '',
                        loadingForgotYourUsernameGWA: false
                    })
                }





            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    passwordWarningAccountNumberGWA: `Server Error`,
                    passwordWarningEmailAddressGWA: '',
                    loadingForgotYourUsernameGWA: false
                })
            });
    }
    nextStepForgotYourUsernameGWA(personId) {


        axios.post(PAYGWA_URL +
            "/api/v1/send-email-forgot-username",
            {
                personId: personId
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
            .then((response) => {
                console.log(response.data);
                Toast.show({
                    text: `We've sent you a verification email.`,
                    duration: 2500,
                    type: 'success'
                })
                this.setState({
                    loadingQuestionForgotYourUsernameGWA: false,
                    isModalVisibleQuestionUsernameGWA: false
                })

            })
            .catch((error) => {
                console.log(error);
                Toast.show({
                    text: `Server Error`,
                    duration: 2500,
                    type: 'danger'
                })
            });

    }

    // GWA FORGOT PASSWORD
    forgotYourPasswordGWA(accountId, username) {
        debugger
        this.setState({
            loadingForgotYourPasswordGWA: true
        })
        axios.post(PAYGWA_URL + '/api/v1/forgot-password',
            {
                accountId: accountId,
                username: username,
                division: 'GWA',
            },
            {
                headers: { 'Content-Type': 'application/json' }
            })
            .then((response) => {
                console.log(response.data.result);

                const result = response.data.result.status
                if (result === 'Success') {

                    const questions = []
                    const answer = []
                    this.grep(response.data.result.description, (e) => {
                        if (e.CharacteristicType == "CMSCQUES") {
                            questions.push(e);
                        }

                    })

                    this.grep(response.data.result.description, (e) => {
                        if (e.CharacteristicType == "CMSCAN") {
                            answer.push(e);
                        }

                    })

                    console.log('forgotYourPasswordGWA', questions[0].CharValueDescription)
                    console.log('forgotYourPasswordGWA', answer[0].AdhocCharacteristicValue)
                    this.setState({
                        loadingForgotYourPasswordGWA: false,
                        securityQuestionPasswordGWA: questions[0].CharValueDescription,
                        securityFinalAnswerPasswordGWA: answer[0].AdhocCharacteristicValue,
                        isModalVisiblePasswordGWA: false
                    })
                    console.log(response.data.result.description[0].PersonID)
                    console.log(response.data.result.description[0].PersonID)
                    this.setState({
                        personIdForgotYourPasswordGWA: response.data.result.description[0].PersonID,
                        isModalVisibleQuestionPasswordGWA: true,
                        PasswordWarningAccountNumberGWA: '',
                        PasswordWarningEmailAddressGWA: ''
                    })
                    console.log('isModalVisibleQuestionUsernameGWA', this.state.isModalVisibleQuestionUsernameGWA)

                    // this.nextStepForgotYourPasswordGWA(response.data.result.description[0].PersonID)

                } else {

                    this.setState({
                        passwordWarningAccountNumberGWA: response.data.result.description + '.',
                        passwordWarningEmailAddressGWA: '',
                        loadingForgotYourPasswordGWA: false
                    })
                }






            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    passwordWarningAccountNumberGWA: `Server Error`,
                    passwordWarningEmailAddressGWA: '',
                    loadingForgotYourPasswordGWA: false
                })
            });
    }


    nextStepForgotYourPasswordGWA(personId) {
        this.setState({
            loadingQuestionForgotYourPasswordGWA: true
        })

        axios.post(PAYGWA_URL +
            "/api/v1/send-email-forgot-username",
            {
                personId: personId
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
            .then((response) => {

                console.log(response.data);
                Toast.show({
                    text: `We've sent you a verification email.`,
                    duration: 2500,
                    type: 'success'
                })
                this.setState({
                    loadingQuestionForgotYourPasswordGWA: false,
                    isModalVisibleQuestionPasswordGWA: false
                })

            })
            .catch((error) => {
                console.log(error);
            });

    }

    getPixelRatio = () => {
        // PIXEL DENSITY LEGEND

        // PixelRatio.get() === 1
        // mdpi Android devices

        // PixelRatio.get() === 1.5
        // hdpi Android devices

        // PixelRatio.get() === 2
        // iPhone 4, 4S
        // iPhone 5, 5C, 5S
        // iPhone 6, 7, 8
        // iPhone XR
        // xhdpi Android devices

        // PixelRatio.get() === 3
        // iPhone 6 Plus, 7 Plus, 8 Plus
        // iPhone X, XS, XS Max
        // Pixel, Pixel 2
        // xxhdpi Android devices

        // PixelRatio.get() === 3.5
        // Nexus 6
        // Pixel XL, Pixel 2 XL
        // xxxhdpi Android devices

        this.setState({
            pixelDensity: PixelRatio.get()
        })
        // // console.log(`${Constants.deviceName}PIXEL RATIO: `, PixelRatio.get());
    }

    //SET FOCUS OF CURSOR IN TEXT FIELD GWA
    focusNextField(compId) {
        this.componentId[compId]._root.focus()
    }
    //SET FOCUS OF CURSOR IN TEXT FIELD GPA
    focusNextFieldGPA(compId) {
        this.componentIdGPA[compId]._root.focus()
    }

    // GWA
    _keyboardDidShow = () => {
        this.setState({
            isOnFocusInput: true,
        })
    }

    _keyboardDidHide = () => {
        this.setState({
            isOnFocusInput: false,
        })
    }
    // GPA

    _keyboardDidShowGPA = () => {
        this.setState({
            isOnFocusInputGPA: true,
        })
    }

    _keyboardDidHideGPA = () => {
        this.setState({
            isOnFocusInputGPA: false,
        })
    }
    //MANUAL SIGN IN
    manualLogin = (emailAdd, password) => {
        let dataObject = {
            'emailAddress': emailAdd,
            'password': password
        }
        if (_.isEmpty(emailAdd) && _.isEmpty(password)) {
            Toast.show({
                text: 'Complete all fields',
                duration: 2500,
                type: 'warning'
            })
        }
        else if (_.isEmpty(emailAdd) || _.isEmpty(password)) {
            if (_.isEmpty(emailAdd)) {
                this.focusNextField('emailField')
            } else if (_.isEmpty(password)) {
                this.focusNextField('passField')
            } else {
                this.focusNextField('emailField')
            }
        }
        else {

            this.props.dispatch(fetchLogin(dataObject));
            // if (reg.test(emailAdd) == false) {
            //   // Alert.alert('Email is incorrect format.')
            //   Toast.show({
            //     text: 'Email is incorrect format.',
            //     duration: 2500,
            //     type: 'warning',
            //     position: 'top',
            //   })
            // } else {
            //   let isLoadingObject = {
            //     isLoginLoading: true
            //   }
            //   this.props.dispatch(fetchLogin(dataObject));
            // }
        }
    }

    async componentDidMount() {

        await Font.loadAsync({
            'Lato': require('../../../assets/fonts/Lato-Regular.ttf'),
            'Lato_Bold': require('../../../assets/fonts/Lato-Bold.ttf')
        });
        await this.getPixelRatio();
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
        console.disableYellowBox = true;
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    render() {


        if (this.props.payGwaUserDetails.userState.isLoginLoading) {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
                </View>
            )
        } else {



            return (
                <Container style={{ backgroundColor: colors.WHITE }} >
                    {/* MODALS */}
                    <KeyboardAvoidingView>

                        {this.state.isModalVisibleUsernameGWA ?
                            <Modal isVisible={this.state.isModalVisibleUsernameGWA} backdropColor={'rgba(0,0,0,.4)'} backdropOpacity={1}
                                avoidKeyboard={true}
                                onBackdropPress={() => this.setState({ isModalVisibleUsernameGWA: false })}
                            >
                                <View style={{ backgroundColor: colors.WHITE, paddingHorizontal: 20, paddingVertical: 20, borderRadius: 6 }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                                        <CustomTextBold style={{ color: '#808283', paddingVertical: 5, fontSize: 20 }}>Forgot Username</CustomTextBold>
                                    </View>
                                    {/* TEXT FIELD */}
                                    {
                                        _.isEmpty(this.state.usernameWarningAccountNumberGWA) ?
                                            <View style={{ padding: 5 }} />
                                            :
                                            <View style={{ padding: 5 }}><CustomText style={{ color: colors.RED }}>{this.state.usernameWarningAccountNumberGWA}</CustomText></View>

                                    }


                                    <Item regular
                                        style={styles.text_inputModal}>
                                        <Input
                                            autoCapitalize='none'
                                            placeholder={'Account Number'}
                                            placeholderTextColor='lightgray'
                                            keyboardType='number-pad'
                                            onChangeText={(input) => {
                                                this.setState({
                                                    accountNumberForgetUsernameGWA: input
                                                    // accountNumberForgetUsernameGWA: `6650000000`
                                                })
                                            }}
                                            value={this.state.accountNumberForgetUsernameGWA}
                                            blurOnSubmit={false}
                                        />

                                    </Item>
                                    {
                                        _.isEmpty(this.state.usernameWarningEmailAddressGWA) ?
                                            <View style={{ padding: 10 }} />
                                            :
                                            <View style={{ padding: 5 }}><CustomText style={{ color: colors.RED }}>{this.state.usernameWarningEmailAddressGWA}</CustomText></View>

                                    }

                                    <Item regular
                                        style={styles.text_inputModal, { paddingBottom: 5 }}>
                                        <Input
                                            autoCapitalize='none'
                                            placeholder={'Email Address'}
                                            placeholderTextColor='lightgray'

                                            keyboardType='email-address'
                                            onChangeText={(input) => {
                                                this.setState({
                                                    emailAddForgetUsernameGWA: input
                                                    // emailAddForgetUsernameGWA: `davedar95@yahoo.com`
                                                })
                                            }}
                                            value={this.state.emailAddForgetUsernameGWA}
                                            blurOnSubmit={false}
                                        />

                                    </Item>
                                    {/* BUTTON */}
                                    <View style={{ paddingVertical: 20, }}>
                                        <Button
                                            block success onPress={() => {


                                                let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

                                                if (_.isEmpty(this.state.emailAddForgetUsernameGWA) && _.isEmpty(this.state.accountNumberForgetUsernameGWA)) {
                                                    this.setState({
                                                        usernameWarningAccountNumberGWA: `Please enter your Account Number.`,
                                                        usernameWarningEmailAddressGWA: `Please enter your Email Address.`
                                                    })

                                                } else if (_.isEmpty(this.state.accountNumberForgetUsernameGWA)) {
                                                    this.setState({
                                                        usernameWarningAccountNumberGWA: `Please enter your Account Number.`,
                                                    })


                                                } else if (_.isEmpty(this.state.emailAddForgetUsernameGWA)) {
                                                    this.setState({
                                                        usernameWarningEmailAddressGWA: `Please enter your Email Adress.`
                                                    })
                                                } else if (reg.test(this.state.emailAddForgetUsernameGWA) === false) {
                                                    console.log("Please enter a valid Email Address.");
                                                    this.setState({ usernameWarningEmailAddressGWA: `Please enter a valid Email Address.` })
                                                    return false;
                                                }

                                                else {
                                                    this.forgotYourUsernameGWA(this.state.accountNumberForgetUsernameGWA, this.state.emailAddForgetUsernameGWA)
                                                }

                                            }
                                            }>
                                            {this.state.loadingForgotYourUsernameGWA ?
                                                <ActivityIndicator color={colors.PRIMARY_COLOR} />
                                                :
                                                <CustomText style={{ color: colors.WHITE }}>Submit</CustomText>
                                            }

                                        </Button>
                                    </View>
                                    <View style={{ paddingVertical: 10 }} >
                                        <Button transparent block light onPress={() => this.setState({ isModalVisibleUsernameGWA: false })}  >
                                            <CustomText style={{ color: colors.BLACK }}>Cancel</CustomText>
                                        </Button>
                                    </View>
                                </View>
                            </Modal>
                            :
                            false}

                        {this.state.isModalVisiblePasswordGWA ?
                            <Modal isVisible={this.state.isModalVisiblePasswordGWA} backdropColor={'rgba(0,0,0,.4)'} backdropOpacity={1}
                                avoidKeyboard={true}
                                onBackdropPress={() => this.setState({ isModalVisiblePasswordGWA: false })}
                            >
                                <View style={{ backgroundColor: colors.WHITE, paddingHorizontal: 20, paddingVertical: 20, borderRadius: 6 }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                                        <CustomTextBold style={{ color: '#808283', paddingVertical: 5, fontSize: 20 }}>Forgot Password</CustomTextBold>
                                    </View>
                                    {/* TEXT FIELD */}
                                    {_.isEmpty(this.state.passwordWarningAccountNumberGWA) ?
                                        <View style={{ padding: 5 }} />
                                        :
                                        <View style={{ padding: 5 }}><CustomText style={{ color: colors.RED }}>{this.state.passwordWarningAccountNumberGWA}</CustomText></View>
                                    }

                                    <Item regular
                                        style={styles.text_inputModal}>
                                        <Input
                                            autoCapitalize='none'
                                            placeholder={'Account Number'}
                                            placeholderTextColor='lightgray'
                                            keyboardType='number-pad'
                                            onChangeText={(input) => {
                                                this.setState({
                                                    accountNumberForgetPasswordGWA: input
                                                    // accountNumberForgetPasswordGWA: `6650000000`
                                                })
                                            }}
                                            value={this.state.accountNumberForgetPasswordGWA}
                                            blurOnSubmit={false}
                                        />

                                    </Item>
                                    {_.isEmpty(this.state.passwordWarningUsernameGWA) ?
                                        <View style={{ padding: 10 }} />
                                        :
                                        <View style={{ padding: 5 }}><CustomText style={{ color: colors.RED }}>{this.state.passwordWarningUsernameGWA}</CustomText></View>
                                    }

                                    <Item regular
                                        style={styles.text_inputModal, { paddingBottom: 5 }}>
                                        <Input
                                            autoCapitalize='none'
                                            placeholder={'Username'}
                                            placeholderTextColor='lightgray'
                                            onChangeText={(input) => {
                                                this.setState({
                                                    usernameForgetPasswordGWA: input
                                                    // usernameForgetPasswordGWA: `blas959`
                                                })
                                            }}
                                            value={this.state.usernameForgetPasswordGWA}
                                            blurOnSubmit={false}
                                        />

                                    </Item>
                                    {/* BUTTON isModalVisiblePasswordGWA */}
                                    <View style={{ paddingVertical: 20 }}>
                                        <Button block success onPress={() => {


                                            if (_.isEmpty(this.state.accountNumberForgetPasswordGWA) && _.isEmpty(this.state.usernameForgetPasswordGWA)) {
                                                this.setState({
                                                    passwordWarningAccountNumberGWA: `Please enter your Account Number.`,
                                                    passwordWarningUsernameGWA: `Please enter your Username.`
                                                })

                                            } else if (_.isEmpty(this.state.accountNumberForgetPasswordGWA)) {
                                                this.setState({
                                                    passwordWarningAccountNumberGWA: `Please enter your Account Number.`,
                                                })


                                            } else if (_.isEmpty(this.state.usernameForgetPasswordGWA)) {
                                                this.setState({
                                                    usernameWarningEmailAddressGWA: `Please enter your Username.`
                                                })
                                            } else {
                                                this.forgotYourPasswordGWA(this.state.accountNumberForgetPasswordGWA, this.state.usernameForgetPasswordGWA)
                                            }

                                        }
                                        }>
                                            {this.state.loadingForgotYourPasswordGWA ?
                                                <ActivityIndicator color={colors.PRIMARY_COLOR} />
                                                :
                                                <CustomText style={{ color: colors.WHITE }}>Submit</CustomText>
                                            }
                                        </Button>
                                    </View>
                                    <View style={{ paddingVertical: 10 }} >
                                        <Button transparent block light onPress={() => this.setState({ isModalVisiblePasswordGWA: false })}  >
                                            <CustomText style={{ color: colors.BLACK }}>Cancel</CustomText>
                                        </Button>
                                    </View>
                                </View>
                            </Modal>
                            :
                            null}

                        {this.state.isModalVisibleUsernameGPA
                            ? <Modal isVisible={this.state.isModalVisibleUsernameGPA} backdropColor={'rgba(0,0,0,.4)'} backdropOpacity={1}
                                avoidKeyboard={true}
                                onBackdropPress={() => this.setState({ isModalVisibleUsernameGPA: false })}
                            >
                                <View style={{ backgroundColor: colors.WHITE, paddingHorizontal: 20, paddingVertical: 20, borderRadius: 6 }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                                        <CustomTextBold style={{ color: '#808283', paddingVertical: 5, fontSize: 20 }}>Forgot Username</CustomTextBold>
                                    </View>
                                    {/* TEXT FIELD */}
                                    <Item regular
                                        style={styles.text_inputModal}>
                                        <Input
                                            autoCapitalize='none'
                                            placeholder={'Account Number'}
                                            placeholderTextColor='lightgray'
                                            keyboardType='number-pad'
                                            onChangeText={(input) => {
                                                this.setState({
                                                    emailAdd: input
                                                })
                                            }}
                                            value={this.state.accountNumberForgetUsernameGWA}
                                            blurOnSubmit={false}
                                        />

                                    </Item>

                                    <Item regular
                                        style={styles.text_inputModal}>
                                        <Input
                                            autoCapitalize='none'
                                            placeholder={'Email Address'}
                                            placeholderTextColor='lightgray'
                                            keyboardType='email-address'
                                            onChangeText={(input) => {
                                                // this.setState({
                                                //     emailAdd: input
                                                // })
                                            }}
                                            value={this.state.emailAddForgetUsernameGWA}
                                            blurOnSubmit={false}
                                        />

                                    </Item>
                                    {/* BUTTON */}
                                    <View style={{ paddingVertical: 10 }}>
                                        <Button block success onPress={() => {
                                            this.setState({
                                                isModalVisibleUsernameGPA: false,
                                            })
                                        }
                                        }>
                                            <CustomText style={{ color: colors.WHITE }}>Submit</CustomText>
                                        </Button>
                                    </View>
                                    <View style={{ paddingVertical: 10 }} >
                                        <Button transparent block light onPress={() => this.setState({ isModalVisibleUsernameGPA: false })}  >
                                            <CustomText style={{ color: colors.BLACK }}>Cancel</CustomText>
                                        </Button>
                                    </View>
                                </View>
                            </Modal>
                            :
                            null}

                        {this.state.isModalVisiblePasswordGPA
                            ?
                            <Modal isVisible={this.state.isModalVisiblePasswordGPA} backdropColor={'rgba(0,0,0,.4)'} backdropOpacity={1}
                                avoidKeyboard={true}
                                onBackdropPress={() => this.setState({ isModalVisiblePasswordGPA: false })}
                            >
                                <View style={{ backgroundColor: colors.WHITE, paddingHorizontal: 20, paddingVertical: 20, borderRadius: 6 }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                                        <CustomTextBold style={{ color: '#808283', paddingVertical: 5, fontSize: 20 }}>Forgot Password</CustomTextBold>
                                    </View>
                                    {/* TEXT FIELD */}
                                    <Item regular
                                        style={styles.text_inputModal}>
                                        <Input
                                            autoCapitalize='none'
                                            placeholder={'Account Number'}
                                            placeholderTextColor='lightgray'
                                            keyboardType='number-pad'
                                            onChangeText={(input) => {
                                                // this.setState({
                                                //     emailAdd: input
                                                // })
                                            }}
                                            value={this.state.accountNumberForgetPasswordGPA}
                                            blurOnSubmit={false}
                                        />

                                    </Item>

                                    <Item regular
                                        style={styles.text_inputModal}>
                                        <Input
                                            autoCapitalize='none'
                                            placeholder={'Email Address'}
                                            placeholderTextColor='lightgray'
                                            keyboardType='email-address'
                                            onChangeText={(input) => {
                                                // this.setState({
                                                //     emailAdd: input
                                                // })
                                            }}
                                            value={this.state.emailAddForgetPasswordGPA}
                                            blurOnSubmit={false}
                                        />

                                    </Item>
                                    {/* BUTTON */}
                                    <View style={{ paddingVertical: 10 }}>
                                        <Button block success onPress={() => {
                                            this.setState({
                                                isModalVisiblePasswordGPA: false,
                                            })
                                        }
                                        }>
                                            <CustomText style={{ color: colors.WHITE }}>Submit</CustomText>
                                        </Button>
                                    </View>
                                    <View style={{ paddingVertical: 10 }} >
                                        <Button transparent block light onPress={() => this.setState({ isModalVisiblePasswordGPA: false })}  >
                                            <CustomText style={{ color: colors.BLACK }}>Cancel</CustomText>
                                        </Button>
                                    </View>
                                </View>
                            </Modal>
                            : null}

                        {/* QUESTIONS */}
                        {this.state.isModalVisibleQuestionUsernameGWA ?
                            <Modal isVisible={this.state.isModalVisibleQuestionUsernameGWA} backdropColor={'rgba(0,0,0,.4)'} backdropOpacity={1}
                                avoidKeyboard={true}
                                onBackdropPress={() => this.setState({ isModalVisibleQuestionUsernameGWA: false })}
                            >
                                <View style={{ backgroundColor: colors.WHITE, paddingHorizontal: 20, paddingVertical: 20, borderRadius: 6 }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                                        <CustomTextBold style={{ color: '#808283', paddingVertical: 5, fontSize: 20 }}>Forgot Username</CustomTextBold>
                                    </View>
                                    {/* TEXT FIELD */}
                                    <View style={{ paddingTop: 10, paddingBottom: 5, paddingLeft: 5, paddingRight: 5 }}><CustomTextBold style={{ fontSize: 16 }}>{this.state.securityQuestionUsernameGWA}?</CustomTextBold></View>
                                    {_.isEmpty(this.state.usernameWarningQuestionEmailAddressGWA) ?
                                        <View style={{ paddingTop: 10, paddingBottom: 5, paddingLeft: 5, paddingRight: 5 }} />
                                        :
                                        <View style={{ paddingTop: 10, paddingBottom: 5, paddingLeft: 5, paddingRight: 5 }}><CustomText style={{ color: colors.RED }}>{this.state.usernameWarningQuestionEmailAddressGWA}</CustomText></View>
                                    }

                                    <Item regular
                                        style={styles.text_inputModal, { paddingBottom: 5 }}>
                                        <Input
                                            autoCapitalize='none'
                                            placeholder={'Security Answer'}
                                            placeholderTextColor='lightgray'

                                            onChangeText={(input) => {
                                                this.setState({
                                                    // emailAddForgetUsernameGWA: input
                                                    securityAnswerUsernameGWA: input
                                                })
                                            }}
                                            value={this.state.securityAnswerUsernameGWA}
                                            blurOnSubmit={false}
                                        />

                                    </Item>

                                    {/* BUTTON */}
                                    <View style={{ paddingVertical: 20, }}>
                                        <Button
                                            block success onPress={() => {
                                                this.setState({
                                                    loadingQuestionForgotYourUsernameGWA: true
                                                })


                                                if (this.state.securityAnswerUsernameGWA === this.state.securityFinalAnswerUsernameGWA) {
                                                    // Clear the security Question
                                                    this.setState({
                                                        usernameWarningQuestionEmailAddressGWA: ``
                                                    })

                                                    this.nextStepForgotYourUsernameGWA(this.state.personIdForgotYourUsernameGWA)


                                                } else {
                                                    setTimeout(() => { this.setState({ loadingQuestionForgotYourUsernameGWA: false }) }, 1000)
                                                    this.setState({
                                                        usernameWarningQuestionEmailAddressGWA: `Security Answer is not valid.`
                                                    })

                                                }

                                            }
                                            }>
                                            {this.state.loadingQuestionForgotYourUsernameGWA ?
                                                <ActivityIndicator color={colors.PRIMARY_COLOR} />
                                                :
                                                <CustomText style={{ color: colors.WHITE }}>Submit</CustomText>
                                            }

                                        </Button>
                                    </View>
                                    <View style={{ paddingVertical: 10 }} >
                                        <Button transparent block light onPress={() => this.setState({ isModalVisibleQuestionUsernameGWA: false })}  >
                                            <CustomText style={{ color: colors.BLACK }}>Cancel</CustomText>
                                        </Button>
                                    </View>
                                </View>
                            </Modal>
                            :
                            null}

                        {this.state.isModalVisibleQuestionPasswordGWA ?
                            <Modal isVisible={this.state.isModalVisibleQuestionPasswordGWA} backdropColor={'rgba(0,0,0,.4)'} backdropOpacity={1}
                                avoidKeyboard={true}
                                onBackdropPress={() => this.setState({ isModalVisibleQuestionPasswordGWA: false })}
                            >
                                <View style={{ backgroundColor: colors.WHITE, paddingHorizontal: 20, paddingVertical: 20, borderRadius: 6 }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                                        <CustomTextBold style={{ color: '#808283', paddingVertical: 5, fontSize: 20 }}>Forgot Password</CustomTextBold>
                                    </View>
                                    {/* TEXT FIELD */}
                                    <View style={{ paddingTop: 10, paddingBottom: 5, paddingLeft: 5, paddingRight: 5 }}><CustomTextBold style={{ fontSize: 16 }}>{this.state.securityQuestionPasswordGWA}?</CustomTextBold></View>
                                    {_.isEmpty(this.state.passwordWarningEmailAddressGWA) ?
                                        <View style={{ paddingTop: 10, paddingBottom: 5, paddingLeft: 5, paddingRight: 5 }} />
                                        :
                                        <View style={{ paddingTop: 10, paddingBottom: 5, paddingLeft: 5, paddingRight: 5 }}><CustomText style={{ color: colors.RED }}>{this.state.passwordWarningQuestionEmailAddressGWA}</CustomText></View>
                                    }

                                    <Item regular
                                        style={styles.text_inputModal, { paddingBottom: 5 }}>
                                        <Input
                                            autoCapitalize='none'
                                            placeholder={'Security Answer'}
                                            placeholderTextColor='lightgray'

                                            onChangeText={(input) => {
                                                this.setState({
                                                    // emailAddForgetPasswordGWA: input
                                                    securityAnswerPasswordGWA: input
                                                })
                                            }}
                                            value={this.state.securityAnswerPasswordGWA}
                                            blurOnSubmit={false}
                                        />

                                    </Item>

                                    {/* BUTTON */}
                                    <View style={{ paddingVertical: 20, }}>
                                        <Button
                                            block success onPress={() => {
                                                this.setState({
                                                    loadingQuestionForgotYourPasswordGWA: true
                                                })


                                                if (this.state.securityAnswerPasswordGWA === this.state.securityFinalAnswerPasswordGWA) {
                                                    // Clear the security Question
                                                    this.setState({
                                                        passwordWarningQuestionEmailAddressGWA: ``
                                                    })

                                                    this.nextStepForgotYourPasswordGWA(this.state.personIdForgotYourPasswordGWA)


                                                } else {
                                                    setTimeout(() => { this.setState({ loadingQuestionForgotYourPasswordGWA: false }) }, 1000)
                                                    this.setState({
                                                        passwordWarningQuestionEmailAddressGWA: `Security Answer is not valid.`
                                                    })

                                                }

                                            }
                                            }>
                                            {this.state.loadingQuestionForgotYourPasswordGWA ?
                                                <ActivityIndicator color={colors.PRIMARY_COLOR} />
                                                :
                                                <CustomText style={{ color: colors.WHITE }}>Submit</CustomText>
                                            }

                                        </Button>
                                    </View>
                                    <View style={{ paddingVertical: 10 }} >
                                        <Button transparent block light onPress={() => this.setState({ isModalVisibleQuestionPasswordGWA: false })}  >
                                            <CustomText style={{ color: colors.BLACK }}>Cancel</CustomText>
                                        </Button>
                                    </View>
                                </View>
                            </Modal>
                            :
                            null}
                        {/* MODAL END */}
                    </KeyboardAvoidingView>
                    <View style={[styles.container, { flex: 1, }]}>
                        <Offline />


                        {/* LOGO */}
                        {
                            this.state.isOnFocusInput ? null
                                :
                                this.state.currentTab === 1 ?
                                    <Image style={styles.gpwa_logo} source={require('../../../assets/gpa_logo_blue.png')} />
                                    :
                                    <Image style={styles.gpwa_logo_gwa} source={require('../../../assets/paygwa.png')} />



                        }


                        <Content style={{ paddingTop: 20, paddingHorizontal: 18, backgroundColor: 'white' }}>
                            <Tabs
                                tabBarUnderlineStyle={{ backgroundColor: '#1787C9' }}
                                style={{ backgroundColor: 'white', borderColor: '#DADADA', borderBottomWidth: 0.9, borderTopWidth: 0.9, borderLeftWidth: 0.9, borderRightWidth: 0.9, borderRadius: 5 }}
                                onChangeTab={({ i }) => {
                                    console.log(i)
                                    this.setState({ currentTab: i })
                                }
                                } >
                                <Tab heading="PayGWA"
                                    tabStyle={{ backgroundColor: 'white', color: '#9D9D9D', fontFamily: 'Lato_Bold' }}
                                    textStyle={{ fontFamily: 'Lato_Bold', color: '#ADADAD' }}
                                    activeTabStyle={{ backgroundColor: '#F1F4F5', color: '#68686B', fontFamily: 'Lato_Bold', }}
                                    activeTextStyle={{ fontFamily: 'Lato_Bold', color: '#68686B' }} >
                                    {/* TOP */}

                                    {/* LOGIN FORM */}
                                    <View style={[styles.login_form, { flex: this.state.isOnFocusInput ? 4 : 3, }]}>

                                        <Button block rounded transparent
                                            style={[styles.buttons, { backgroundColor: colors.LIGHT_GREEN, borderRadius: 6, borderWidth: 0.5, height: 50 }]}
                                            onPress={() =>
                                                console.log('PayNow')
                                            }>
                                            <CustomText style={{ color: colors.WHITE }}>Pay Now</CustomText>
                                        </Button>
                                        {/*LABEL*/}
                                        <View style={styles.gpwa_label_container, { marginTop: 15, alignItems: 'center' }}>
                                            <CustomTextBold style={[styles.gpwa_label, { fontSize: 14 }]}>Log in to your Account</CustomTextBold>
                                        </View>



                                        {/* EMAIL ADDRESS */}
                                        <Item regular
                                            style={styles.text_input}>
                                            <Input
                                                ref={compId => {
                                                    this.componentId['emailField'] = compId
                                                }}
                                                autoCapitalize='none'
                                                placeholder={'Email Address'}
                                                placeholderTextColor='lightgray'
                                                keyboardType='email-address'
                                                onSubmitEditing={() => this.focusNextField('passField')}
                                                onChangeText={(input) => {
                                                    this.setState({
                                                        emailAdd: input
                                                    })
                                                }}
                                                value={this.state.emailAdd}
                                                blurOnSubmit={false}
                                            />
                                            {/* <Icon name='person' style={{ color: 'lightgray' }} /> */}
                                        </Item>
                                        <Item regular
                                            style={styles.text_input}>
                                            <Input
                                                ref={compId => {
                                                    this.componentId['passField'] = compId
                                                }}
                                                placeholder={'Password'}
                                                placeholderTextColor='lightgray'
                                                secureTextEntry={this.state.hidePassword}
                                                onChangeText={(input) => {
                                                    this.setState({
                                                        password: input
                                                    })
                                                }}
                                                blurOnSubmit={true}
                                                onSubmitEditing={() => {
                                                    this.manualLogin(this.state.emailAdd, this.state.password);
                                                }}
                                            />
                                        </Item>

                                        {/* MANUAL SIGN IN */}
                                        <Button block rounded transparent
                                            style={[styles.buttons, { backgroundColor: '#1687C7', borderRadius: 6, borderWidth: 0.5, height: 50 }]}
                                            onPress={() =>
                                                this.manualLogin(this.state.emailAdd, this.state.password)
                                                // this.manualLogin('gdoe', 'GDOE2018')
                                                // this.manualLogin('Relyant', 'Relyant01')
                                                // this.manualLogin('blas959', 'sweetheart95')
                                            }>
                                            <CustomText style={{ color: colors.WHITE }}>Login</CustomText>
                                        </Button>

                                        <View style={styles.gpwa_label_container, { marginTop: 15, alignItems: 'center' }}>
                                            <CustomTextBold style={[styles.gpwa_label, { fontSize: pRatioToFontSize(0) }]}>Don't have an account?</CustomTextBold>
                                        </View>

                                        <Button block rounded transparent
                                            style={[styles.buttons, { backgroundColor: '#15B8E8', borderRadius: 6, borderWidth: 0.5, height: 50 }]}
                                            onPress={() =>
                                                // this.manualLogin(this.state.emailAdd,this.state.password)
                                                // this.manualLogin('gdoe', 'GDOE2018')
                                                // this.manualLogin('Relyant', 'Relyant01')
                                                this.manualLogin('nurbano1', 'TO1108370z!')
                                            }>
                                            <CustomText style={{ color: colors.WHITE }}>Register</CustomText>
                                        </Button>


                                        {/* Forgot */}
                                        <View style={{ paddingVertical: 10, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <CustomText style={[styles.demo_text, { color: colors.BLACK }]}>Forgot your </CustomText>
                                            <TouchableOpacity
                                                onPress={() => this.setState({ isModalVisibleUsernameGWA: true })}
                                            >
                                                <CustomText style={[styles.demo_text, { color: colors.BLACK, textDecorationLine: 'underline' }]}
                                                >
                                                    Username
                                                </CustomText>
                                            </TouchableOpacity>
                                            <CustomText style={styles.content}> or </CustomText>
                                            <TouchableOpacity
                                                onPress={() => this.setState({ isModalVisiblePasswordGWA: true })}
                                            >
                                                <CustomText style={[styles.demo_text, { color: colors.BLACK, textDecorationLine: 'underline' }]}
                                                >
                                                    Password?
                                            </CustomText>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                    {/* END */}

                                </Tab>
                                <Tab heading="PayGPA"
                                    tabStyle={{ backgroundColor: 'white', color: '#9D9D9D', fontFamily: 'Lato_Bold' }}
                                    textStyle={{ fontFamily: 'Lato_Bold', color: '#ADADAD' }}
                                    activeTabStyle={{ backgroundColor: '#F1F4F5', color: '#68686B', fontFamily: 'Lato_Bold' }}
                                    activeTextStyle={{ fontFamily: 'Lato_Bold', color: '#68686B' }}>

                                    {/* TOP */}

                                    {/* LOGIN FORM */}
                                    <View style={[styles.login_form, { flex: this.state.isOnFocusInput ? 4 : 3, }]}>

                                        <Button block rounded transparent
                                            style={[styles.buttons, { backgroundColor: colors.LIGHT_GREEN, borderRadius: 6, borderWidth: 0.5, height: 50 }]}
                                            onPress={() =>
                                                console.log('PayNow')
                                            }>
                                            <CustomText style={{ color: colors.WHITE }}>Quick Pay</CustomText>
                                        </Button>
                                        {/*LABEL*/}
                                        <View style={styles.gpwa_label_container, { marginTop: 15, alignItems: 'center' }}>
                                            <CustomTextBold style={[styles.gpwa_label, { fontSize: 14 }]}>Log in to your Account</CustomTextBold>
                                        </View>



                                        {/* EMAIL ADDRESS */}
                                        <Item regular
                                            style={styles.text_input}>
                                            <Input
                                                ref={compId => {
                                                    this.componentId['emailFieldGPA'] = compId
                                                }}
                                                autoCapitalize='none'
                                                placeholder={'Email Address'}
                                                placeholderTextColor='lightgray'
                                                keyboardType='email-address'
                                                onSubmitEditing={() => this.focusNextField('passFieldGPA')}
                                                onChangeText={(input) => {
                                                    this.setState({
                                                        emailAddGPA: input
                                                    })
                                                }}
                                                value={this.state.emailAddGPA}
                                                blurOnSubmit={false}
                                            />
                                            {/* <Icon name='person' style={{ color: 'lightgray' }} /> */}
                                        </Item>
                                        <Item regular
                                            style={styles.text_input}>
                                            <Input
                                                ref={compId => {
                                                    this.componentId['passField'] = compId
                                                }}
                                                placeholder={'Password'}
                                                placeholderTextColor='lightgray'
                                                secureTextEntry={this.state.hidePasswordGPA}
                                                onChangeText={(input) => {
                                                    this.setState({
                                                        passwordGPA: input
                                                    })
                                                }}
                                                blurOnSubmit={true}
                                                onSubmitEditing={() => {
                                                    this.manualLogin(this.state.emailAddGPA, this.state.passwordGPA);
                                                }}
                                            />
                                        </Item>

                                        {/* MANUAL SIGN IN */}
                                        <Button block rounded transparent
                                            style={[styles.buttons, { backgroundColor: '#1687C7', borderRadius: 6, borderWidth: 0.5, height: 50 }]}
                                            onPress={() =>
                                                console.log('GPALOGIN')
                                                // this.manualLogin(this.state.emailAdd,this.state.password)
                                                // this.manualLogin('gdoe', 'GDOE2018')
                                                // this.manualLogin('Relyant', 'Relyant01')
                                                // this.manualLogin('bevfrisas', '123')
                                            }>
                                            <CustomText style={{ color: colors.WHITE }}>Login</CustomText>
                                        </Button>

                                        <View style={styles.gpwa_label_container, { marginTop: 15, alignItems: 'center' }}>
                                            <CustomTextBold style={[styles.gpwa_label, { fontSize: pRatioToFontSize(0) }]}>Don't have an account?</CustomTextBold>
                                        </View>

                                        <Button block rounded transparent
                                            style={[styles.buttons, { backgroundColor: '#15B8E8', borderRadius: 6, borderWidth: 0.5, height: 50 }]}
                                            onPress={() =>
                                                console.log('REG PAYGPA')
                                                // this.manualLogin(this.state.emailAdd,this.state.password)
                                                // this.manualLogin('gdoe', 'GDOE2018')
                                                // this.manualLogin('Relyant', 'Relyant01')
                                                // this.manualLogin('bevfrisas', '123')
                                            }>
                                            <CustomText style={{ color: colors.WHITE }}>Register</CustomText>
                                        </Button>


                                        {/* Forgot */}
                                        <View style={{ paddingVertical: 10, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <CustomText style={[styles.demo_text, { color: colors.BLACK }]}>Forgot your </CustomText>
                                            <TouchableOpacity
                                                onPress={() => this.setState({ isModalVisibleUsernameGPA: true })}
                                            >
                                                <CustomText style={[styles.demo_text, { color: colors.BLACK, textDecorationLine: 'underline' }]}
                                                >
                                                    Username
                                                </CustomText>
                                            </TouchableOpacity>
                                            <CustomText style={styles.content}> or </CustomText>
                                            <TouchableOpacity
                                                onPress={() => this.setState({ isModalVisiblePasswordGPA: true })}
                                            >
                                                <CustomText style={[styles.demo_text, { color: colors.BLACK, textDecorationLine: 'underline' }]}
                                                >
                                                    Password?
                                            </CustomText>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {/* END */}

                                </Tab>


                            </Tabs>
                        </Content>


                    </View>
                </Container>
            );
        }
    }

}
const mapStateToProps = (state) => ({
    payGwaUserDetails: state
});

const mapDispatchToProps = (dispatch) => ({
    dispatch: dispatch
})
export default connect(mapStateToProps)(Login);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        justifyContent: 'center',
        // backgroundColor: colors.PRIMARY_COLOR
    },
    gpwa_logo: {
        alignSelf: 'center',
        height: Dimensions.get('screen').height <= 450 ? 80 : 100,
        width: Dimensions.get('screen').height <= 450 ? 80 : 100,
        resizeMode: 'contain',

    },
    gpwa_logo_gwa: {
        alignSelf: 'center',
        height: Dimensions.get('screen').height <= 450 ? 80 : 100,
        width: Dimensions.get('screen').height <= 450 ? 300 : 300,
        resizeMode: 'contain',

    },
    gpwa_label_container: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gpwa_label: {
        color: colors.BLACK
    },
    login_form: {
        flex: 4,
        paddingHorizontal: 35,
    },
    buttons: {
        marginTop: 15,
    },
    text_input: {
        backgroundColor: colors.WHITE,
        borderRadius: 6,
        borderColor: 'lightgray',
        marginTop: 15,
    },
    text_inputModal: {
        backgroundColor: colors.WHITE,
        borderRadius: 6,
        borderColor: 'lightgray',
        marginTop: 15,
    },
    demo_text: {
        textAlign: 'center',
        fontSize: pRatioToFontSize(-0.5)
    }
});