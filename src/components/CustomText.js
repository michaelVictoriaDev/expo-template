import React from 'react';
import {
    Text,
    StyleSheet,
} from 'react-native';
import * as Font from 'expo-font'; 

export default class CustomText extends React.Component {
    constructor(props) {
        super(props);
    }


async componentDidMount() {
    await Font.loadAsync({
        'Lato': require('../../assets/fonts/Lato-Regular.ttf'),
        'Lato_Bold': require('../../assets/fonts/Lato-Bold.ttf')
    });
}

    render() {
        return (
            <Text style={[styles.defaultStyle, this.props.style]}>
                {this.props.children}
            </Text>
        );
    }
}


const styles = StyleSheet.create({
    // ... add your default style here
    defaultStyle: {
        fontFamily: 'Lato'
    },
});