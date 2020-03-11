import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Right, Content } from 'native-base';
import {
    View
} from 'react-native';
import { colors, pRatioToFontSize } from '../../../../utils/constants';
import CustomText from '../../../../components/CustomText';
import CustomTextBold from '../../../../components/CustomTextBold';
import OfflineNotice from '../../../../components/OfflineNotice';
import CustomHeader from '../../../../components/MultiCustomHeader'
import { FontAwesome } from '@expo/vector-icons';
class PaymentServerFailed extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }
    componentDidMount() {

    }

    //RENDER MAIN COMPONENT
    render() {

        return (
            /* MAIN VIEW COMPONENT */
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={this.props.navigation.goBack}
                    title="Pay Now"
                    RightIcon={<Right />}
                />
                <OfflineNotice />
                <Content>
                    <View style={{
                        paddingTop: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 25
                    }}>
                        <FontAwesome
                            name='times-circle-o'
                            size={pRatioToFontSize(+5) > 50 ? 50 : pRatioToFontSize(+5)}
                            color={'#c40808'}
                        />
                        <CustomTextBold adjustsFontSizeToFit style={{ fontSize: pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1), textAlignVertical: "center", textAlign: "center" }}> Sorry, your payment was not processed.</CustomTextBold>
                        <CustomText style={{ paddingVertical: 5, paddingHorizontal: 25, fontSize: pRatioToFontSize(+1) > 20 ? 20 : pRatioToFontSize(+1), textAlignVertical: "center", textAlign: "center", }}>Please try again later.</CustomText>
                        <CustomText style={{ paddingVertical: 5, paddingHorizontal: 25, fontSize: pRatioToFontSize(+1) > 20 ? 20 : pRatioToFontSize(+1), textAlignVertical: "center", textAlign: "center", }}>If you repeatedly see this message, complete your payment by contacting GWA directly.</CustomText>
                    </View>
                    
                    <View style={{
                        paddingVertical: 25, paddingHorizontal: 30,
                    }}>
                        <Button block rounded transparent
                            style={{ marginTop: 25, backgroundColor: colors.PRIMARY_COLOR, borderRadius: 6, borderWidth: 0.5, height: 50 }}
                            onPress={() => {
                                this.props.navigation.navigate('MyAccounts', {
                                    onGoBack: () => this.onRefresh
                                })
                            }
                            }>
                            <CustomText style={{ color: colors.WHITE }}>Back to Home</CustomText>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, {

})(PaymentServerFailed);
