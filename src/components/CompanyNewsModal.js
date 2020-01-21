import React from 'react';
import { StyleSheet, WebView,ScrollView } from 'react-native';
import { View, Text } from 'native-base';
import Modal from 'react-native-modal';
import { colors } from '../utils/constants';

const CompanyNewsModal = ( props ) => {
  let companyNewsArrayOfObject = props.companyNewsData;

  return(
    <Modal 
      isVisible={props.isVisible}
      onBackButtonPress={() => props.toggleModal(false)}
      onBackdropPress={() => props.toggleModal(false)}
      >
      <View style={styles.header}>
        <Text style={styles.headerText}>Company News</Text>
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{paddingTop : 10}}>
          {
            companyNewsArrayOfObject.map((newsItem, index) => {
              

              return(
                <View style={{ height : 250, borderBottomWidth : 2, borderBottomColor : colors.PRIMARY_COLOR, marginBottom : 16, padding : 8 }}>
                  <Text style={{ fontWeight : '500', paddingVertical : 4 }}>{newsItem.title}</Text>
                  <WebView 
                    key={newsItem.company_news_id} 
                    source={{ html: 
                    `<html>
                      <head>
                        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                      </head>
                      <body>
                        ${newsItem.content}
                      </body>
                    </html>` 
                    }} 
                    style={{ flex : 1, backgroundColor : 'transparent' }}
                  />
                </View>
              )
            })
          }
        </ScrollView>
      </View>
      
    </Modal>
  );
}

export default CompanyNewsModal;

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor : colors.WHITE,
    marginHorizontal : 8,
    marginBottom : 8,
    borderBottomStartRadius: 8,
    borderBottomEndRadius: 8,
  },
  header : {
    backgroundColor : colors.PRIMARY_COLOR,
    borderTopStartRadius : 8,
    borderTopEndRadius : 8,
    marginHorizontal: 8,
    paddingVertical : 8,
  },
  headerText : {
    color : colors.WHITE,
    textAlign : 'center',
    fontWeight : '600'
  }
});