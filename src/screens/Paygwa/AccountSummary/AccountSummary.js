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
      pixelDensity: 0
    };
  }

  async componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <Container>
        <CustomHeader
          fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
          leftIconName="menu"
          leftButtonFunction={this.props.navigation.openDrawer}
          title="Account Summary"
          RightIcon={<Right />}
        />
        <OfflineNotice />
        <Content>
          <List>
            <ListItem
              itemDivider
              style={{
                paddingLeft: 25,
                paddingRight: 25,
                paddingTop: 18,
                paddingBottom: 18,
                borderColor: "#c9c9c9",
                borderBottomWidth: 1
              }}
            >
              <CustomText>Account Information</CustomText>
            </ListItem>
            <View
              style={{
                paddingHorizontal: 60,
                borderColor: "#c9c9c9",
                borderBottomWidth: 1,
                paddingVertical: 50,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <CustomTextBold style={{ fontSize: 30 }}>$100.00</CustomTextBold>
              <CustomTextBold style={{ paddingBottom: 10 }}>
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
                <CustomTextBold>121231231231</CustomTextBold>
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
                <CustomTextBold>Aaron Bennet </CustomTextBold>
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
                <CustomTextBold>PO BOX 315768 TAMUNING GUAM</CustomTextBold>
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
                <CustomText>Bill Date</CustomText>
              </Col>
              <Col size={5}>
                <CustomTextBold>10.01.19</CustomTextBold>
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
                <CustomTextBold>10.01.19</CustomTextBold>
              </Col>
            </Row>
          </List>
        </Content>
        <Footer style={{backgroundColor: colors.PRIMARY_COLOR}}>
          <FooterTab>
            <Button vertical style={{ borderRadius: 0 , borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.WHITE }} onPress={() => this.props.navigation.navigate('AccountSummaryBill')}>
              <Icon style={{color: colors.WHITE}} name="file" type='MaterialCommunityIcons' />
              <CustomText style={{color: colors.WHITE}}>Bill</CustomText>
            </Button>
            <Button vertical style={{ borderRadius: 0 , borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.WHITE }}>
              <Icon style={{color: colors.WHITE}} name="chart-bar" type='FontAwesome5' />
              <CustomText style={{color: colors.WHITE}}>Consumption</CustomText>
            </Button>
            <Button vertical style={{ borderRadius: 0 , borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.WHITE }}>
              <Icon style={{color: colors.WHITE}} name="history" type='FontAwesome5'/>
              <CustomText style={{color: colors.WHITE}}>History</CustomText>
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
