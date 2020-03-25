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
  Footer,
  FooterTab
} from "native-base";
import { connect } from "react-redux";
import { colors, pRatioToFontSize } from "../../../utils/constants";
import _ from "lodash";
import CustomText from "../../../components/CustomText";
import CustomTextBold from "../../../components/CustomTextBold";
import OfflineNotice from "../../../components/OfflineNotice";
import CustomHeader from "../../../components/MultiCustomHeader";
import { Grid, Row, Col } from "react-native-easy-grid";
import { TouchableHighlight } from "react-native-gesture-handler";

class AccountSummaryHistory extends Component {
  constructor(props) {
    super(props);
    // local state
    this.state = {
      pixelDensity: 0,
      data: [
        {
          dateOfBill: "10.01.19",
          amount: "500.00"
        },
        {
          dateOfBill: "10.01.19",
          amount: "400.00"
        },
        {
          dateOfBill: "10.01.19",
          amount: "600.00"
        },
        {
          dateOfBill: "10.01.19",
          amount: "570.00"
        }
      ]
    };
  }

  async componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <Container>
        <CustomHeader
          fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
          leftButtonFunction={() => this.props.navigation.navigate('AccountSummary')}
          title="Payment History"
          RightIcon={<Right />}
        />
        <OfflineNotice />
        <Content>
          <View style={{ paddingHorizontal: 25, paddingVertical: 25 }}>
            <CustomTextBold>Your Bills For Account No. </CustomTextBold>
            <CustomText>1231231313 </CustomText>
          </View>

          <Grid style={{ paddingHorizontal: 15 }}>
            <Text>123</Text>
          </Grid>
        </Content>
        <Footer style={{ backgroundColor: colors.PRIMARY_COLOR }}>
          <FooterTab>
            <Button
              onPress={() => this.props.navigation.navigate('AccountSummaryBill')}
              vertical
              style={{
                borderRadius: 0,
                borderRightWidth: 1,
                borderColor: colors.WHITE
              }}
            >
              <Icon
                style={{ color: colors.WHITE }}
                name="file"
                type="MaterialCommunityIcons"
              />
              <CustomText style={{ color: colors.WHITE }}>Bill</CustomText>
            </Button>
            <Button
              vertical
              style={{
                borderRadius: 0,
                borderColor: colors.WHITE
              }}
            >
              <Icon
                style={{ color: colors.WHITE }}
                name="chart-bar"
                type="FontAwesome5"
              />
              <CustomText style={{ color: colors.WHITE }}>
                Consumption
              </CustomText>
            </Button>
            <Button
              vertical
              style={{
                borderRadius: 0,
                borderLeftWidth: 1,
                borderColor: colors.WHITE
              }}
            >
              <Icon
                style={{ color: colors.WHITE }}
                name="history"
                type="FontAwesome5"
              />
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
export default connect(mapStateToProps)(AccountSummaryHistory);
