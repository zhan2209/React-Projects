import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  Image,
  Dimensions
} from 'react-native';
import { Badge, Text, Spinner, Container, Content, List, ListItem, InputGroup, Input, Icon, Picker, Button } from 'native-base';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window')

class CarDetails extends React.Component {
  renderScene(route, navigator) {
    var carInfo = this.props.carInfo;
    var carImages = Object.keys(carInfo.images).map((key) => {
      return (
        <View key={key} style={styles.slide}>
          <Image resizeMode='stretch' style={styles.image} source={{uri: carInfo.images[key]}} />
        </View>
      );
    });
    return (
      <Container style={{marginTop: 64}}>
        <Content>
          <Swiper style={styles.wrapper} height={240}>
            {carImages}
          </Swiper>
          <List>
            <ListItem >
              <Text>Brand: {this.props.carInfo.brand}</Text>
            </ListItem>
            <ListItem>
              <Text>Model: {this.props.carInfo.model}</Text>
            </ListItem>
            <ListItem>
              <Text>Year: {this.props.carInfo.year}</Text>
            </ListItem>
            <ListItem>
              <Text>Miles: {this.props.carInfo.miles}</Text>
            </ListItem>
            <ListItem>
              <Text>Address: {this.props.carInfo.address}</Text>
            </ListItem>
            <ListItem>
              <Text>Price: {this.props.carInfo.price}</Text>
            </ListItem>
            <ListItem>
              <Text>Email: {this.props.carInfo.email}</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }

  render () {
    return (
      <Navigator
        style={{flex: 1}}
        renderScene={(route, navigator) => this.renderScene(route, navigator)}
        navigator={this.props.navigator}
        navigationBar={
          <Navigator.NavigationBar style={styles.navBar}
            routeMapper={NavigationBarRouteMapper} />
        }
      />
    );
  }
}

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return (
      <Button
        transparent
        onPress={() => navigator.parentNavigator.pop()}
        >
        <Icon name='ios-arrow-back' style={styles.backArr} />
      </Button>
    );
  },
  RightButton(route, navigator, index, navState) {
    return null;
  },
  Title(route, navigator, index, navState) {
    return (
      <Text style={{marginTop: 10, fontSize: 20}}>
        Car Details
      </Text>
    );
  }
};

var styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapper: {
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  image: {
    width,
    flex: 1
  },
  backArr: {
    fontSize: 28,
    color: '#0A69FE',
    marginLeft: 10,
  },
})

export default CarDetails;
