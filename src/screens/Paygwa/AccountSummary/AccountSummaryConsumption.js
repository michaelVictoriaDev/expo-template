import React, { Component, Fragment } from "react";
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
  FooterTab, Form, Picker, Item
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

import { ScrollView, ActivityIndicator } from 'react-native';

import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryTheme,
  VictoryLabel,
  VictoryTooltip,
  VictoryZoomContainer,
} from 'victory-native';
import { PAYGWA_URL, DASHBOARD_URL, PAYNOW_URL } from 'react-native-dotenv';
import axios from 'react-native-axios'


class AccountSummaryConsumption extends Component {
  constructor(props) {
    super(props);

    // local state
    this.state = {
      accountId: this.props.navigation.state.params.accountId,
      isLoadingData: false,
      selected: 0,
      pixelDensity: 0,

    };
  }

  componentWillMount() {
    this.fetchMonthlyBillConsumption()

  }

  componentWillUnmount() { }

  fetchMonthlyBillConsumption() {
    this.setState({
      isLoadingData: true
    })
    axios
      .post(
        DASHBOARD_URL + '/api/v1/user-consumption-chart',
        {
          accountId: this.props.navigation.state.params.accountId,
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )
      .then((response) => {
        console.log('consumption', response.data.result);

        const isHaveConsumptionChart = response.data.result.status;
        if (isHaveConsumptionChart === 'True') {
          const data = response.data.result.data;
          var consumptionDetails = {};
          var months = [];
          var amounts = [];
          var totalWaters = [];
          for (var count = 0; count < data.length; count++) {
            var startDate = (data[count][0].startReadDate).slice(5, 10);
            var endDate = (data[count][0].endReadDate).slice(5, 10);
            var amount = (data[count][0].billSegmentCurrentAmount);
            var totalWater = (Math.round(data[count][0].measuredQuantity));
            months.push([(startDate.split("-")[0] + "/" + startDate.split("-")[1]), ' - ', (endDate.split("-")[0] + "/" + endDate.split("-")[1])])
            amounts.push((amount > 0) ? amount : 0)
            totalWaters.push((totalWater > 0) ? totalWater : 0)
          }
          consumptionDetails.months = months;
          consumptionDetails.amounts = amounts;
          consumptionDetails.totalWater = totalWaters;



        }


        console.log('result', consumptionDetails)
        debugger

        var array = consumptionDetails.totalWater
        var sum = _.sum(array) / array.length

        var roundOffValue = _.round(sum)



        this.setState({
          numberOfGallons: roundOffValue,
          numberOfMonths: consumptionDetails.months.length,
          consumptionDetails: consumptionDetails,

          isLoadingData: false
        })
        console.log('consumptionDetails', consumptionDetails)
        // Toast.show({
        //     text: `We've sent you a verification email.`,
        //     duration: 2500,
        //     type: 'success'
        // })


      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isLoadingData: false
        })

      });
  }



  render() {

    const data = [
      {
        quarter: 1,
        earnings: 13000,
      },
      {
        quarter: 2,
        earnings: 16500,
      },
      {
        quarter: 3,
        earnings: 14250,
      },
      {
        quarter: 4,
        earnings: 19000,
      },
      {
        quarter: 5,
        earnings: 13000,
      },
      {
        quarter: 6,
        earnings: 16500,
      },
      {
        quarter: 7,
        earnings: 14250,
      },
      {
        quarter: 8,
        earnings: 19000,
      },
      {
        quarter: 9,
        earnings: 13000,
      },
      {
        quarter: 10,
        earnings: 16500,
      },
      {
        quarter: 11,
        earnings: 14250,
      },
      {
        quarter: 12,
        earnings: 19000,
      },
    ];

    return (
      <Container>
        <CustomHeader
          fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
          leftButtonFunction={() => this.props.navigation.navigate('AccountSummary')}
          title="Consumption"
          RightIcon={<Right />}
        />
        <OfflineNotice />
        <Content>
          <View style={{ paddingHorizontal: 25, paddingVertical: 25 }}>
            <CustomTextBold>Your Monthly Consumption Chart </CustomTextBold>
            <CustomText></CustomText>

            {
              this.state.isLoadingData ?
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
                </View>

                :
                <React.Fragment>
                  <CustomText style={{ color: '#8A8A8A', textAlignVertical: "center", textAlign: "center" }}>
                    Average Usage of {this.state.consumptionDetails.months.length} Months
            </CustomText>
                  <CustomText style={{ fontSize: 35, textAlignVertical: "center", textAlign: "center" }}>{this.state.numberOfGallons} Gallons</CustomText>
                  <Form style={{ paddingVertical: 10 }}>
                    <Item regular picker style={{ borderRadius: 6 }}>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.selected}
                        onValueChange={(value) =>
                          this.setState({
                            selected: value
                          })}
                      >
                        <Picker.Item label="Monthly Water Consumption" value="0" />
                        <Picker.Item label="Monthly Bill Amount" value="1" />
                      </Picker>
                    </Item>
                  </Form>
                  <ScrollView

                    persistentScrollbar
                    showsHorizontalScrollIndicator
                    // contentContainerStyle={{ flex: 1 }}
                    horizontal={true}>
                    <VictoryChart
                      width={1000}
                      // responsive={false}
                      theme={VictoryTheme.material}
                      // domainPadding will add space to each side of VictoryBar to
                      // prevent it from overlapping the axis

                      //  containerComponent={
                      //     <VictoryZoomContainer
                      //     allowPan={false}
                      //       allowZoom={false} />
                      //      }

                      labelComponent={<VictoryTooltip renderInPortal={false} />}
                      domainPadding={{ x: 15 }}>
                      <VictoryAxis
                        responsive={false}
                        style={{
                          ticks: {
                            padding: 12,
                          },
                          tickLabels: {
                            fontSize: 13,
                          },
                        }}
                        tickLabelComponent={
                          <VictoryLabel
                            padding={13}
                            angle={-60}
                            verticalAnchor="end"
                            textAnchor="middle"
                          />
                        }
                        // tickValues specifies both the number of ticks and where
                        // they are placed on the axis
                        tickValues={[this.state.consumptionDetails.months.length]}
                        tickFormat={this.state.consumptionDetails.months}
                      />
                      <VictoryAxis
                        dependentAxis
                        // tickFormat specifies how ticks should be displayed
                        tickFormat={x => `$${x / 14000}k`}
                      />
                      <VictoryBar
                        data={data}
                        x="quarter"
                        y="earnings"
                        style={{
                          data: { fill: '#3F71D7', width: 10 },
                          parent: { border: '1px solid #ccc' },
                        }}
                      />
                    </VictoryChart>
                  </ScrollView>
                </React.Fragment>
            }

          </View>

          <View style={{ padding: 30 }} />

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
export default connect(mapStateToProps)(AccountSummaryConsumption);
