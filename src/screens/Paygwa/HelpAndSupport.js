import React, { Component } from 'react';
import { Container, Right, Content, Item, ListItem, Separator, Text, Left, Body, View, Button, Icon, Form, Picker, Footer, FooterTab, Input } from 'native-base';
import { KeyboardAvoidingView, TextInput } from 'react-native'
import { connect } from 'react-redux';
import { colors, pRatioToFontSize } from '../../utils/constants';
import _ from 'lodash';
import CustomText from '../../components/CustomText';
import CustomTextBold from '../../components/CustomTextBold';
import OfflineNotice from '../../components/OfflineNotice';
import CustomHeader from '../../components/MultiCustomHeader'
import { Grid, Row, Col } from 'react-native-easy-grid';

class HelpAndSupport extends Component {

    constructor(props) {
        super(props);
        // local state
        this.state = {
            pixelDensity: 0,
            contactType: [{
                label: 'Technical Query',
                value : 1
            },{
                label: 'Comment or Complaint',
                value : 2
            }],
            selected: 1,
            text: ''
            

        }
    }

    async componentDidMount() {

    }

    componentWillUnmount() {

    }




    onValueChange(value: string) {
        this.setState({
            selected: value
        });
    }

    render() {
        return (
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={this.props.navigation.goBack}
                    title="Help and Support"
                    RightIcon={<Right style={{ paddingRight: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, flex: 1 }} />
                    }
                />
                <OfflineNotice />
                <Content>
                    <KeyboardAvoidingView
                        behavior="padding"
                    >
                        <View style={{ paddingHorizontal: 25, paddingVertical: 25 }}>

                            <CustomTextBold style={{ fontSize: 18, paddingBottom: 24 }}>Customer Feedback</CustomTextBold>

                            <CustomText style={{ paddingVertical: 5 }}>Customer Name</CustomText>
                            <Item regular
                                style={{
                                    borderStyle: 'solid',
                                    marginLeft: 0,
                                    backgroundColor: colors.WHITE,
                                    borderRadius: 6,
                                    borderColor: 'lightgray',
                                    marginBottom: 5,
                                    borderWidth: 1
                                }}>
                                <Input

                                    onChangeText={(input) => {
                                        this.setState({
                                            customerName: input
                                        })
                                    }}
                                    blurOnSubmit={true}
                                />

                            </Item>
                            <CustomText style={{ paddingVertical: 5 }}>Email Address</CustomText>
                            <Item regular
                                style={{
                                    borderStyle: 'solid',
                                    marginLeft: 0,
                                    backgroundColor: colors.WHITE,
                                    borderRadius: 6,
                                    borderColor: 'lightgray',
                                    marginBottom: 5,
                                    borderWidth: 1
                                }}>
                                <Input
                                    onChangeText={(input) => {
                                        this.setState({
                                            emailAdd: input
                                        })
                                    }}
                                    blurOnSubmit={true}
                                />
                            </Item>
                            <CustomText style={{ paddingVertical: 5 }}>Contact Type</CustomText>
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
                                    selectedValue={this.state.selected}
                                    onValueChange={this.onValueChange.bind(this)}
                                >
                                    {_.map(this.state.contactType, (data, index)=> {
                                        return(
                                            <Picker.Item label={data.label} value={data.value} />
                                        )
                                    })
                                    }

                                </Picker>
                            </Item>

                        </Form>

                        <CustomText style={{ paddingVertical: 5 }}>Message</CustomText>
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
                                    style={{
                                    width: '100%',
                                    padding: 10,
                                    minHeight: 100,
                                    }}
                                    multiline
                                    onChangeText={text => this.setState({ text })}
                                    value={this.state.text}
                                />
                            </Item>
                        </Form>
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
export default connect(mapStateToProps)(HelpAndSupport);

