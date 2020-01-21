import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Badge } from 'native-base';
import { Row, Col, Grid } from 'react-native-easy-grid';
import { Content } from 'native-base';
import Moment from 'moment';

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
            key={this.props.index} style={{
                borderBottomWidth: .6,
                borderColor: '#3b4043'
            }}>
                <TouchableOpacity style={styles.row} onPress={() => this.toggleExpand()}>
                    <Row >
                        <Col size={75}>

                            <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.title, styles.font]}>{this.props.title}</Text>
                            <Text>{Moment(this.props.timeAndDate, "YYYY-MM-DD hh:mm:ss").format("MM-DD-YYYY | hh:mm A")}</Text>

                        </Col>
                        <Col size={25}>
                            <Row style={{ marginTop: 5 }}>
                            
                                <View 
                                style={
                                    this.props.status === 1 ? { height: 10, width: 10, backgroundColor: 'orange', borderRadius: 10/2, marginTop: 3, marginRight: 5 } :
                                    this.props.status === 2 ? { height: 10, width: 10, backgroundColor: '#42B72A', borderRadius: 10/2, marginTop: 3, marginRight: 5 } :
                                    this.props.status === 6 ? { height: 10, width: 10, backgroundColor: '#3f71d7', borderRadius: 10/2, marginTop: 3, marginRight: 5 } :
                                    this.props.status === 7 ? { height: 10, width: 10, backgroundColor: '#ffff00', borderRadius: 10/2, marginTop: 3, marginRight: 5 } :
                                    this.props.status === 10 ? { height: 10, width: 10, backgroundColor: '#FF0000', borderRadius: 10/2, marginTop: 3, marginRight: 5 } :
                                    { height: 10, width: 10, backgroundColor: 'orange', borderRadius: 10/2, marginTop: 3, marginRight: 5 }
                                }
                                 />

       
                                <Text style={{ fontSize: 14 }}>{
                                    this.props.status === 1 ? 'In Queue' :
                                    this.props.status === 2 ? 'Delivered' :
                                    this.props.status === 3 ? 'Processed' : 
                                    this.props.status === 4 ? 'Deferred' :
                                    this.props.status === 5 ? 'Click' :
                                    this.props.status === 6 ? 'Opened' :
                                    this.props.status === 7 ? 'Bounced' :
                                    this.props.status === 8 ? 'Dropped' :
                                    this.props.status === 9 ? 'Spam' :
                                    this.props.status === 10 ? 'Unsubscribed' :
                                    this.props.status === 11 ? 'Group Unsubscribed' :
                                    'No Status'
                                }</Text>
                            </Row>
                        </Col>

                    </Row>

                    <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'#a9a9a9'} />
                </TouchableOpacity>
                <View style={styles.parentHr} />
                {
                    this.state.expanded &&
                    <View style={styles.child}>
                        <Row>
                            <Col size={75}>
                                <View>
                                    <Text style={{ color: '#a9a9a9' }}>Sent to</Text>
                                    <Text>{this.props.sentTo}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: '#a9a9a9' }}>Subject</Text>
                                    <Text>{this.props.subject}</Text>
                                </View>
                            </Col>
                            <Col size={25}>
                                <View>
                                    <Text style={{ color: '#a9a9a9' }}>Opens</Text>
                                    <Text>{this.props.open === null ? 0 : this.props.open}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: '#a9a9a9' }}>Clicks</Text>
                                    <Text>{this.props.clicks === null ? 0 : this.props.clicks}</Text>
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
        paddingBottom: 5,
        paddingLeft: 25,
        paddingRight: 18,
        height: 'auto',
    }

});


export default CustomizeAccordion;