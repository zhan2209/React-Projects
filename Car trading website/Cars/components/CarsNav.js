import React, { PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Container, Header, InputGroup, Input, Content, Footer, FooterTab, Button, Icon, Badge } from 'native-base';
import BuyCars from './BuyCars';
import MyCars from './MyCars';
import SellCars from './SellCars';
import UserInfo from './UserInfo';

class CarsNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'buy',
    };
  }

  navTo(screen) {
    this.setState({screen: screen});
  }

  render () {
    let content = null;
    switch(this.state.screen) {
        case 'sell':
            content = <SellCars
              toIndex={() => this.navTo('buy')}
              username={this.props.username}
              />;
            break;
        case 'mycars':
            content = <MyCars
              username={this.props.username}
              navigator={this.props.navigator}
              />;
            break;
        case 'userinfo':
            content = <UserInfo
              username={this.props.username}
              logOut={this.props.logOut}
              />;
            break;
        default:
            content = <BuyCars
              navigator={this.props.navigator}
              username={this.props.username}
              />;
    }
    return (
      <Container>
        <Content>
          {content}
        </Content>
        <Footer >
          <FooterTab>
            <Button
              active={'buy' == this.state.screen}
              onPress={() => this.navTo('buy')}
              >
              Buy
              <Icon name='ios-apps-outline' />
            </Button>
            <Button
              active={'sell' == this.state.screen}
              onPress={() => this.navTo('sell')}
              >
              Sell
              <Icon name='ios-paper-plane-outline' />
            </Button>
            <Button
              active={'mycars' == this.state.screen}
              onPress={() => this.navTo('mycars')}
              >
              My Cars
              <Icon name='ios-heart-outline' />
            </Button>
            <Button
              active={'userinfo' == this.state.screen}
              onPress={() => this.navTo('userinfo')}
              >
              Account
              <Icon name='ios-person-outline' />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default CarsNav;
