import React, { Component } from 'react';
import { PixelRatio, StyleSheet } from 'react-native';
import { Header, Left, Body, Right, Icon, Title, Button, View, Text, Badge } from 'native-base';
import { colors, pRatioToFontSize } from '../utils/constants';
import { connect } from 'react-redux';
import RF from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import _ from 'lodash'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationService from '../NavigationService';
import IconBadge from 'react-native-icon-badge';

// const HeaderWithNotif = (props) => {
class HeaderWithNotif extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <View style={{
               margin: 0,
               padding: 0
            }}
            >
            {
                this.props.notificationStore.unreadNotifs > 0 && this.props.leftIconName == 'menu' ?
                    <Button style={{ paddingLeft: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, elevation: 0 }} onPress={() => NavigationService.navigate('Notification')} >
                        <Icon  >
                            <FontAwesome
                                    style={{ color: this.props.notificationStore.unreadNotifs > 0 ? 'red' : 'white',fontSize: pRatioToFontSize(+1) > 20 ? 20 : pRatioToFontSize(+1) }} name={'bell'} />
                        </Icon>
                        <Badge style={{ color: this.props.notificationStore.unreadNotifs > 0 ? 'red' : 'red' }} >
                            <Text>{this.props.notificationStore.unreadNotifs}</Text>
                        </Badge>
                    </Button>
                    :
                        <Button style={{ paddingLeft: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, elevation: 0 }} onPress={() => NavigationService.navigate('Notification')} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                                <IconBadge
                                    MainElement={
                                        <View style={{
                                            backgroundColor: colors.PRIMARY_COLOR,
                                            // width: 33,
                                            // height: 33,
                                            marginTop: 6,
                                            marginRight: 8,

                                            position: 'relative'
                                        }} >
                                            <FontAwesome
                                                style={{
                                                    color: this.props.notificationStore.unreadNotifs > 0 ? 'red' : 'white',
                                                    fontSize: pRatioToFontSize(+1) > 20 ? 20 : pRatioToFontSize(+1)
                                                }} name={'bell'} />
                                        </View>
                                    }
                                    IconBadgeStyle={{ zIndex: 1 }}
                                    BadgeElement={
                                        this.props.notificationStore.unreadNotifs >= 1000 ?
                                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>1k+</Text>
                                            :
                                            <Text style={{ color: '#FFFFFF', fontSize: 10 }}>{this.props.notificationStore.unreadNotifs}</Text>
                                    }
                                    Hidden={this.props.notificationStore.unreadNotifs == 0}
                                />
                            </View>
                        </Button>
            }
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    userObject: state.userState.userObject,
    notificationStore: state.notificationStore.notificationObject,
})

const mapDispatchToProps = (dispatch) => ({
    getNotifCount: (userId) => dispatch(getNotifCount(userId))
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderWithNotif);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});