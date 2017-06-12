import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Image,
  NavigatorIOS,
  Navigator,
} from 'react-native';
import { Spinner, Header, Title, Container, Content, Card, CardItem, Thumbnail, Text, Button, Icon } from 'native-base';

class MyCars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      cars: {},
      refresh: false,
    };
  }

  componentDidMount() {
    this.getCars();
  }

  getCars() {
    this.setState({loading: true});
    fetch('http://localhost:3000/api/getcars', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.props.username,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var cars = {};
        responseJson.forEach((ele) => cars[ele._id] = ele.car);
        this.setState({
          cars: cars,
          loading: false
        });
      })
  }

  refresh() {
    this.getCars();
  }

  editCar(carid) {
    this.props.navigator.push({
      id: 'editcar',
      carid: carid,
      carInfo: this.state.cars[carid],
      refresh: () => this.refresh(),
    });
  }

  deleteCar(id) {
    var cars = this.state.cars;
    delete cars[id];
    fetch('http://localhost:3000/api/deletecar', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState(cars);
      })
  }

  render () {
    var cars = this.state.cars;
    var cards =
      <View style={styles.spinner}>
        <Spinner color='gray' />
      </View> ;
    if (!this.state.loading) {
      cards = Object.keys(cars).map((key) =>
        <Card
          style={{ flex: 0 }}
          key={key}
          >
          <CardItem>
            <Text>{cars[key].year} {cars[key].brand} {cars[key].model} {cars[key].miles} miles</Text>
          </CardItem>
          <CardItem>
            <Image style={{ resizeMode: 'cover', width: null }} source={{uri: cars[key].images[Object.keys(cars[key].images)[0]]}} />
          </CardItem>
          <CardItem>
            <View style={styles.buttonRow}>
              <View style={{marginRight: 10}}>
                <Button
                  style={{width: 80}}
                  onPress={() => this.deleteCar(key)}>
                  Delete
                </Button>
              </View>
              <Button
                style={{width: 80}}
                onPress={() => this.editCar(key)}>
                Edit
              </Button>
            </View>
          </CardItem>
        </Card>
      );
    }

    return (
      <Container>
        <Header>
          <Title>My Cars</Title>
        </Header>
        <Content>
          {cards}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  spinner: {
    paddingTop: 300,
  }
});

export default MyCars;
