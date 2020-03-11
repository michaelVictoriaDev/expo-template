import React, { Component } from 'react';
import { StyleSheet, PixelRatio, Image, Keyboard, Dimensions, Linking, ImageBackground, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { View, Input, Item, Button, Toast } from 'native-base';
import { colors, pRatioToFontSize } from '../../utils/constants';
import { fetchLogin } from '../../actions';
import _ from 'lodash';
import * as AppAuth from 'expo-app-auth';
import CustomText from '../../components/CustomText';
import CustomTextBold from '../../components/CustomTextBold';
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

        if (this.props.payGwaUserDetails.userState.isLoginLoading) {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator size="large" color ={colors.PRIMARY_COLOR} />
                </View>
            )
        } else {

            return (
                <ImageBackground source={require('../../../assets/back-ground.png')} style={{ width: '100%', height: '100%' }} >
                    <View style={[styles.container, { flex: 1, }]}>
                        <Offline />

                        {/* LOGO */}
                        {
                            this.state.isOnFocusInput ? null :
                                <Image style={styles.gpwa_logo} source={require('../../../assets/screens/Login/paygwa-logo.png')} />
                        }

                        {/* PROSPERNA LABEL*/}

                        <View style={styles.gpwa_label_container}>
                            <CustomTextBold style={[styles.gpwa_label, { fontSize: pRatioToFontSize(0) }]}>Log in to your Account</CustomTextBold>
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
                                {/* <Icon name='eye' onPress={() => {
                                //TOGGLE EYE COLOR
                                if (this.state.hidePassword == true) {
                                    this.setState({ eyeColor: 'black' })
                                } else {
                                    this.setState({ eyeColor: 'lightgray' })
                                }
                                this.setState({ hidePassword: !(this.state.hidePassword) })
                            }}
                                style={{ color: this.state.eyeColor, }} /> */}
                            </Item>

                            {/* MANUAL SIGN IN */}
                            <Button block rounded transparent
                                style={[styles.buttons, { backgroundColor: colors.LIGHT_GREEN, borderRadius: 6, borderWidth: 0.5, height: 50 }]}
                                onPress={() =>
                                    // this.manualLogin(this.state.emailAdd,this.state.password)
                                    this.manualLogin('gdoe', 'GDOE2018')
                                    // this.manualLogin('Relyant', 'Relyant01')
                                }>
                                <CustomText style={{ color: colors.WHITE }}>Login</CustomText>
                            </Button>


                            {/* Forgot */}
                            <View style={{ paddingTop: 0, paddingBottom: 0, height: 70 }}>
                                <Button block transparent
                                    onPress={() => Linking.openURL('https://app.prosperna.com/')}
                                    style={{ alignSelf: 'center' }}>
                                    <CustomText style={[styles.demo_text, { color: colors.WHITE }]}>Forgot your </CustomText>
                                    <CustomText style={[styles.demo_text, { color: colors.WHITE, textDecorationLine: 'underline' }]}> Password?</CustomText>
                                </Button>
                            </View>
                            {/* DEMO */}
                            <Button block transparent
                                onPress={() => this.props.navigation.navigate('SignUpCreateAccount'
                                    )
                                    }
                                style={{}}>
                                <View style={{ alignSelf: 'center', flexDirection: 'row', height: 30 }}>
                                    <CustomText style={[styles.demo_text, { color: colors.WHITE }]} >Don't have an account?</CustomText>
                                    <CustomText style={[styles.demo_text, { color: colors.WHITE, textDecorationLine: 'underline' }]}>Sign Up Now </CustomText>
                                </View>
                            </Button>
                        </View>
                    </View>
                </ImageBackground>
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
        paddingTop: 100,
        justifyContent: 'center',
        // backgroundColor: colors.PRIMARY_COLOR
    },
    gpwa_logo: {
        alignSelf: 'center',
        height: Dimensions.get('screen').height <= 570 ? 120 : 150,
        width: Dimensions.get('screen').height <= 570 ? 120 : 150,
        resizeMode: 'contain'
    },
    gpwa_label_container: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gpwa_label: {
        color: '#FFF'
    },
    login_form: {
        flex: 4,
        paddingHorizontal: 35,
    },
    buttons: {
        marginTop: 25,
    },
    text_input: {
        backgroundColor: colors.WHITE,
        borderRadius: 6,
        borderColor: 'lightgray',
        marginTop: 25,
    },
    demo_text: {
        textAlign: 'center',
        fontSize: pRatioToFontSize(-0.5)
    }
});