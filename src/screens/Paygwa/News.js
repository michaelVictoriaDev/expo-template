import React, { Component } from 'react';
import { Container, Right, Content, List, ListItem, Separator, Text, Left, Body, View, Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import { colors, pRatioToFontSize } from '../../utils/constants';
import _ from 'lodash';
import CustomText from '../../components/CustomText';
import CustomTextBold from '../../components/CustomTextBold';
import OfflineNotice from '../../components/OfflineNotice';
import CustomHeader from '../../components/MultiCustomHeader'
import { Grid, Row, Col } from 'react-native-easy-grid';

class News extends Component {

    constructor(props) {
        super(props);
        // local state
        this.state = {
            pixelDensity: 0,

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
  
                    <CustomText>News</CustomText>
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

