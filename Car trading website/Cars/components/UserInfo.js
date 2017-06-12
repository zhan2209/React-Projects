import React, { PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Header, Title, Container, Content, Icon, Button } from 'native-base';


class UserInfo extends React.Component {
  render () {
    return (
      <Container>
        <Header>
          <Title>Header</Title>
        </Header>
        <Content>
          <View style={styles.container}>
            <Icon name='ios-contact-outline' style={{fontSize: 100, color: '#0A69FE'}}/>
            <Text style={{fontWeight: 'bold'}}>
              Username: {this.props.username}
            </Text>
            <Button
              style={styles.button}
              onPress={this.props.logOut}>
              Log Out
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20 ,
  },
});

export default UserInfo;
