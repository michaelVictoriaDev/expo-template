import React, { Component } from 'react';
import { StyleSheet, PixelRatio, Image, Keyboard, Dimensions, Alert, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import { View, Text, Input, Item, Button, Icon, Toast } from 'native-base';
import { colors, pRatioToFontSize } from '../../utils/constants';
import { fetchLogin, signInWithGoogleAsync } from '../../actions';
import _ from 'lodash';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as AppAuth from 'expo-app-auth';
const { URLSchemes } = AppAuth;
import * as Constants from 'expo-constants';
import Offline from '../../components/OfflineNotice';

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
        }
        this.focusNextField = this.focusNextField.bind(this)
        this.componentId = {} //STORE DOM OF TEXT FIELDS (EMAIL AND PASSWORD)
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

    //SET FOCUS OF CURSOR IN TEXT FIELD
    focusNextField(compId) {
        this.componentId[compId]._root.focus()
    }

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
                type: 'warning',
                position: 'top',
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
            let isLoadingObject = {
                isLoginLoading: true
            }
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

    async componentWillMount() {

        // mobileAnalytics.logEvent(mobileAnalytics.events.LOGIN_PAGE);

        // Toast.show({text: JSON.stringify(AppAuth.URLSchemes), duration : 5000})
        try {
            await GoogleSignIn.initAsync({
                clientId: '1042681830620-3ha27slgidqan4keboiu4go80og87oe9.apps.googleusercontent.com',
                isPromptEnabled: true,
                // clientId : URLSchemes,
            })
                .then(async () => {
                    await GoogleSignIn.signOutAsync();
                })
            // Toast.show({text : 'G: Successfully initiated.', duration : 5000})
        }
        catch (error) {
            // Toast.show({text : 'G: Failed initiation.' + error, duration : 5000})
            // console.log('Google init:', error)
        }
    }

    async componentDidMount() {
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

        if (this.props.curState.userState.isLoginLoading) {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Image source={require("../../../assets/prosperna_loading.gif")} />
                </View>
            )
        }
        else {
            return (
                <View style={[styles.container, { flex: 1, }]}>
                    <Offline />

                    {/* LOGO */}
                    {
                        this.state.isOnFocusInput ? null :
                            <Image style={styles.prosperna_logo} source={require('../../../assets/screens/Login/prosperna_mobile_logo.png')} />
                    }

                    {/* PROSPERNA LABEL*/}

                    <View style={styles.prosperna_label_container}>
                        <Text style={[styles.prosperna_label, { fontSize: pRatioToFontSize(5) }]}>Prosperna</Text>
                        {
                            this.state.isOnFocusInput ?
                                null
                                :
                                <Text style={[styles.prosperna_label, { fontSize: pRatioToFontSize(0) }]}>Log in to your Account</Text>
                        }
                    </View>

                    {/* LOGIN FORM */}
                    <View style={[styles.login_form, { flex: this.state.isOnFocusInput ? 4 : 3, }]}>

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
                            <Icon name='person' style={{ color: 'lightgray' }} />
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

                        {/* MANUAL SIGN IN */}
                        <Button block rounded transparent
                            style={[styles.buttons, { backgroundColor: colors.WHITE, borderRadius: 24, borderWidth: 0.5 }]}
                            onPress={() =>
                                // this.manualLogin(this.state.emailAdd,this.state.password)
                                // this.manualLogin('wetpacsholder@gmail.com', '1234')
                                this.manualLogin('michael@xtendly.com', '1234')
                                // this.manualLogin('gstaana@xtendly.com', '1234')
                                // this.manualLogin('peaches@prosperna.com', '1234')
                                // this.manualLogin('raj@xtendly.com', '1234')
                                // this.manualLogin('joshua@prosperna.com', '1234')
                                // this.manualLogin('dennis@prosperna.com', '1234')
                                // this.manualLogin('liannerex@gmail.com', '0000')
                                // this.manualLogin('pamelad@garyhablero.realtor', '1234')
                                // this.manualLogin('joshua@xtendly.com', '1234')
                                // this.manualLogin('plusplan914@gmail.com', '1234')
                            }>
                            <Text style={styles.button_login_text}>Log in</Text>
                        </Button>

                        {/* GOOGLE SIGN IN */}
                        <View style={[styles.buttons, { flexDirection: 'row', height: 45 }]}>
                            <View style={{
                                flex: 1, justifyContent: 'center', alignItems: 'center', borderColor: '#3F71D7', borderWidth: 1,
                                borderTopLeftRadius: 5, borderBottomLeftRadius: 5,
                            }}>
                                <Image
                                    source={require("../../../assets/screens/Login/google_logo_48.png")}
                                />
                            </View>

                            <Button block
                                onPress={() => this.props.dispatch(signInWithGoogleAsync())}
                                style={{
                                    flex: 4, backgroundColor: '#3F71D7', borderTopRightRadius: 5, borderBottomRightRadius: 5,
                                    borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
                                    borderColor: '#3F71D7'
                                }}>
                                <Text style={{ color: 'white', fontSize: 16, textAlign: 'right', marginHorizontal: 'auto', }}>Sign in with Google</Text>
                            </Button>
                        </View>

                        {/* Forgot */}
                        <View style={{ paddingTop: 0, paddingBottom: 0, height: 35 }}>
                            <Button block transparent
                                onPress={() => Linking.openURL('https://app.prosperna.com/')}
                                style={{ alignSelf: 'center' }}>
                                <Text style={styles.demo_text}>Forgot Password</Text>
                            </Button>
                        </View>
                        {/* DEMO */}
                        <Button block transparent
                            onPress={() => Linking.openURL('https://www.prosperna.com/request-for-a-free-demo/')}
                            style={{}}>
                            <View style={{ alignSelf: 'center', flexDirection: 'row', height: 30 }}>
                                <Text style={[styles.demo_text, { color: '#BDC2C3' }]} >Not using Prosperna? </Text>
                                <Text style={styles.demo_text}>Book a demo today!</Text>
                            </View>
                        </Button>
                    </View>
                </View>
            );
        }

    }

}
const mapStateToProps = (state) => ({
    curState: state
});

const mapDispatchToProps = (dispatch) => ({
    dispatch: dispatch
})
export default connect(mapStateToProps)(Login);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
        backgroundColor: colors.PRIMARY_COLOR
    },
    prosperna_logo: {
        flex: Dimensions.get('screen').height <= 570 ? 1 : 2,
        alignSelf: 'center',
        height: Dimensions.get('screen').height <= 570 ? 120 : 150,
        width: Dimensions.get('screen').height <= 570 ? 120 : 150,
        resizeMode: 'contain'
    },
    prosperna_label_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    prosperna_label: {
        color: '#FFF'
    },
    login_form: {
        flex: 4,
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
    },
    buttons: {
        marginTop: 10,
    },
    text_input: {
        borderRadius: 10,
        borderColor: 'lightgray',
        marginTop: 15,
    },
    demo_text: {
        textAlign: 'center',
        fontSize: pRatioToFontSize(-0.8)
    }
});