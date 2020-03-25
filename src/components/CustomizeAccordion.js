import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Badge } from 'native-base';
import { Row, Col, Grid } from 'react-native-easy-grid';
import { Content } from 'native-base';
import Moment from 'moment';
import CustomText from '../components/CustomText'
import CustomTextBold from '../components/CustomTextBold'
import { colors } from '../utils/constants';

class CustomizeAccordion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            expanded: false,
        }
    }

    render() {

        return (    


            <View
            key={this.props.key} style={{
                borderBottomWidth: .6,
                borderColor: '#3b4043'
            }}>
                <TouchableOpacity style={styles.row} onPress={() => this.toggleExpand()}>
                    <Row >
                        <Col size={70}>

                            <CustomText style={{ fontSize: 12 }} >Account Number</CustomText>
                            <CustomText >{this.state.data.accountNumber}</CustomText>

                        </Col>
                        <Col size={25}>
                            <Row style={{ marginTop: 5 }}>
                            <CustomText style={{ fontSize: 18 }}>$ {this.state.data.value}.00</CustomText>
                            </Row>
                        </Col>

                    </Row>

                    <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-right'} size={30} color={colors.BLACK} />
                </TouchableOpacity>
                <View style={styles.parentHr} />
                {
                    this.state.expanded &&
                    <View style={styles.child}>
                        <Row>
                            <Col >
                            <View>
                                <CustomText>Receipt No.</CustomText>
                                <CustomText>{this.state.data.receiptNo}</CustomText>
                            </View>
                              
                            </Col>
                           
                            <Col >
                            <View>
                                <CustomText>Pay Date.</CustomText>
                            <CustomText>{this.state.data.payDate}</CustomText>
                            </View>
                            </Col>
                            <Col >
                            <View>
                                <CustomText>Paid By</CustomText>
                            <CustomText>{this.state.data.padingBy}</CustomText>
                            </View>
                            </Col>
                        </Row>
                    </View>
                }
            </View>



        )
    }

    toggleExpand = () => {
        this.setState({ expanded: !this.state.expanded })
    }

}

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 56,
        paddingLeft: 25,
        paddingRight: 18,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',

    },
    parentHr: {
        backgroundColor: '#FFFFFF',
        height: 1,
        width: '100%'
    },
    child: {
        backgroundColor: '#FFFFFF',
        paddingTop: 0,
        paddingBottom: 25,
        paddingLeft: 25,
        paddingRight: 18,
        height: 'auto',
    }

});


export default CustomizeAccordion;