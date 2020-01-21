import React from 'react';
import { View, StyleSheet, PixelRatio, TouchableOpacity } from 'react-native';
import { Text, Picker, Toast } from 'native-base';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, pRatioToFontSize } from '../utils/constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import _ from 'lodash'

const ViewByUserModal = ( props ) => {
  let previousSelected = props.selectedUserIdForLeadViewing;

  return(
    <Modal 
      isVisible={props.isVisible}
      onBackdropPress={props.toggleModal}
      onRequestClose={props.toggleModal}
    >
      <View style={[ styles.headerStyle]}>
        <TouchableOpacity style={{ flex : 1 }} onPress={props.toggleModal}>
          <Ionicons style={{ paddingHorizontal : 10 }} name='md-close' size={25} color='white' />
        </TouchableOpacity>
        <Text style={[ styles.textStyle, { flex : 9 } ]}>View leads by: </Text>
      </View>

      <View style={styles.container}>
        <View style={[styles.spacesBetweenElements, styles.pickerContainer]}>
          <Picker
              placeholder='Select user'
              placeholderStyle = {{flex : 1}}
              iosHeader='Select user'
              style={styles.pickerStyle}
              selectedValue={props.selectedUserIdForLeadViewing}
              onValueChange={(newSelectedUserId, index) => {
                if(props.previousSelected != newSelectedUserId){
                  props.onApplyOfSelectedUserForViewLeadsBy(newSelectedUserId);
                }
                else{
                  Toast.show({
                    text : 'Same user was selected.',
                    duration : 2500,
                  })
                }
              }}
            >
            <Picker.Item key={0} label={'All Leads'} value={0}/>
            {
              props.members.map((item, index) => {
                if(index == 0){ 
                  return(
                    <Picker.Item
                      key={props.myUserId}
                      label="My Leads"
                      value={props.myUserId}
                    />
                  )
                }
                else{
                  return(
                    <Picker.Item 
                      key={item.user_id}
                      label={ 
                        item.full_name == null || _.isEmpty(item.full_name) ?
                          item.last_name == undefined ? `${item.first_name}` : `${item.first_name} ${item.last_name}`
                      :
                      `${item.full_name}`
                      }
                      value={item.user_id}
                    />
                  );
                }
              })
            }
          </Picker>
        </View>

        {/* <View style={[styles.spacesBetweenElements]}>
          <Button block rounded success
            onPress={ () => {
                if(selectedValue == previousSelected){
                  Toast.show({
                    text : "Same user was selected.",
                    duration : 2500
                  })
                }
                else{
                  props.onChangeOfSelectedUserForViewLeadsBy(selectedValue)
                }
              }
            }>
            <Text uppercase={false}>Apply</Text>
          </Button>
        </View> */}

      </View>
    </Modal>
  );
}

export default ViewByUserModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor : colors.WHITE,
    height : PixelRatio.getPixelSizeForLayoutSize(40),
    padding: PixelRatio.getPixelSizeForLayoutSize(5),
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  textStyle: {
    fontSize : pRatioToFontSize(),
    color : colors.WHITE,
  },
  spacesBetweenElements : {
    marginVertical : PixelRatio.getPixelSizeForLayoutSize(5)
  },
  modalStyle : {
    justifyContent : 'center',
    flex : 1,
  },
  pickerStyle : {
    width : wp('100%'),
    // height : Platform.OS === "android" ? PixelRatio.getPixelSizeForLayoutSize(20) : null
  },
  pickerContainer : {
    justifyContent : 'center',
    borderRadius : 8,
    borderColor : '#c1c2c2',
    borderWidth : 0.8,
  },
  headerStyle : {
    alignItems : 'center',
    backgroundColor : colors.PRIMARY_COLOR,
    borderTopLeftRadius: 8, 
    borderTopRightRadius: 8,
    height : PixelRatio.getPixelSizeForLayoutSize(20),
    flexDirection: 'row',
  },
  headerTextStyle : {
    textAlign : 'center',
  }
});