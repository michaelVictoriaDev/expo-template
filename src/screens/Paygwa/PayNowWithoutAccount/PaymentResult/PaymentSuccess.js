import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Content } from 'native-base';
import {
    View, Alert
} from 'react-native';
import {
    searchString
} from '../../../../actions/userMyAccounts';
import { colors, pRatioToFontSize } from '../../../../utils/constants';
import CustomText from '../../../../components/CustomText';
import CustomTextBold from '../../../../components/CustomTextBold';
import OfflineNotice from '../../../../components/OfflineNotice';
import CustomHeader from '../../../../components/MultiCustomHeader'
import { Row, Col } from 'react-native-easy-grid';
import { FontAwesome } from '@expo/vector-icons';
import _ from 'lodash';
import NavigationService from '../../../../NavigationService';

// download pdf stacks
import { captureRef } from 'react-native-view-shot';
import * as Permissions from 'expo-permissions';
import CameraRoll from "@react-native-community/cameraroll";
import * as MediaLibrary from 'expo-media-library';



class PaymentSuccess extends Component {
    constructor(props) {
        super(props);

        this.state = {
            paymentResult: this.props.navigation.state.params.paymentResult,
            accountSummary: this.props.navigation.state.params.accountSummary,
            event: this.props.navigation.state.params.event,
            cameraRollUri: null,
            show: true
        }
    }
    componentDidMount() {
        Permissions.askAsync(Permissions.CAMERA_ROLL);
    }

    _saveToCameraRollAsync = async () => {
        try {
            let result = await captureRef(this.pageView, {
                format: 'png',
                quality: 0.9
            });

            //   let saveResult = await CameraRoll.saveToCameraRoll(result, 'photo');
            console.log(result);
            const asset = await MediaLibrary.createAssetAsync(result);
            MediaLibrary.createAlbumAsync('GWA', asset)
                .then(() => {
                    console.log('Album created!');
                    Alert.alert('Image has been saved')
                    this.setState({ cameraRollUri: asset });
                })
                .catch(error => {
                    Alert.alert(`Opps there's something wrong`)
                    console.log('err', error);
                });

        }
        catch (snapshotError) {
            console.error(snapshotError);
        }
    };

    getFieldValue = (str, result) => {
        return this.props.searchString(str, result)
    }

    // openShareDialogAsync = () => {
    //     captureRef(this._shareViewContainer, {
    //         snapshotContentContainer: true,
    //     }).then(
    //         uri => {
    //             console.log('Snapshot uri', uri);
    //             // https://github.com/expo/expo/issues/6920#issuecomment-580966657
    //             Sharing.shareAsync('file://' + uri);
    //         },
    //         error => console.error('Oops, snapshot failed', error)
    //     );
    // }


