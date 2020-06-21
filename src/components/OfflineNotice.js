import React, { PureComponent } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';


import NetInfo from "@react-native-community/netinfo";

const { width } = Dimensions.get('window');

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
}

class OfflineNotice extends PureComponent {
  state = {
    isConnected: true
  };

  componentDidMount() {
    

    NetInfo.addEventListener(state  => {
    this.setState({
      isConnected : state.isInternetReachable
    })
    });
    // NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
    
  }

  componentWillUnmount() {
    // NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
  },
  offlineText: {     
    color: 'white',
    padding: 10,
    textAlign: 'center' }
});

export default OfflineNotice;