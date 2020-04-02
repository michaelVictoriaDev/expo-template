import React, { Component } from 'react';
import { Container, Right, Content, List, ListItem, Separator, Text, Left, Body, View, Button, Icon, Indic} from 'native-base';
import { KeyboardAvoidingView , TextInput } from 'react-native'
import { connect } from 'react-redux';
import { colors, pRatioToFontSize } from '../../utils/constants';
import _ from 'lodash';
import CustomText from '../../components/CustomText';
import CustomTextBold from '../../components/CustomTextBold';
import OfflineNotice from '../../components/OfflineNotice';
import CustomHeader from '../../components/MultiCustomHeader'
import { Grid, Row, Col } from 'react-native-easy-grid';

import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';

class News extends Component {

    constructor(props) {
        super(props);
        // local state
        this.state = {
            pixelDensity: 0,
            data: [{
                imageUrl: 'https://place-hold.it/500x500',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
            },{
                imageUrl: 'https://place-hold.it/500x500',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
            },{
                imageUrl: 'https://place-hold.it/500x500',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
            },{
                imageUrl: 'https://place-hold.it/500x500',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
            },{
                imageUrl: 'https://place-hold.it/500x500',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
            },{
                imageUrl: 'https://place-hold.it/500x500',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
            },{
                imageUrl: 'https://place-hold.it/500x500',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
            },{
                imageUrl: 'https://place-hold.it/500x500',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
            },{
                imageUrl: 'https://place-hold.it/500x500',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
            },{
                imageUrl: 'https://place-hold.it/500x500',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
            }]
        }
    }

    async componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <Container >
                <CustomHeader
                    fontSizeLeft={pRatioToFontSize(+1) > 25 ? 25 : pRatioToFontSize(+1)}
                    leftButtonFunction={this.props.navigation.goBack}
                    title="News"
                    RightIcon={<Right style={{ paddingRight: 0, backgroundColor: colors.PRIMARY_COLOR, borderColor: colors.PRIMARY_COLOR, flex: 1 }}/>
                       }
                />
                <OfflineNotice />
                <Content>
                <View style={{ paddingHorizontal: 25, paddingVertical: 25 }}>
                    {_.map(this.state.data, (data, index) => {
                        return (
                            <Row style={{ paddingBottom: 40}}>
                            <Col size={30}>


                            <Image 
                              style={{
                                width: 100,
                                height: 100,
                                resizeMode: 'cover',
                            }}
                                source={{ uri: data.imageUrl }} 
                                indicator={Progress.Circle}
                                indicatorProps={{
                                    size: 80,
                                    borderWidth: 0,
                                    color: colors.PRIMARY_COLOR,
                                    unfilledColor: 'rgba(200, 200, 200, 0.2)'
                                }}
                                />


                            </Col>
                            <Col size={5} />
                            <Col size={65} style={{paddingHorizontal: 10, paddingTop: 5}}>
                            <CustomText>{data.content}</CustomText>
                            </Col>
                        </Row>
                        )
                    })}
                    
                   
                </View>
                </Content>
            </Container>
        );

    }

}
const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

})
export default connect(mapStateToProps)(News);

