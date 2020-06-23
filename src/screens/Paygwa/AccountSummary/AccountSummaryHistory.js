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
import moment from 'moment'
import { ActivityIndicator } from 'react-native'
import { PAYGWA_URL, DASHBOARD_URL, PAYNOW_URL } from 'react-native-dotenv';
import axios from 'react-native-axios'

class AccountSummaryHistory extends Component {
  constructor(props) {
    super(props);
    // local state
    this.state = {
      paymentData: [],
      accountId: this.props.navigation.state.params.accountId,
      isLoadingData: false,
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

  componentDidMount() {
    this.getPaymentHistory()
  }

  componentWillUnmount() { }

  getPaymentHistory() {
    this.setState({
      isLoadingData: true
    })
    debugger
    axios
      .post(
        DASHBOARD_URL + '/api/v1/payment-history',
        {
          accountId: this.state.accountId,
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )
      .then((response) => {
        console.log(response.data.result);
        this.setState({
          paymentData: response.data.result,
          isLoadingData: false
        })
        // Toast.show({
        //     text: `We've sent you a verification email.`,
        //     duration: 2500,
        //     type: 'success'
        // })


      })
      .catch((error) => {
        console.log(error);

      });
  }
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
            <CustomTextBold>Your Payment History For Account No. </CustomTextBold>
            <CustomText>{this.state.accountId}</CustomText>
          </View>
          {this.state.isLoadingData ?
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
            </View>
            :
            <Grid style={{ paddingHorizontal: 15, paddingBottom: 30 }}>
              <Row style={{ backgroundColor: colors.PRIMARY_COLOR }}>
                <Col
                  style={{
                    borderRadius: 0,
                    borderLeftWidth: 1,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: colors.DARK_GRAY,
                    padding: 20,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <CustomText style={{ color: colors.WHITE, textAlignVertical: "center", textAlign: "center" }}>
                    Payment Date
                </CustomText>
                </Col>
                <Col
                  style={{
                    borderRadius: 0,
                    borderLeftWidth: 1,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: colors.DARK_GRAY,
                    padding: 20,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <CustomText style={{ color: colors.WHITE, textAlignVertical: "center", textAlign: "center" }}>Description</CustomText>
                </Col>
                <Col
                  style={{
                    borderRadius: 0,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: colors.DARK_GRAY,
                    padding: 20,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                ><CustomText style={{ color: colors.WHITE, textAlignVertical: "center", textAlign: "center" }}>Amount</CustomText></Col>
              </Row>
              {_.isEmpty(this.state.paymentData) ?
                <Row>
                  <Col
                    style={{
                      borderRadius: 0,
                      borderLeftWidth: 1,
                      borderBottomWidth: 1,
                      borderColor: colors.DARK_GRAY,
                      padding: 20,
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                    <CustomText >

                    </CustomText>
                  </Col>
                  <Col
                    style={{
                      borderRadius: 0,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      borderBottomWidth: 1,
                      borderColor: colors.DARK_GRAY,
                      padding: 20,
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                    <CustomText >

                    </CustomText>
                  </Col>
                  <Col
                    style={{
                      borderRadius: 0,
                      borderRightWidth: 1,
                      borderBottomWidth: 1,
                      borderColor: colors.DARK_GRAY,
                      padding: 20,
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                    <CustomText >

                    </CustomText>
                  </Col>
                </Row>

                :
                _.map(this.state.paymentData, (data, index) => {


                  // checking decimal places if 0  == 0 and 12.12 == to 2 decimal places

                  var number = data.TotalAmount;

                  var countDecimals = function (value) {
                    if ((value % 1) != 0)
                      return value.toString().split(".")[1].length;
                    return 0;
                  };

                  var result = countDecimals(number)
                  var currentAmount

                  if (result === 2) {
                    currentAmount =
                      <CustomText >
                        $ {data.TotalAmount}
                      </CustomText>
                  } else if (result === 1) {
                    currentAmount =
                      <CustomText >
                        $ {data.TotalAmount}0
                  </CustomText>
                  } else {
                    currentAmount =
                      <CustomText >
                        $ {data.TotalAmount}.00
                  </CustomText>
                  }

                  return (<Row>
                    <Col
                      style={{
                        borderRadius: 0,
                        borderLeftWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: colors.DARK_GRAY,
                        padding: 20,
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                      <CustomText >
                        {data.ArrearsDate}
                      </CustomText>
                    </Col>
                    <Col
                      style={{
                        borderRadius: 0,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: colors.DARK_GRAY,
                        padding: 20,
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                      <CustomText >
                        Payment
              </CustomText>
                    </Col>
                    <Col
                      style={{
                        borderRadius: 0,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: colors.DARK_GRAY,
                        padding: 20,
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                      {currentAmount}
                    </Col>
                  </Row>)
                })
              }
            </Grid>
          }


        </Content>
        <Footer style={{ backgroundColor: colors.PRIMARY_COLOR }}>
          <FooterTab>
            <Button transparent vertical style={{ backgroundColor: colors.PRIMARY_COLOR, borderRadius: 0, borderRightWidth: 1, borderColor: colors.WHITE }} onPress={() => this.props.navigation.navigate('AccountSummaryBill', {
              accountId: this.state.accountId
            })}>
              <Icon style={{ color: colors.WHITE }} name="file" type='MaterialCommunityIcons' />
              <CustomText style={{ color: colors.WHITE }}>Bill</CustomText>
            </Button>
            <Button transparent vertical style={{ backgroundColor: colors.PRIMARY_COLOR, borderRadius: 0, borderColor: colors.WHITE }} onPress={() => this.props.navigation.navigate('AccountSummaryConsumption', {
              accountId: this.state.accountId
            })} >
              <Icon style={{ color: colors.WHITE }} name="chart-bar" type='FontAwesome5' />
              <CustomText style={{ color: colors.WHITE }}>Consumption</CustomText>
            </Button>
            <Button transparent vertical style={{ backgroundColor: colors.PRIMARY_COLOR, borderRadius: 0, borderLeftWidth: 1, borderColor: colors.WHITE }} onPress={() => this.props.navigation.navigate('AccountSummaryHistory', {
              accountId: this.state.accountId
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
export default connect(mapStateToProps)(AccountSummaryHistory);
