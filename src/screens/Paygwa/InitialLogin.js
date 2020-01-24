import React, { Component } from 'react';
import { StyleSheet, PixelRatio, Image, Keyboard, Dimensions, Alert, Linking, Platform, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { View, Input, Item, Button, Icon, Toast } from 'native-base';
import { colors, pRatioToFontSize } from '../../utils/constants';
import { fetchLogin, signInWithGoogleAsync } from '../../actions';
import _ from 'lodash';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as AppAuth from 'expo-app-auth';
const { URLSchemes } = AppAuth;
import * as Constants from 'expo-constants';
import CustomText from '../../components/CustomText';
import CustomTextBold from '../../components/CustomTextBold';
import Offline from '../../components/OfflineNotice';

class InitialLogin extends Component {

    constructor(props) {
        super(props);
        // local state
        this.state = {
            pixelDensity: 0,
            isOnFocusInput: false,
            hidePassword: true,
            eyeColor: 'lightgray',
        }
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
        return (
            <ImageBackground source={require('../../../assets/screens/Login/background-image.png')} style={{ width: '100%', height: '100%' }} >
                <View style={[styles.container, { flex: 1, }]}>
                    {/* LOGO */}
                    {
                        this.state.isOnFocusInput ? null :
                            <Image style={styles.gpwa_logo} source={require('../../../assets/screens/Login/paygwa-logo.png')} />
                    }

                    {/* GPWA LABEL*/}

                    <View style={styles.gpwa_label_container}>
                        <CustomTextBold style={[styles.gpwa_label, { fontSize: pRatioToFontSize(0) }]}>Manage your GPA Power</CustomTextBold>
                        <CustomTextBold style={[styles.gpwa_label, { fontSize: pRatioToFontSize(0) }]}>Account Online with My Power</CustomTextBold>
                    </View>

                    {/* LOGIN FORM */}
                    <View style={[styles.login_form, { flex: this.state.isOnFocusInput ? 4 : 3, }]}>


                        {/* MANUAL SIGN IN */}
                        <Button block rounded transparent
                            style={[styles.buttons, { backgroundColor: colors.LIGHT_GREEN, borderRadius: 6, borderWidth: 0.5, height: 50 }]}
                            onPress={() =>
                                console.log('pay now')
                            }>
                            <CustomTextBold style={{ color: colors.WHITE }}>Pay Now</CustomTextBold>
                        </Button>
                        <Button block rounded transparent
                            style={[styles.buttons, { backgroundColor: colors.WHITE, borderRadius: 6, borderWidth: 0.5, height: 50 }]}
                            onPress={() =>
                                this.props.navigation.navigate("Login")
                            }>
                            <CustomTextBold style={{ color: colors.BLACK }}>Login</CustomTextBold>
                        </Button>

                    </View>
                </View>
            </ImageBackground>
        );

    }

}
const mapStateToProps = (state) => ({
    
});

const mapDispatchToProps = (dispatch) => ({
    
})
export default connect(mapStateToProps)(InitialLogin);


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
        borderRadius: 10,
        borderColor: 'lightgray',
        marginTop: 15,
    },
    demo_text: {
        textAlign: 'center',
        fontSize: pRatioToFontSize(-0.8)
    }
});