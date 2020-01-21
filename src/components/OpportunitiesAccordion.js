import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Badge } from 'native-base';
import { Row, Col, Grid } from 'react-native-easy-grid';
import { Content } from 'native-base';
import Moment from 'moment';

class OpportunitiesAccordion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // data: props.data,
            tempOpptyName: props.tempOpptyName,
            created: props.created,
            opportunityDescription: props.opportunityDescription,
            close: props.close,
            key: props.key,
            expanded: false,
            data:props.data
        }
    }

    render() {

        return (
            <View key={this.state.key}
                // key={this.props.index} 
                style={{
                    flex: 1,
                    
                    // borderBottomWidth: .6,
                    borderColor: '#3b4043'
                }}>
                <TouchableOpacity style={styles.row} onPress={() => this.toggleExpand()}>
                    <Row >
                        <Col size={65}>

                            <Text  style={[styles.title, styles.font]}>Me</Text>
                            <Text >{this.state.tempOpptyName}</Text>


                        </Col>
                        <Col size={35} style={{ marginTop: 5 }}>

                            <Text style={{ fontSize: 12, color: '#a9a9a9' }} >{this.state.created}</Text>
                            
                        </Col>

                    </Row>

                    <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'#a9a9a9'} />
                </TouchableOpacity>
                <View style={styles.parentHr} />
                {
                    this.state.expanded &&
                    <View style={styles.child}>
                        <Row>
                            <Col size={65}>
                                <View>
                                    <Text style={{ color: '#a9a9a9' }}>Stage</Text>
                                    <Text>{this.state.opportunityDescription}</Text>
                                </View>
                            </Col>
                            <Col size={35}>
                                <View style={{ textAlign: 'left'}}>
                                    <Text style={{ color: '#a9a9a9' }}>Close Date</Text>
                                    <Text>{this.state.close}</Text>
                                </View>
                            </Col>
                            <Icon name='keyboard-arrow-down' size={30} color={'#FFFF'} />
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
        // flex: 1,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        padding: 0,
        height: 56,
 
        paddingLeft: 25,
        paddingRight: 18,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',

    },
    parentHr: {
        backgroundColor: '#FFFFFF',
        // height: 1,
        width: '100%'
    },
    child: {
        backgroundColor: '#FFFFFF',
        paddingTop: 0,
        paddingBottom: 5,
        paddingLeft: 25,
        paddingRight: 18,
        height: 'auto',
    }

});


export default OpportunitiesAccordion;