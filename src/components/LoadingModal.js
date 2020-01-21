import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Modal from 'react-native-modal';

const LoadingModal = ( props ) => {

  return(
    <Modal isVisible={props.isVisible} style={styles.container}>
      <Image source={require('../../assets/prosperna_loading.gif')}/>
    </Modal>
  );
}

export default LoadingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});