import React, { Component } from 'react';
import { Container, Right, Content, List, ListItem, Separator, Text, Left, Body, View, Button, Icon } from 'native-base';
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

        }
    }

    async componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={this.props.navigation.goBack}
                    title="Account Profile"
                    RightIcon={<Right style={{ paddingRight: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, flex: 1 }}>
                        <Button
                            transparent style={{ paddingLeft: 0, elevation: 0 }} onPress={() =>
                                console.log('edit')} >
                            <Icon style={{ backgroundColor: colors.PRIMARY_COLOR, color: colors.WHITE, fontSize: pRatioToFontSize(+1) > 20 ? 20 : pRatioToFontSize(+1) }} name='mode-edit' type='MaterialIcons' />

                        </Button>
                    </Right>}
                />
                <OfflineNotice />
                <Content>
  
                    <List >
                        <ListItem itemDivider style={{ paddingLeft: 25, paddingRight: 25, paddingTop: 18, paddingBottom: 18, borderColor: '#c9c9c9', borderBottomWidth: 1}} >
                            <CustomText >Personal Information</CustomText>
                        </ListItem>
                        <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                            <Col size={5}>
                                <CustomText>Name</CustomText>
                            </Col>
                            <Col size={5}>
                                <CustomTextBold>Aaron Bennet </CustomTextBold>
                            </Col>
                        </Row>
                        <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                            <Col size={5}>
                                <CustomText>Account Number</CustomText>
                            </Col>
                            <Col size={5}>
                                <CustomTextBold>121231231231</CustomTextBold>
                            </Col>
                        </Row>
                        <ListItem itemDivider style={{ paddingLeft: 25, paddingRight: 25, paddingTop: 18, paddingBottom: 18, borderColor: '#c9c9c9', borderBottomWidth: 1 }} >
                            <CustomText >Contact Information</CustomText>
                        </ListItem>
                        <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                            <Col size={5}>
                                <CustomText>Premise Address</CustomText>
                            </Col>
                            <Col size={5}>
                                <CustomTextBold>PO BOX 315768 TAMUNING GUAM</CustomTextBold>
                            </Col>
                        </Row>
                        <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                            <Col size={5}>
                                <CustomText>Mailing Address</CustomText>
                            </Col>
                            <Col size={5}>
                                <CustomTextBold>United States of America</CustomTextBold>
                            </Col>
                        </Row>
                        <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                            <Col size={5}>
                                <CustomText>Home Number</CustomText>
                            </Col>
                            <Col size={5}>
                                <CustomTextBold>(671) 633-6238</CustomTextBold>
                            </Col>
                        </Row>
                        <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                            <Col size={5}>
                                <CustomText>Mobile Number</CustomText>
                            </Col>
                            <Col size={5}>
                                <CustomTextBold>(671) 633-6238</CustomTextBold>
                            </Col>
                        </Row>
                        <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                            <Col size={5}>
                                <CustomText>Fax Number</CustomText>
                            </Col>
                            <Col size={5}>
                                <CustomTextBold>(671) 633-6238</CustomTextBold>
                            </Col>
                        </Row>
                        <Row style={{ paddingHorizontal: 25, borderColor: '#c9c9c9', borderBottomWidth: 1, paddingVertical: 13 }}>
                            <Col size={5}>
                                <CustomText>Email Address</CustomText>
                            </Col>
                            <Col size={5}>
                                <CustomTextBold>nurbano@guam.net</CustomTextBold>
                            </Col>
                        </Row>
                    </List>
                </Content>
            </Container>
        );

    }

}
const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

})
export default connect(mapStateToProps)(AccountProfile);

