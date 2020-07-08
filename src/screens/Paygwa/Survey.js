import React, { Component, Fragment } from 'react';
import { Container, Right, Content, Item, ListItem, Separator, Text, Left, Body, View, Button, Icon, Form, Picker, Footer, FooterTab, Toast } from 'native-base';
import { KeyboardAvoidingView, TextInput, Keyboard, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux';
import { colors, pRatioToFontSize } from '../../utils/constants';
import _ from 'lodash';
import CustomText from '../../components/CustomText';
import CustomTextBold from '../../components/CustomTextBold';
import OfflineNotice from '../../components/OfflineNotice';
import CustomHeader from '../../components/MultiCustomHeader'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { PAYGWA_URL, DASHBOARD_URL, PAYNOW_URL } from 'react-native-dotenv';
import axios from 'react-native-axios'
import { submitSurvey } from '../../actions';


class Survey extends Component {

    constructor(props) {
        super(props);
        // local state
        this.state = {
            isLoading: false,
            pixelDensity: 0,
            text: '',
            surveyList: [],
            surveyAnswers: {
                surveyText: '',
            },
            surveyAnswersResult: {
                survey4: '',
                survey5: '',
                survey6: '',
                survey7: '',
                survey8: '',
            },
        }

    }

    componentDidMount() {
        this.getListSurvey()

    }

    componentWillUnmount() {

    }

    submitSurvey() {
        if (_.isEmpty(this.state.surveyAnswersResult.survey4) || this.state.surveyAnswersResult.survey4 == 0 && _.isEmpty(this.state.surveyAnswersResult.survey5) || this.state.surveyAnswersResult.survey5 == 0 && _.isEmpty(this.state.surveyAnswersResult.survey6) || this.state.surveyAnswersResult.survey5 == 0 && _.isEmpty(this.state.surveyAnswersResult.survey7) || this.state.surveyAnswersResult.survey7 == 0 && _.isEmpty(this.state.surveyAnswersResult.survey8) || this.state.surveyAnswersResult.survey8 == 0) {
            alert('Please select or enter a value for this question.');
            this.setState({
                ...this.state,
                surveyAnswersResult: {
                    ...this.state.surveyAnswersResult,
                    survey4: 'Please select or enter a value for this question',
                    survey5: 'Please select or enter a value for this question',
                    survey6: 'Please select or enter a value for this question',
                    survey7: 'Please select or enter a value for this question',
                    survey8: 'Please select or enter a value for this question',
                }
            })
        } else if (_.isEmpty(this.state.surveyAnswersResult.survey4) || this.state.surveyAnswersResult.survey4 == 0 && _.isEmpty(this.state.surveyAnswersResult.survey5) || this.state.surveyAnswersResult.survey5 == 0 && _.isEmpty(this.state.surveyAnswersResult.survey6) || this.state.surveyAnswersResult.survey5 == 0 && _.isEmpty(this.state.surveyAnswersResult.survey7) || this.state.surveyAnswersResult.survey7 == 0) {
            alert('Please select or enter a value for this question.');
            this.setState({
                ...this.state,
                surveyAnswersResult: {
                    ...this.state.surveyAnswersResult,
                    survey4: 'Please select or enter a value for this question',
                    survey5: 'Please select or enter a value for this question',
                    survey6: 'Please select or enter a value for this question',
                    survey7: 'Please select or enter a value for this question',
                    survey8: '',

                }
            })
        } else if (_.isEmpty(this.state.surveyAnswersResult.survey4) || this.state.surveyAnswersResult.survey4 === 0 && _.isEmpty(this.state.surveyAnswersResult.survey5) || this.state.surveyAnswersResult.survey5 === 0 && _.isEmpty(this.state.surveyAnswersResult.survey6) || this.state.surveyAnswersResult.survey5 == 0) {
            alert('Please select or enter a value for this question.');
            this.setState({
                ...this.state,
                surveyAnswersResult: {
                    ...this.state.surveyAnswersResult,
                    survey4: 'Please select or enter a value for this question',
                    survey5: 'Please select or enter a value for this question',
                    survey6: 'Please select or enter a value for this question',
                    survey7: '',
                    survey8: '',

                }
            })
        } else if (_.isEmpty(this.state.surveyAnswersResult.survey4) || this.state.surveyAnswersResult.survey4 === 0 && _.isEmpty(this.state.surveyAnswersResult.survey5) || this.state.surveyAnswersResult.survey5 === 0) {
            alert('Please select or enter a value for this question.');
            this.setState({
                ...this.state,
                surveyAnswersResult: {
                    ...this.state.surveyAnswersResult,
                    survey4: 'Please select or enter a value for this question',
                    survey5: 'Please select or enter a value for this question',
                    survey6: '',
                    survey7: '',
                    survey8: '',

                }
            })
        } else if (_.isEmpty(this.state.surveyAnswersResult.survey4) || this.state.surveyAnswersResult.survey4 === 0) {
            alert('Please select or enter a value for this question.');
            this.setState({
                ...this.state,
                surveyAnswersResult: {
                    ...this.state.surveyAnswersResult,
                    survey4: 'Please select or enter a value for this question',
                    survey5: '',
                    survey6: '',
                    survey7: '',
                    survey8: '',

                }
            })
        } else {
            console.log('ok', this.state.surveyAnswers)
        }
    }
    getListSurvey() {
        this.setState({
            isLoading: true
        })
        axios
            .get(DASHBOARD_URL + '/api/v1/get-list-survey',
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            .then(response => {

                this.setState({
                    surveyList: response.data.result.surveyList,
                    isLoading: false
                })

            })
            .catch(error => {
                console.log('getListSurvey', error)
                this.setState({
                    isLoading: false
                })
                Toast.show({
                    text: `Server Error`,
                    duration: 2500,
                    type: 'danger'
                })
            })
    }


    onChange = (selectedName) => {

        return text => {
            this.setState({
                ...this.state,
                surveyAnswers: {
                    ...this.state.surveyAnswers,
                    [selectedName]: text
                }
            })
        };

    }



    render() {


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
                    <View style={{ paddingHorizontal: 25, paddingVertical: 25 }}>
                        <CustomTextBold style={{ fontSize: 18, paddingBottom: 24 }}>Survey</CustomTextBold>
                        <CustomTextBold style={{ fontSize: 18, paddingBottom: 14 }}>Hafa Adai! We hope you’re finding our online service uesful.</CustomTextBold>
                        <CustomText style={{ paddingBottom: 14 }} >In our effort to better serve YOU, we ask you to take part in a quick survey which will take approximately 3 minutes to complete. Your responses are treated with the strictest confidence and will be used within GWA to improve the quality of our service delivery.</CustomText>
                    </View>

                    <View style={{
                        borderColor: "#c9c9c9",
                        borderBottomWidth: 1
                    }} />
                    <View style={{ paddingHorizontal: 25 }}>


                        {this.state.isLoading ?

                            < View style={{
                                justifyContent: 'center',
                                padding : 20,
                                alignItems: 'center', justifyContent: 'center', flex: 1
                            }}>
                                <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />

                            </View>
                            :


                            _.map(this.state.surveyList, (item, index) => {
                                // console.log('log', _.get(this.state.surveyAnswers, `survey${index}`, "0"))
                                return (
                                    <React.Fragment>

                                        {index === 3 ?
                                            <React.Fragment>
                                                <CustomText style={{ paddingVertical: 14 }}>{item.prompt}</CustomText>
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

                                                            placeholder="Please Select"
                                                            placeholderStyle={{ color: '#bfc6ea' }}

                                                            selectedValue={_.get(this.state.surveyAnswers, `survey${index}`, "0")}

                                                            onValueChange={this.onChange(`survey${index}`)}


                                                        >
                                                            <Picker.Item label={'Please Select'} value={'Please Select'} />

                                                            {_.map(this.state.surveyList[index].possibleAnswers, (item1, index1) => {
                                                                return (

                                                                    <Picker.Item key={index1} label={item1.description} value={item1.value} />
                                                                )
                                                            })}


                                                        </Picker>
                                                    </Item>

                                                </Form>
                                                <CustomText style={{ paddingBottom: 14 }}>In the last 90 days have you had contact with other GWA Personnel not mentioned above? Please indicate what GWA unit/section you were in contact with and rate your experience.</CustomText>



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
                                                            onBlur={e => Keyboard.dismiss()}
                                                            placeholder='Enter Text'
                                                            style={{
                                                                width: '100%',
                                                                padding: 10,
                                                                minHeight: 50,
                                                            }}
                                                            multiline

                                                            value={this.state.surveyAnswers.surveyText}
                                                            onChangeText={(text) => this.setState({
                                                                ...this.state,
                                                                surveyAnswers: {
                                                                    ...this.state.surveyAnswers,
                                                                    surveyText: text
                                                                }
                                                            })
                                                            }
                                                        />
                                                    </Item>
                                                </Form>
                                            </React.Fragment>
                                            :
                                            index > 3 ?
                                                <React.Fragment>
                                                    <CustomText style={{ paddingVertical: 14 }}>{item.prompt}</CustomText>
                                                    <Form style={{ paddingBottom: 14 }} full>
                                                        <Item picker
                                                            error
                                                            style={{
                                                                borderColor: "#c9c9c9",
                                                                borderBottomWidth: 1,
                                                                borderTopWidth: 1,
                                                                borderLeftWidth: 1,
                                                                borderRightWidth: 1,
                                                                borderRadius: 5

                                                            }}>
                                                            <Picker

                                                                mode="dropdown"
                                                                placeholder="Please Select"
                                                                placeholderStyle={{ color: '#bfc6ea' }}

                                                                selectedValue={_.get(this.state.surveyAnswers, `survey${index}`, "0")}
                                                                onValueChange={this.onChange(`survey${index}`)}

                                                            >
                                                                <Picker.Item label={'Please Select'} value={'Please Select'} />

                                                                {_.map(this.state.surveyList[index].possibleAnswers, (item1, index1) => {
                                                                    return (

                                                                        <Picker.Item key={index1} label={item1.description} value={item1.value} />
                                                                    )
                                                                })}


                                                            </Picker>
                                                        </Item>
                                                        {/* {_.isEmpty(_.get(this.state.surveyAnswersResult, `survey${index}`, '')) ?
                                                        null
                                                        :
                                                        <CustomText style={{ paddingVertical: 5, color: colors.RED }}>{_.get(this.state.surveyAnswersResult, `survey${index}`, 'Please select or enter a value for this question')}</CustomText>
                                                    } */}

                                                        <CustomText style={{ paddingVertical: 5, color: colors.RED }}>Required</CustomText>
                                                    </Form>
                                                </React.Fragment>
                                                :
                                                <React.Fragment>
                                                    <CustomText style={{ paddingVertical: 14 }}>{item.prompt}</CustomText>
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
                                                                placeholder="Please Select"
                                                                placeholderStyle={{ color: '#bfc6ea' }}
                                                                selectedValue={_.get(this.state.surveyAnswers, `survey${index}`, "0")}
                                                                onValueChange={this.onChange(`survey${index}`)}

                                                            >
                                                                <Picker.Item label={'Please Select'} value={'Please Select'} />

                                                                {_.map(this.state.surveyList[index].possibleAnswers, (item1, index1) => {
                                                                    return (

                                                                        <Picker.Item key={index1} label={item1.description} value={item1.value} />
                                                                    )
                                                                })}


                                                            </Picker>
                                                        </Item>
                                                        {/* <CustomText style={{ paddingVertical: 14 }}>Required</CustomText> */}

                                                    </Form>
                                                </React.Fragment>
                                        }
                                    </React.Fragment>
                                )
                            })

                        }

                    </View>

                    <View style={{ padding: 25 }}>


                        <CustomTextBold style={{ fontSize: 18, paddingBottom: 24, fontStyle: 'italic' }}>Thank you for taking the time out to complete this survey.</CustomTextBold>
                    </View>

                </Content>
                <Footer>
                    <FooterTab style={{ backgroundColor: colors.LIGHT_GREEN }}>
                        <Button full
                            onPress={() => this.submitSurvey()}
                        >
                            <CustomText style={{ color: colors.WHITE, fontSize: 16 }}>Submit </CustomText>
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

