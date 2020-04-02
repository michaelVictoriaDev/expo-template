import React, { Component } from 'react';
import { Container, Right, Content, Item, ListItem, Separator, Text, Left, Body, View, Button, Icon, Form, Picker, Footer, FooterTab } from 'native-base';
import { KeyboardAvoidingView , TextInput } from 'react-native'
import { connect } from 'react-redux';
import { colors, pRatioToFontSize } from '../../utils/constants';
import _ from 'lodash';
import CustomText from '../../components/CustomText';
import CustomTextBold from '../../components/CustomTextBold';
import OfflineNotice from '../../components/OfflineNotice';
import CustomHeader from '../../components/MultiCustomHeader'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import { Grid, Row, Col } from 'react-native-easy-grid';



class Survey extends Component {

    constructor(props) {
        super(props);
        // local state
        this.state = {
            pixelDensity: 0,
            surveyChoice:[{
                label: 'Excellent'
            }, {
                label: 'Very Good'
            }, {
                label: 'Good'
            }, {
                label: 'Fair'
            }, {
                label: 'Very Fair'
            }],
            survey1: undefined,
            survey2: undefined,
            survey3: undefined,
            survey4: undefined,
            survey5: undefined,
            survey6: undefined,
            survey7: undefined,
            survey8: undefined,
            survey9: undefined,
            text:''

        }
    }

    async componentDidMount() {

    }

    componentWillUnmount() {

    }


    onValueChange1(value: string) {
        this.setState({
            survey1: value
        });
    }

    onValueChange2(value: string) {
        this.setState({
            survey2: value
        });
    }

    onValueChange3(value: string) {
        this.setState({
            survey3: value
        });
    }
    onValueChange4(value: string) {
        this.setState({
            survey4: value
        });
    }
    onValueChange5(value: string) {
        this.setState({
            survey5: value
        });
    }
    onValueChange6(value: string) {
        this.setState({
            survey6: value
        });
    }
    onValueChange7(value: string) {
        this.setState({
            survey7: value
        });
    }
    onValueChange8(value: string) {
        this.setState({
            survey8: value
        });
    }
    onValueChange9(value: string) {
        this.setState({
            survey9: value
        });
    }


