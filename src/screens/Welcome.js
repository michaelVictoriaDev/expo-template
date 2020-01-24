import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FormattedWrapper, FormattedMessage } from 'react-native-globalize';

import { Button } from '../components';
import messages from '../Messages';

const ContainerView = styled.View`
  flex: 1;
  justifyContent: center;
  alignItems: center;
`;

const TitleText = styled.Text`
  fontSize: 30;
  color: ${props => props.theme.WHITE};
`;

const ButtonContainer = styled.View`
  top: 100;
`
class WelcomeScreen extends Component {
	render() {
    return (
			<FormattedWrapper locale={this.props.payGwaUserDetails.Language.language} messages={messages}>
      <ContainerView>
				<TitleText>
				  <FormattedMessage
            message="Welcome"
          />
				  </TitleText>
        <ButtonContainer>
          <Button text="Go to main" onPress={() => this.props.navigation.navigate('Main')} />
        </ButtonContainer>
      </ContainerView>
			</FormattedWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
	payGwaUserDetails:state
});

export default connect(mapStateToProps, {
})(WelcomeScreen);