    //RENDER MAIN COMPONENT
    render() {
        const result = this.state.paymentResult
        let today = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let date = today.getDate() + ' ' + months[today.getMonth()] + ' ' + today.getFullYear();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date + ' ' + time;
        return (
            /* MAIN VIEW COMPONENT */
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={() => NavigationService.navigate('Login')}
                    title="Pay Now"
                    RightIcon={<Right />}
                />
                <OfflineNotice />
                <Content >
                    <View>
                        <View
                            collapsable={false}
                            ref={view => {
                                this.pageView = view;
                            }}
                            style={{
                                backgroundColor: '#ffff'
                            }}
                        >
                            <View

                                style={{
                                    paddingTop: 25,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                <FontAwesome
                                    name='check-circle'
                                    size={60}
                                    color={colors.LIGHT_GREEN}
                                />
                                <CustomText />
                                <CustomText adjustsFontSizeToFit style={{ fontSize: 24 }}> Approved! Thank you!</CustomText>
                            </View>
                            <Row style={{
                                paddingVertical: 20, paddingHorizontal: 25,
                            }}
                            >
                                <Col size={50}>
                                    <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Card & Amount:</CustomText>
                                    <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Cardholder Name:</CustomText>
                                    <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Card Number:</CustomText>
                                    <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Date/Time:</CustomText>
                                    <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Reference #:</CustomText>
                                    <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Authorization #:</CustomText>
                                    <CustomText numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 16, paddingBottom: 10, color: '#666666' }}>Receipt #.:</CustomText>

                                </Col>
                                <Col size={50} style={{ alignItems: 'flex-end' }}>
                                    <CustomText adjustsFontSizeToFit style={{ fontSize: 16, paddingBottom: 10 }}> {result.data.CardType + " $ " + parseFloat(Math.round(result.data.DollarAmount * 100) / 100).toFixed(2) + " " + result.data.Currency}</CustomText>
                                    <CustomText adjustsFontSizeToFit style={{ fontSize: 16, paddingBottom: 10 }}> {result.data.CardHoldersName}</CustomText>
                                    <CustomText adjustsFontSizeToFit style={{ fontSize: 16, paddingBottom: 10 }}> {result.data.Card_Number}</CustomText>
                                    <CustomText adjustsFontSizeToFit style={{ fontSize: 16, paddingBottom: 10 }}>{" " + dateTime}</CustomText>
                                    <CustomText adjustsFontSizeToFit style={{ fontSize: 16, paddingBottom: 10 }}>{this.getFieldValue("REFERENCE #", result)} </CustomText>
                                    <CustomText adjustsFontSizeToFit style={{ fontSize: 16, paddingBottom: 10 }}>{this.getFieldValue("AUTHOR. #", result)}</CustomText>
                                    <CustomText adjustsFontSizeToFit style={{ fontSize: 16 }}>{this.getFieldValue("TRANS. REF.", result)}</CustomText>


                                </Col>

                            </Row>
                            <View style={{
                                borderBottomWidth: .6,
                                borderColor: '#666666',
                                marginLeft: 15,
                                marginRight: 15,
                                marginTop: 15,
                                marginBottom: 20
                                // marginRight: 15 ,


                            }} />
                            <View style={{

                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <CustomTextBold adjustsFontSizeToFit style={{ fontSize: 18 }}>Accounts Paid</CustomTextBold>
                            </View>
                            <Row style={{
                                paddingVertical: 20, paddingHorizontal: 30,
                            }}
                            >
                                <Col size={50}>
                                    {_.map(this.state.accountSummary, (item, index) => {
                                        debugger
                                        return (
                                            <CustomText key={index} adjustsFontSizeToFit style={{ fontSize: 16, color: '#333333' }}>{item.arrears.details.AccountID}</CustomText>
                                        )
                                    })
                                    }
                                    {/* <CustomTextBold adjustsFontSizeToFit style={{ paddingTop: 10, fontSize: 18, color: '#333333' }}>Total Amount</CustomTextBold> */}
                                </Col>
                                <Col size={50} style={{ alignItems: 'flex-end' }}>

                                    <CustomText adjustsFontSizeToFit style={{ fontSize: 16 }}>{"$ " + parseFloat(Math.round(result.data.DollarAmount * 100) / 100).toFixed(2)}</CustomText>
                                </Col>

                            </Row>
                        </View>
                        <View style={{
                            paddingBottom: 40, paddingHorizontal: 60,
                        }}>
                            <Button block rounded transparent
                                style={{ marginTop: 25, backgroundColor: '#4caf50', borderRadius: 6, borderWidth: 0.5, height: 50 }}
                                onPress={() => {
                                    // this.props.navigation.navigate('MyAccounts')
                                    if (this.state.event == 'fromAccountSummary') {
                                        this.props.navigation.pop(4)
                                    } else {
                                        NavigationService.navigate('Login')

                                    }
                                }
                                }>
                                <CustomText style={{ color: colors.WHITE, fontSize: 16 }}>{this.state.event == 'fromAccountSummary' ? 'Back to Dashboard' : 'Back To Login'}</CustomText>
                            </Button>


                            <Button style={{ borderRadius: 6 }} transparent block onPress={this._saveToCameraRollAsync} >
                                <CustomText uppercase={false} style={{ color: colors.GRAYISHRED, fontSize: 12, textDecorationLine: 'underline' }} >Download Image Copy</CustomText>
                            </Button>
                        </View>
                    </View>

                </Content >
            </Container >
        )
    }
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, {
    searchString
})(PaymentSuccess);
