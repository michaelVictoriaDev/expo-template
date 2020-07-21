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
  FooterTab,
  Toast,

} from "native-base";
import { ActivityIndicator, Linking } from 'react-native'
import { connect } from "react-redux";
import { colors, pRatioToFontSize } from "../../../utils/constants";
import _ from "lodash";
import CustomText from "../../../components/CustomText";
import CustomTextBold from "../../../components/CustomTextBold";
import CustomTextMedium from "../../../components/CustomTextMedium";
import OfflineNotice from "../../../components/OfflineNotice";
import CustomHeader from "../../../components/MultiCustomHeader";
import { Grid, Row, Col } from "react-native-easy-grid";
import { TouchableHighlight } from "react-native-gesture-handler";
import { PAYGWA_URL, DASHBOARD_URL, PAYNOW_URL, GWA } from 'react-native-dotenv';
import axios from 'react-native-axios'
import moment from 'moment'

class AccountSummaryBill extends Component {
  constructor(props) {
    super(props);
    // local state
    this.state = {
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
    this.getDataBill()

  }

  componentWillUnmount() { }


  getDataBill() {
    this.setState({
      isLoadingData: true
    })
    debugger
    axios
      .post(
        DASHBOARD_URL + '/api/v1/my-bills-list',
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
          billsData: response.data.result,
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
          title="View Bill"
          RightIcon={<Right />}
        />
        <OfflineNotice />
        <Content>
          <View style={{ paddingHorizontal: 25, paddingVertical: 25 }}>
            <CustomTextBold>Your Bills For Account No. </CustomTextBold>
            <CustomText style={{ fontSize: 16 }}>{this.state.accountId}</CustomText>
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
                  <CustomText style={{ color: colors.WHITE, textAlignVertical: "center", textAlign: "center", fontSize: 16 }}>
                    Date of Bill
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
                  <CustomText style={{ color: colors.WHITE, textAlignVertical: "center", textAlign: "center", fontSize: 16 }}>Amount</CustomText>
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
                ></Col>
              </Row>
              {_.isEmpty(this.state.billsData) ?
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
                      
                    <CustomTextMedium style={{ color: colors.PRIMARY_COLOR, fontSize: 16 }} onPress={() => console.log('https://gwadev.xtendly.com/view-bill/{bill-id}')}>View</CustomTextMedium>
                  </Col>
                </Row>
                :
                _.map(this.state.billsData, (data, index) => {
                  console.log('billsData', data)

                  // checking decimal places if 0  == 0 and 12.12 == to 2 decimal places

                  var number = data.CurrentAmount;

                  var countDecimals = function (value) {
                    if ((value % 1) != 0)
                      return value.toString().split(".")[1].length;
                    return 0;
                  };

                  var result = countDecimals(number)
                  var currentAmount

                  if (result === 2) {
                    currentAmount =
                      <CustomText style={{ fontSize: 16 }} >
                        $ {data.CurrentAmount}
                      </CustomText>
                  } else if (result === 1) {
                    currentAmount =
                      <CustomText style={{ fontSize: 16 }} >
                        $ {data.CurrentAmount}0
                    </CustomText>
                  } else {
                    currentAmount =
                      <CustomText style={{ fontSize: 16 }} >
                        $ {data.CurrentAmount}.00
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
                      <CustomText style={{ fontSize: 16 }} >
                        {
                          moment(data.ArrearsDate, 'YYYY-MM-DD').format('MM.DD.YY')
                        }

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
                      {currentAmount}
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
                      <Text style={{ color: colors.PRIMARY_COLOR }} onPress={() => Linking.openURL(GWA+ `/view-bill?bill-id=${data.Parent} `)}>View</Text>
                      
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
export default connect(mapStateToProps)(AccountSummaryBill);
