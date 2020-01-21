import React, { Component } from 'react';
import styled from 'styled-components/native';

const ButtonContainer = styled.TouchableHighlight`
  width: 130;
  height: 40;
  backgroundColor: #3F71D7;
  borderRadius: 5;
  justifyContent: center;
  alignItems: center;
`;

const Text = styled.Text`
  fontSize: 20;
  color: #FFFFFF;
`;

class Button extends Component {
  render() {
    const { text, onPress } = this.props;

    return (
      <ButtonContainer
        underlayColor='#3F71D7'
        onPress={onPress}
      >
        <Text>{text}</Text>
      </ButtonContainer>
    );
  }
}

export default Button;
