import React, { Component } from 'react';
import { StyleSheet, Platform, PixelRatio } from 'react-native';
import { Picker, Item, View, Text, Icon, Toast } from 'native-base';
import { connect } from 'react-redux';
import { getAllChildLead } from '../actions';
import _ from 'lodash';

class MemberPicker extends Component {

    constructor(props){
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
        // this.props.getAllChildLead(this.props.userObject.user_id);
    }

    render(){
        if(this.props.childList.length > 0 && this.props.userObject.pay_plan_id == 4){
            return (
                <View style = { styles.container }>
                    <Item picker style={{ borderColor: '#FFFF' }}>
                        <Picker
                            enabled={!this.props.isEnabled}
                            selectedValue={this.props.selectedValue}
                            onValueChange={(userId, itemIndex) => {
                                if(userId != -1){
                                    this.props.customOnChangeValue(userId)
                                }
                                else{
                                    Toast.show({
                                        text : "Select a valid user.",
                                        duration : 2500
                                    })
                                }
                            }}
                            iosIcon={<Icon name="arrow-down" />}
                            style={{ width : undefined }}
                            iosHeader='Member list'
                            // mode='dropdown'
                            >    
                            {/* {
                                Platform.OS === 'android' ?
                                <Picker.Item
                                    key={0}
                                    label="Select member here"
                                    value={0}
                                />
                                :
                                null
                            } */}
                            <Picker.Item
                                key={-1}
                                label="Select user"
                                value={-1}
                            />
                            <Picker.Item
                                key={0}
                                label="All"
                                value={0}
                            />
                            
                            {
                                this.props.childList.map((item, index) => {
                                    if(index == 0){ // index 0 is for current user
                                        //based on endpoint app.prosperna.com/web/get-child-users-selection-mobile?userId=${userId}
                                        return(
                                            <Picker.Item
                                                key={this.props.userObject.user_id}
                                                label="Me"
                                                value={this.props.userObject.user_id}
                                            />
                                        )
                                    }
                                    else{
                                        return(
                                            <Picker.Item 
                                                key={item.user_id}
                                                label={item.first_name + ' ' + item.last_name}
                                                // label={ 
                                                //     _.isNil(item.full_name) ? 
                                                //      item.first_name + " " + item.last_name
                                                
                                                //     :
                                                //     `${item.full_name}`
                                                // }
                                                value={item.user_id}
                                            />
                                        );
                                    }
                                })
                            }
                        </Picker>
                    </Item>
                </View>
            );
        }
        else{
            return null;
        }
    }

}

const mapStateToProps = (state) => ({
    childList : state.userLeadRecord.childList,
    userObject : state.userState.userObject,
    dashboardStore: state.dashboardStore,
})

const mapDispatchToProps = (dispatch) => ({
    getAllChildLead : (userId) => dispatch(getAllChildLead(userId))
})

export default connect(mapStateToProps,mapDispatchToProps)(MemberPicker);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height : '8%',
        paddingHorizontal: PixelRatio.getPixelSizeForLayoutSize(10),
    }
});