    render() {
        debugger    
        const surveyChoice = [{
            label: 'Excellent'
        }, {
            label: 'Very Good'
        }, {
            label: 'Good'
        }, {
            label: 'Fair'
        }, {
            label: 'Very Fair'
        }]
        return (
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={this.props.navigation.goBack}
                    title="Survey"
                    RightIcon={<Right style={{ paddingRight: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, flex: 1 }} />
                    }
                />
                <OfflineNotice />
                <Content>
                <KeyboardAvoidingView
                                behavior="padding"
                            >
                    <View style={{ paddingHorizontal: 25, paddingVertical: 25 }}>

                        <CustomTextBold style={{ fontSize: 18, paddingBottom: 24 }}>Survey</CustomTextBold>
                        <CustomTextBold style={{ fontSize: 18, paddingBottom: 14 }}>Hafa Adai! We hope you’re finding our online service uesful.</CustomTextBold>
                        <CustomText style={{ paddingBottom: 14 }} >In our effort to better serve YOU, we ask you to take part in a quick survey which will take approximately 3 minutes to complete. Your responses are treated with the strictest confidence and will be used within GWA to improve the quality of our service delivery.</CustomText>
                        <View style={{
                            borderColor: "#c9c9c9",
                            borderBottomWidth: 1
                        }} />

                        <CustomText style={{ paddingVertical: 14 }}>In the last 90 days have you had contact with GWA's Operations Personnel (crew fixing leaks or making repairs) If yes, please rate your experience.</CustomText>
                        <Form style={{ paddingBottom: 14 }} full>
                            <Item picker style={{
                                borderColor: "#c9c9c9",
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderRadius: 5

                            }}>
                                <Picker
                                    
                                    mode="dropdown"
                                    // iosIcon={<Icon name="arrow-down" />}
                                    placeholder="                                                                       "
                                    placeholderStyle={{ color: '#bfc6ea' }}
                                    // placeholderIconColor="#007aff"
                                    // iosIcon={<Icon name="arrow-down" />}
                                    selectedValue={this.state.survey1}
                                    onValueChange={this.onValueChange1.bind(this)}
                                >
                                    <Picker.Item label={'                                                                       '} value={'                                                                       '} />
                                    {_.map(this.state.surveyChoice, (data, index)=> {
                                        return(
                                            <Picker.Item label={data.label} value={data.label} />
                                        )
                                    })
                                    }

                                </Picker>
                            </Item>

                        </Form>

                        <CustomText style={{ paddingBottom: 14 }}>In the last 90 days have you had contact with GWA's Customer Service Representatives? If yes, please rate your experience.</CustomText>
                        <Form style={{ paddingBottom: 14 }} full>
                            <Item picker style={{
                                borderColor: "#c9c9c9",
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderRadius: 5

                            }}>
                                <Picker
                                    style={{ width: undefined }}
                                    mode="dropdown"
                                    placeholder="                                                                       "
                                    // iosIcon={<Icon name="arrow-down" />}
                                    selectedValue={this.state.survey2}
                                    onValueChange={this.onValueChange2.bind(this)}
                                >
                                    <Picker.Item label={'                                                                       '} value={'                                                                       '} />
                                    {_.map(this.state.surveyChoice, (data, index)=> {
                                        return(
                                            <Picker.Item label={data.label} value={data.label} />
                                        )
                                    })
                                    }

                                </Picker>
                            </Item>

                        </Form>

                        <CustomText style={{ paddingBottom: 14 }}>In the last 90 days have you had contact with GWA's 24/7 Water Emergency Dispatchers? If yes, please rate your experience.</CustomText>
                        <Form style={{ paddingBottom: 14 }} full>
                            <Item picker style={{
                                borderColor: "#c9c9c9",
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderRadius: 5

                            }}>
                                <Picker
                                    style={{ width: undefined }}
                                    mode="dropdown"
                                    placeholder="                                                                       "
                                    // iosIcon={<Icon name="arrow-down" />}
                                    selectedValue={this.state.survey3}
                                    onValueChange={this.onValueChange3.bind(this)}
                                >
                                    <Picker.Item label={'                                                                       '} value={'                                                                       '} />
                                    {_.map(this.state.surveyChoice, (data, index)=> {
                                        return(
                                            <Picker.Item label={data.label} value={data.label} />
                                        )
                                    })
                                    }

                                </Picker>
                            </Item>

                        </Form>


                        <CustomText style={{ paddingBottom: 14 }}>In the last 90 days have you had contact with GWA's Call Center Representatives? If yes, please rate your experience.</CustomText>
                        <Form style={{ paddingBottom: 14 }} full>
                            <Item picker style={{
                                borderColor: "#c9c9c9",
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderRadius: 5

                            }}>
                                <Picker
                                    style={{ width: undefined }}
                                    mode="dropdown"
                                    placeholder="                                                                       "
                                    // iosIcon={<Icon name="arrow-down" />}
                                    selectedValue={this.state.survey4}
                                    onValueChange={this.onValueChange4.bind(this)}
                                >
                                    <Picker.Item label={'                                                                       '} value={'                                                                       '} />
                                    {_.map(this.state.surveyChoice, (data, index)=> {
                                        return(
                                            <Picker.Item label={data.label} value={data.label} />
                                        )
                                    })
                                    }

                                </Picker>
                            </Item>

                        </Form>

                        <CustomText style={{ paddingBottom: 14 }}>In the last 90 days have you had contact with other GWA Personnel not mentioned above? Please indicate what GWA unit/section you were in contact with and rate your experience.</CustomText>
                      

                        <CustomText style={{ paddingBottom: 14 }}>How do you like to get information about GWA ?</CustomText>
                        <Form style={{ paddingBottom: 14 }} full>
                            <Item picker style={{
                                borderColor: "#c9c9c9",
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderRadius: 5,
                               

                            }}>


                                <TextInput
                                placeholder='Enter Text'
                                    style={{
                                    width: '100%',
                                    padding: 10,
                                    minHeight: 50,
                                    }}
                                    multiline
                                    onChangeText={text => this.setState({ text })}
                                    value={this.state.text}
                                />
                            </Item>
                        </Form>

                        <CustomText style={{ paddingBottom: 14 }}>GWA's Mission Statement is to provide outstanding customer service by delivering excellent water and wastewater services in a safe, reliable, responsible, and cost effective manner. In your opinion, how well does GWA meet its mission?</CustomText>
                        <Form style={{ paddingBottom: 14 }} full>
                            <Item picker style={{
                                borderColor: "#c9c9c9",
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderRadius: 5

                            }}>
                                <Picker
                                    style={{ width: undefined }}
                                    mode="dropdown"
                                    placeholder="                                                                       "
                                    // iosIcon={<Icon name="arrow-down" />}
                                    selectedValue={this.state.survey6}
                                    onValueChange={this.onValueChange6.bind(this)}
                                >
                                    <Picker.Item label={'                                                                       '} value={'                                                                       '} />
                                    {_.map(this.state.surveyChoice, (data, index)=> {
                                        return(
                                            <Picker.Item label={data.label} value={data.label} />
                                        )
                                    })
                                    }

                                </Picker>
                            </Item>

                        </Form>


                        <CustomText style={{ paddingBottom: 14 }}>When you receive your water bill is it helpful and informative?</CustomText>
                        <Form style={{ paddingBottom: 14 }} full>
                            <Item picker style={{
                                borderColor: "#c9c9c9",
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderRadius: 5

                            }}>
                                <Picker
                                    style={{ width: undefined }}
                                    mode="dropdown"
                                    placeholder="                                                                       "
                                    // iosIcon={<Icon name="arrow-down" />}
                                    selectedValue={this.state.survey7}
                                    onValueChange={this.onValueChange7.bind(this)}
                                >
                                    <Picker.Item label={'                                                                       '} value={'                                                                       '} />
                                    {_.map(this.state.surveyChoice, (data, index)=> {
                                        return(
                                            <Picker.Item label={data.label} value={data.label} />
                                        )
                                    })
                                    }

                                </Picker>
                            </Item>

                        </Form>

                        <CustomText style={{ paddingBottom: 14 }}>Do you drink tap water or bottled water ?</CustomText>
                        <Form style={{ paddingBottom: 14 }} full>
                            <Item picker style={{
                                borderColor: "#c9c9c9",
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderRadius: 5

                            }}>
                                <Picker
                                    style={{ width: undefined }}
                                    mode="dropdown"
                                    placeholder="                                                                       "
                                    // iosIcon={<Icon name="arrow-down" />}
                                    selectedValue={this.state.survey8}
                                    onValueChange={this.onValueChange8.bind(this)}
                                >
                                    <Picker.Item label={'                                                                       '} value={'                                                                       '} />
                                    {_.map(this.state.surveyChoice, (data, index)=> {
                                        return(
                                            <Picker.Item label={data.label} value={data.label} />
                                        )
                                    })
                                    }

                                </Picker>
                            </Item>

                        </Form>

                        <CustomText style={{ paddingBottom: 14 }}>If you drink bottled water, how much do you spend weekly on bottled water?</CustomText>
                        <Form style={{ paddingBottom: 14 }} full>
                            <Item picker style={{
                                borderColor: "#c9c9c9",
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderRadius: 5

                            }}>
                                <Picker
                                    style={{ width: undefined }}
                                    mode="dropdown"
                                    placeholder="                                                                       "
                                    // iosIcon={<Icon name="arrow-down" />}
                                    selectedValue={this.state.survey9}
                                    onValueChange={this.onValueChange9.bind(this)}
                                >
                                    <Picker.Item label={'                                                                       '} value={'                                                                       '} />
                                    {_.map(this.state.surveyChoice, (data, index)=> {
                                        return(
                                            <Picker.Item label={data.label} value={data.label} />
                                        )
                                    })
                                    }

                                </Picker>
                            </Item>

                        </Form>

                        <CustomTextBold style={{ fontSize: 18, paddingBottom: 24, fontStyle: 'italic' }}>Thank you for taking the time out to complete this survey.</CustomTextBold>

                    </View>
                    </KeyboardAvoidingView>
                </Content>
                <Footer>
                    <FooterTab style={{ backgroundColor: colors.LIGHT_GREEN }}>
                        <Button full
                            onPress={() => console.log('text')}
                        >
                            <CustomText style={{ color: colors.WHITE }}>Submit </CustomText>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );

    }

}
const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

})
export default connect(mapStateToProps)(Survey);

