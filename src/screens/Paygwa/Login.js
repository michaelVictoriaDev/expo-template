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
import CustomTextMedium from '../../components/CustomTextMedium';
import Offline from '../../components/OfflineNotice';
import * as Font from 'expo-font';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'react-native-axios'
import { PAYGWA_URL, DASHBOARD_URL, PAYNOW_URL } from 'react-native-dotenv';
import NavigationService from '../../NavigationService'

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
                text: 'Invalid User Name or Password',
                duration: 2500,
                type: 'danger'
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

            // this.props.dispatch(fetchLogin(dataObject));
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
                   

                    <ImageBackground source={require('../../../assets/back-ground.png')} style={{ width: '100%', height: '100%' }}>
                    <Content style={[styles.container]}>
             
                        <Offline />
                        {/* LOGO */}

                        <Content style={{ paddingTop: 10, paddingBottom: 100, paddingHorizontal: 18 }}>
                            <View style={{ paddingVertical: 50 }} />
                            <View style={[styles.login_form, { flex: this.state.isOnFocusInput ? 4 : 3, }]}>



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
                                <View style={{ padding: 5 }} />
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
                                    disabled={this.props.payGwaUserDetails.userState.isLoginLoading}
                                    style={[styles.buttons, { backgroundColor: '#1687C7', borderRadius: 6, borderWidth: 0.5, height: 50 }]}
                                    onPress={() =>
                                        // GWA\
                                        this.props.navigation.navigate('MyAccounts',)
                                        // this.manualLogin(this.state.emailAdd, this.state.password)
                                        // this.manualLogin('gdoe', 'GDOE2018')
                                        // this.manualLogin('relyant01', 'Relyant01')
                                        // this.manualLogin('dblas95', 'sweetheart95')
                                        // this.manualLogin('neilg671', 'TO1108370z!')
                                    }>
                                    <CustomTextMedium style={{ color: colors.WHITE, fontSize: 16 }}>{'Login'} </CustomTextMedium>
                                </Button>

                                <View style={styles.gpwa_label_container, { marginTop: 10, alignItems: 'center' }}>
                                    <CustomTextBold style={[styles.gpwa_label, { fontSize: 12 }]}>Don't have an account?</CustomTextBold>
                                </View>

                                <Button block rounded transparent
                                    style={{ backgroundColor: '#15B8E8', borderRadius: 6, borderWidth: 0.5, height: 50, marginTop: 10 }}
                                    onPress={() =>
                                        console.log('test')
                                    }>
                                    <CustomTextMedium style={{ color: colors.WHITE, fontSize: 16 }}>Register</CustomTextMedium>
                                </Button>


                                {/* Forgot */}
                                <View style={{ paddingVertical: 10, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <CustomText style={[styles.demo_text, { color: colors.WHITE }]}>Forgot your </CustomText>
                                    <TouchableOpacity
                                        onPress={() => console.log('test')}
                                    >
                                        <CustomText style={[styles.demo_text, { color: colors.WHITE, textDecorationLine: 'underline' }]}
                                        >
                                            Username
                                      </CustomText>
                                    </TouchableOpacity>
                                    <CustomText style={{color: colors.WHITE}}> or </CustomText>
                                    <TouchableOpacity
                                        onPress={() => console.log('test')}
                                    >
                                        <CustomText style={[styles.demo_text, { color: colors.WHITE, textDecorationLine: 'underline' }]}
                                        >
                                            Password?
                                        </CustomText>
                                    </TouchableOpacity>

                                </View>
                            </View>
                            {/* END */}
                            
                        </Content>
                  

                    </Content>
                    </ImageBackground>
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
        paddingTop: 45,
        paddingBottom: 50
        //  
        // paddingBottom : 50
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
        color: colors.WHITE
    },
    login_form: {
        flex: 4,
        paddingHorizontal: 35,
    },
    buttons: {
        marginTop: 20
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
        fontSize: 12
    }
});