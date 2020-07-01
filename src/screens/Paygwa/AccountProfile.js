import React, { Component } from 'react';
import { Container, Right, Content, List, ListItem, Separator, Text, Left, Body, View, Button, Icon } from 'native-base';
import { ActivityIndicator } from 'react-native'
import { connect } from 'react-redux';
import { colors, pRatioToFontSize } from '../../utils/constants';
import _ from 'lodash';
import CustomText from '../../components/CustomText';
import CustomTextBold from '../../components/CustomTextBold';
import OfflineNotice from '../../components/OfflineNotice';
import CustomHeader from '../../components/MultiCustomHeader'
import { Grid, Row, Col } from 'react-native-easy-grid';

class AccountProfile extends Component {

    constructor(props) {
        super(props);
        // local state
        this.state = {
            pixelDensity: 0,
            isLoading: false

        }
    }

    componentWillMount() {
        this.setState({
            isLoading: true
        })
        
        const userAccountDetails = this.props.dashboard.userAccountDetails;

        this.setState({
            ...this.state,
            isLoading: false,
            userAccDetails: {
                ...this.state.userAccDetails,
                fullName: userAccountDetails.fullName,
                addressLine1: userAccountDetails.addressLine1,
                city: userAccountDetails.city,
                state: userAccountDetails.state,
                postal: userAccountDetails.postal,
                country: userAccountDetails.country,
                homePhone: userAccountDetails.homePhone,
                mobilePhone: userAccountDetails.mobilePhone,
                workPhone: userAccountDetails.workPhone,
                emailAddress: userAccountDetails.emailAddress,
            }
        }, () => console.log('componentWillMount',this.state.userAccDetails))



    }

    // componentWillUnmount() {
    //     this.props.navigation.state.params.getApiData()
    // }

    updateData = userAccountDetails => {
        this.setState({
            isLoading: true
        })

        console.log('userAccountDetails', userAccountDetails)
        this.setState({
            ...this.state,
            isLoading: false,
            userAccDetails: {
                ...this.state.userAccDetails,
                fullName: userAccountDetails.fullName,
                homePhone: userAccountDetails.home,
                mobilePhone: userAccountDetails.mobile,
                workPhone: userAccountDetails.work,
                emailAddress: userAccountDetails.emailAddress,
            }
        }, () => console.log('updateData',this.state.userAccDetails))

        // some other stuff
    };

    render() {
        return (
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={this.props.navigation.goBack}
                    title="Account Profile"
                    RightIcon={<Right style={{ paddingRight: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, flex: 1 }}>
                        <Button
                            transparent style={{ paddingLeft: 0, elevation: 0 }}
                            onPress={() =>
                                this.props.navigation.navigate('EditAccountProfile', {
                                    fullName: this.state.userAccDetails.fullName,
                                    addressLine1: this.state.userAccDetails.addressLine1,
                                    city: this.state.userAccDetails.city,
                                    state: this.state.userAccDetails.state,
                                    postal: this.state.userAccDetails.postal,
                                    country: this.state.userAccDetails.country,
                                    homePhone: this.state.userAccDetails.homePhone,
                                    mobilePhone: this.state.userAccDetails.mobilePhone,
                                    workPhone: this.state.userAccDetails.workPhone,
                                    emailAddress: this.state.userAccDetails.emailAddress,
                                    updateData: this.updateData
                                })

                            } >
                            <Icon style={{ backgroundColor: colors.PRIMARY_COLOR, color: colors.WHITE, fontSize: pRatioToFontSize(+1) > 20 ? 20 : pRatioToFontSize(+1) }} name='mode-edit' type='MaterialIcons' />

                        </Button>
                    </Right>}
                />
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
                            <ListItem itemDivider style={{ paddingLeft: 25, paddingRight: 25, paddingTop: 18, paddingBottom: 18, borderColor: '#c9c9c9', borderBottomWidth: 1, backgroundColor: '#e2e6eb' }} >
                                <CustomText style={{ fontSize: 16 }} >Contact Information</CustomText>
                            </ListItem>
                            <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                                <Col size={5}>
                                    <CustomText>Home Phone</CustomText>
                                </Col>
                                <Col size={5}>
                                    <CustomTextBold>{_.get(this.state.userAccDetails, 'homePhone', 'N/A')}</CustomTextBold>
                                </Col>
                            </Row>
                            <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                                <Col size={5}>
                                    <CustomText>Mobile Phone</CustomText>
                                </Col>
                                <Col size={5}>
                                    <CustomTextBold>{_.get(this.state.userAccDetails, 'mobilePhone', 'N/A')}</CustomTextBold>
                                </Col>
                            </Row>
                            <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                                <Col size={5}>
                                    <CustomText>Work Phone</CustomText>
                                </Col>
                                <Col size={5}>
                                    <CustomTextBold>{_.get(this.state.userAccDetails, 'workPhone', 'N/A')}</CustomTextBold>
                                </Col>
                            </Row>
                            <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                                <Col size={5}>
                                    <CustomText>Email Address</CustomText>
                                </Col>
                                <Col size={5}>
                                    <CustomTextBold>{_.get(this.state.userAccDetails, 'emailAddress', 'N/A')}</CustomTextBold>
                                </Col>
                            </Row>
                        </List>
                        {/* <View style={{ paddingVertical: 35, paddingHorizontal: 80 }} >
                            <Button style={{ borderRadius: 6 }} success block onPress={() =>
                                console.log("Cancel Pressed")
                            } >
                                <CustomText uppercase={false} style={{ color: colors.WHITE, fontSize: 16 }}  >Change Password</CustomText>
                            </Button>
                        </View> */}
                    </Content>
                }
            </Container>
        );

    }

}
const mapStateToProps = (state) => ({
    dashboard: state.dashboard,
    userName: state.userState.userName,

});

const mapDispatchToProps = (dispatch) => ({

})
export default connect(mapStateToProps)(AccountProfile);

