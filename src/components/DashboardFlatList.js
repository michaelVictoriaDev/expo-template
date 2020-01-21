import React, { Component } from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';
import { Toast } from 'native-base';

class DashboardFlatList extends Component {

  constructor(props){
    super(props);
  }

  render(){
    return (
      <FlatList
        ref="infiniteList"
        data={this.props.flatListData}
        onEndReached={() => {
          if(this.props.isLoading == false){ // check if still loading/fetching, if false then call another page.
            this.props.onEndReachedFunction(this.props.selectedMemberUserId, this.props.currentUser_UserId, this.props.page);
          }
          // else{
          //   Toast.show({
          //     text : "Still loading...",
          //     duration : 2500
          //   })
          // }
        }}
        onEndReachedThreshold={0.5}
        onKeyExtractor={(x, i) => i.toString()}
        ListFooterComponent={() =>
          this.props.isLoading
            ? <Image style={{ alignSelf: 'center' }} source={require('../../assets/prosperna_loading.gif')} />
            : null
        }
        renderItem={(data) => {
          return (
            this.props.flatListItem(data.index, data.item)
          );
        }}
      />
    );
  }

}

export default DashboardFlatList;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   }
// });