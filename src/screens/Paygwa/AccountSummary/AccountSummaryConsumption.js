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
import Accordian from '../../../components/CustomizeAccordion';
import { ScrollView } from 'react-native';


class AccountSummaryConsumption extends Component {
  constructor(props) {
    super(props);
    // local state
    this.state = {
      pixelDensity: 0,
      consumption: [
        {
           "accountNumber":2389982736234,
           "value":300,
           "receiptNo":"0912312312313123",
           "payDate":"10.09.19",
           "padingBy":"Online User"
        },
        {
            "accountNumber":2389982736234,
            "value":300,
            "receiptNo":"0912312312313123",
            "payDate":"10.09.19",
            "padingBy":"Online User1"
         },
         {
            "accountNumber":2389982736234,
            "value":300,
            "receiptNo":"0912312312313123",
            "payDate":"10.09.19",
            "padingBy":"Online User2"
         },
         {
            "accountNumber":2389982736234,
            "value":300,
            "receiptNo":"0912312312313123",
            "payDate":"10.09.19",
            "padingBy":"Online User3"
         },
         {
            "accountNumber":2389982736234,
            "value":300,
            "receiptNo":"0912312312313123",
            "payDate":"10.09.19",
            "padingBy":"Online User4"
         }
     ]
    };
  }

  async componentDidMount() {}

  componentWillUnmount() {}


  renderAccordians = () => {
    const items = [];
    for (const [key, item] of this.state.consumption.entries()) {
        items.push(
      
            <Accordian 
                key={key}
                data={item}
            />
       
        );
    }
    return items;
}


  render() {
    return (
      <Container>
        <CustomHeader
          fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
          leftButtonFunction={() => this.props.navigation.navigate('AccountSummary')}
          title="Payment Consumption"
          RightIcon={<Right />}
        />
        <OfflineNotice />
        <Content>
          <View>
            <ScrollView>
                {this.renderAccordians()}                     
            </ScrollView>
          </View>
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
            onPress={() => this.props.navigation.navigate('AccountSummaryConsumption')}
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
            onPress={() => this.props.navigation.navigate('AccountSummaryHistory')}
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
export default connect(mapStateToProps)(AccountSummaryConsumption);
