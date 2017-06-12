/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Navigator,
} from 'react-native';
import { Container, Header, InputGroup, Input, Content, Footer, FooterTab, Button, Icon, Badge } from 'native-base';
import LoginModule from './components/LoginModule';
import CarsNav from './components/CarsNav';
import EditCar from './components/EditCar';
import CarDetails from './components/CarDetails';

export default class Cars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      username: '',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("username").then((value) => {
      if (value) {
        this.setState({
          auth: true,
          username: value,
        });
      }
    }).done();
  }

  loginSuc(token, username) {
    this.setState({
      auth: true,
      username: username,
    });
    AsyncStorage.setItem("username", username);
    AsyncStorage.setItem("token", token);
  }

  logOut() {
    this.setState({
      auth: false,
      username: '',
    });
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("username");
  }

  render() {
    const rendered = this.state.auth ?
      <Navigator
        style={{flex: 1}}
        initialRoute={{id: 'carsnav'}}
        renderScene={(route, navigator) => {
          var id = route.id;
          if (id == 'carsnav') {
            return (
              <CarsNav
                  username={this.state.username}
                  navigator={navigator}
                  logOut={() => this.logOut()}
                />
            );
          } else if (id == 'editcar') {
            return (
              <EditCar
                username={this.state.username}
                navigator={navigator}
                carid={route.carid}
                carInfo={route.carInfo}
                refresh={route.refresh}
                />
            );
          } else if (id == 'details') {
            return (
              <CarDetails
                navigator={navigator}
                carid={route.carid}
                carInfo={route.carInfo}
                />
            );
          }
        }}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }}
      /> :
      <LoginModule
        loginSuc={(token, username) => this.loginSuc(token, username)}
        />;
    return (
      rendered
    );
  }
}

AppRegistry.registerComponent('Cars', () => Cars);
