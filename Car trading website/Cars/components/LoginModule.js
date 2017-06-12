import React, { PropTypes } from 'react';
import { StyleSheet, View, AsyncStorage, Text } from 'react-native';
import { Content, Container, List, ListItem, InputGroup, Input, Icon, Button } from 'native-base';

class LoginModule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errName: '',
      errPwd: '',
      name: '',
      password: '',
    };
  }

  login() {
    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        password: this.state.password,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          this.props.loginSuc(responseJson.token, responseJson.user.name);
        }
        else {
          this.setState({
            errName: responseJson.message,
            errPwd: responseJson.message,
          });
        }
      })
  }

  signup() {
    fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        password: this.state.password,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          this.login();
        }
        else {
          this.setState({
            errName: responseJson.errors.name,
            errPwd: responseJson.errors.password,
          });
        }
      })
  }

  clearErr() {
    this.setState({
      errName: '',
      errPwd: '',
    });
  }

  render () {
    return (
      <Container>
        <View style={styles.container}>
          <Content>
            <InputGroup>
              <Icon name="ios-person" style={{ color: '#0A69FE' }} />
              <Input
                autoCapitalize="none"
                clearTextOnFocus={true}
                placeholder="USERNAME"
                onChangeText={(username) => { this.setState({name: username}) }}
                onFocus={() => this.clearErr()}
                />
            </InputGroup>
            <Text style={{color: 'red', marginBottom: 20}}>
              {this.state.errName}
            </Text>
            <InputGroup>
              <Icon name="ios-unlock" style={{ color: '#0A69FE' }} />
              <Input
                autoCapitalize="none"
                clearTextOnFocus={true}
                placeholder="PASSWORD"
                secureTextEntry
                onChangeText={(pswd) => { this.setState({password: pswd}) }}
                onFocus={() => this.clearErr()}
                />
            </InputGroup>
            <Text style={{color: 'red', marginBottom: 20}}>
              {this.state.errPwd}
            </Text>
            <Button
              block
              success
              onPress={() => this.signup()}
              >
              Signup
            </Button>
            <Button
              block
              style={{ marginTop: 20, marginBottom: 20 }}
              onPress={() => this.login()}
              >
              Login
            </Button>
          </Content>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default LoginModule;
