import React, { Component } from "react";
import {
  Container,
  Right,
  Content,
  List,
  ListItem,
  Separator,
  Text,
  Left,
  Body,
  View,
  Button,
  Icon,
  Footer, FooterTab
} from "native-base";
import { connect } from "react-redux";
import { colors, pRatioToFontSize } from "../../../utils/constants";
import _ from "lodash";
import CustomText from "../../../components/CustomText";
import CustomTextBold from "../../../components/CustomTextBold";
import OfflineNotice from "../../../components/OfflineNotice";
import CustomHeader from "../../../components/MultiCustomHeader";
import { Grid, Row, Col } from "react-native-easy-grid";

class AccountSummary extends Component {
  constructor(props) {
    super(props);
    // local state
    this.state = {
      pixelDensity: 0,
      accountDetails : this.props.navigation.state.params.accountDetails
    };
  }

  componentDidMount() { }

  componentWillUnmount() { }

  render() {
    debugger
    return (
      <Container>
        <CustomHeader
          fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
          leftButtonFunction={this.props.navigation.goBack}
          title="Account Summary"
          RightIcon={<Right />}
        />
        <OfflineNotice />
        <Content>
          <List>
            <View
              style={{
                paddingHorizontal: 80,
                borderColor: "#c9c9c9",
                borderBottomWidth: 1,
                paddingVertical: 25,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <CustomTextBold style={{ fontSize: 35 }}>${this.state.accountDetails.arrears.details.PayoffBalance}</CustomTextBold>
              <CustomTextBold style={{ paddingBottom: 10, color: '#8A8A8A' }}>
                Amount Due
              </CustomTextBold>

              <Button block success>
                <Text>Pay Now</Text>
              </Button>
            </View>

            <Row
              style={{
                paddingHorizontal: 25,
                borderColor: "#c9c9c9",
                borderBottomWidth: 1,
                paddingVertical: 13
              }}
            >
              <Col size={5}>
                <CustomText>Account ID</CustomText>
              </Col>
              <Col size={5}>
                <CustomTextBold>{this.state.accountDetails.arrears.details.AccountID}</CustomTextBold>
              </Col>
            </Row>
            <Row
              style={{
                paddingHorizontal: 25,
                borderColor: "#c9c9c9",
                borderBottomWidth: 1,
                paddingVertical: 13
              }}
            >
              <Col size={5}>
                <CustomText>Account Name</CustomText>
              </Col>
              <Col size={5}>
                <CustomTextBold>{this.state.accountDetails.arrears.details.Name}</CustomTextBold>
              </Col>
            </Row>

            <Row
              style={{
                paddingHorizontal: 25,
                borderColor: "#c9c9c9",
                borderBottomWidth: 1,
                paddingVertical: 13
              }}
            >
              <Col size={5}>
                <CustomText>Service location</CustomText>
              </Col>
              <Col size={5}>
                <CustomTextBold>{this.state.accountDetails.serviceLocation}</CustomTextBold>
              </Col>
            </Row>
            <Row
              style={{
                paddingHorizontal: 25,
                borderColor: "#c9c9c9",
                borderBottomWidth: 1,
                paddingVertical: 13
              }}
            >
              <Col size={5}>
                <CustomText>Due Date</CustomText>
              </Col>
              <Col size={5}>
                <CustomTextBold>{_.replace(this.state.accountDetails.dueDate, /\//g, '.')}</CustomTextBold>
              </Col>
            </Row>
          </List>
        </Content>
        <Footer style={{ backgroundColor: colors.PRIMARY_COLOR }}>
          <FooterTab>
            <Button transparent vertical style={{ backgroundColor: colors.PRIMARY_COLOR , borderRadius: 0, borderRightWidth: 1, borderColor: colors.WHITE }} onPress={() => this.props.navigation.navigate('AccountSummaryBill', {
              accountId: this.state.accountDetails.arrears.details.AccountID
            })}>
              <Icon style={{ color: colors.WHITE }} name="file" type='MaterialCommunityIcons' />
              <CustomText style={{ color: colors.WHITE }}>Bill</CustomText>
            </Button>
            <Button transparent vertical style={{ backgroundColor: colors.PRIMARY_COLOR , borderRadius: 0, borderColor: colors.WHITE }}  onPress={() => this.props.navigation.navigate('AccountSummaryConsumption', {
              accountId: this.state.accountDetails.arrears.details.AccountID
            })} >
              <Icon style={{ color: colors.WHITE }} name="chart-bar" type='FontAwesome5' />
              <CustomText style={{ color: colors.WHITE }}>Consumption</CustomText>
            </Button>
            <Button transparent vertical style={{ backgroundColor: colors.PRIMARY_COLOR , borderRadius: 0, borderLeftWidth: 1, borderColor: colors.WHITE }} onPress={() => this.props.navigation.navigate('AccountSummaryHistory', {
              accountId: this.state.accountDetails.arrears.details.AccountID
            })} >
              <Icon style={{ color: colors.WHITE }} name="history" type='FontAwesome5' />
              <CustomText style={{ color: colors.WHITE }}>History</CustomText>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps)(AccountSummary);
