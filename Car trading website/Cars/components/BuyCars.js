import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import { Spinner, Picker, Header, InputGroup, Input, Container, Content, Card, CardItem, Thumbnail, Text, Button, Icon } from 'native-base';

const Item = Picker.Item;

class BuyCars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      car_loading: true,
      cars: {},
      sort: 'distance',
      loc_loading: true,
      location: {
        longitude: '',
        latitude: '',
      },
      search: '',
    };
  }

  changeSortMethod(method) {
    this.setState({
      sort : method
    });
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation() {
    this.setState({loc_loading: true})
    navigator.geolocation.getCurrentPosition(
      (location) => {
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + location.coords.latitude +',' + location.coords.longitude + '&location_type=ROOFTOP&result_type=street_address&key=AIzaSyD_O9DEGquUrYFF1-wvvs1cYv2uOcsRd_w';
        fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({
              location: {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
              },
              loc_loading: false,
            });
            this.getCars();
          })
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  calDistance(lat2, lon2) {
    lat1 = this.state.location.latitude;
    lon1 = this.state.location.longitude;
    var radlat1 = Math.PI * lat1/180;
  	var radlat2 = Math.PI * lat2/180;
  	var theta = lon1-lon2;
  	var radtheta = Math.PI * theta/180;
  	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  	dist = Math.acos(dist);
  	dist = dist * 180/Math.PI;
  	dist = dist * 60 * 1.1515;
  	return Math.floor(dist);
  }

  getCars() {
    this.setState({car_loading: true})
    fetch('http://localhost:3000/api/getallcars', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var cars = {};
        responseJson.forEach((ele) => {
          cars[ele._id] = ele.car;
          cars[ele._id].distance = this.calDistance(ele.car.location.latitude, ele.car.location.longitude);
        });
        this.setState({
          cars: cars,
          car_loading: false,
        });
      })
  }

  searchCar() {
    this.setState({
      loc_loading: true,
      car_loading: true,
    })
    fetch('http://localhost:3000/api/searchcars', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search: this.state.search,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var cars = {};
        responseJson.forEach((ele) => {
          cars[ele._id] = ele.car;
          cars[ele._id].distance = this.calDistance(ele.car.location.latitude, ele.car.location.longitude);
        });
        this.setState({
          cars: cars,
          loc_loading: false,
          car_loading: false,
        });
      })
  }

  seeDetails(carid) {
    this.props.navigator.push({
      id: 'details',
      carid: carid,
      carInfo: this.state.cars[carid],
    });
  }

  sortCards(cars) {
    var method = this.state.sort;
    if (method === "distance") {
      return Object.keys(cars).sort(function(a,b) {return cars[a].distance - cars[b].distance})
    } else if (method === "pricelow")  {
      return Object.keys(cars).sort(function(a,b) {return cars[a].price - cars[b].price})
    } else if (method === "pricehigh")  {
      return Object.keys(cars).sort(function(a,b) {return cars[b].price - cars[a].price})
    } else if (method === "yearlow")  {
      return Object.keys(cars).sort(function(a,b) {return cars[a].year - cars[b].year})
    } else if (method === "yearhigh")  {
      return Object.keys(cars).sort(function(a,b) {return cars[b].year - cars[a].year})
    }
  }

  render() {
    var cars = this.state.cars
    var sortedCarKeys = this.sortCards(cars);
    var cards = null;
    if (!this.state.loc_loading && !this.state.car_loading) {
      cards = sortedCarKeys.map((key) =>
        <Card
          key={key}
          style={{ flex: 0}}
          >
          <CardItem onPress={() => this.seeDetails(key)}>
            <Image style={{ resizeMode: 'cover', width: null }} source={{uri: cars[key].images[Object.keys(cars[key].images)[0]]}} />
          </CardItem>
          <CardItem style={styles.priceRow}>
            <Text>{cars[key].year} {cars[key].brand} {cars[key].model} {cars[key].miles} miles</Text>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={{color: '#0A69FE'}}>${cars[key].price}</Text>
              <Text style={{color: 'gray', fontSize: 12}}>{cars[key].distance} miles</Text>
            </View>
          </CardItem>
        </Card>
      );
    }

    return (
      <Container>
        <Header searchBar rounded>
          <InputGroup>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              autoCapitalize="none"
              onChangeText={(search) => { this.setState({search: search}) }}
              />
          </InputGroup>
          <Button
            onPress={() => this.searchCar()}
            transparent>
            Search
          </Button>
        </Header>
        <Content>
          {(this.state.loc_loading || this.state.car_loading) ?
            <View style={styles.spinner}>
              <Spinner color='gray' />
            </View> :
            <View style={styles.pickerRow}>
              <Picker
                iosHeader="Sort Methods"
                iosIcon={<Icon name='md-menu'/>}
                mode="dropdown"
                textStyle={{marginBottom: 2, color: '#0A69FE'}}
                selectedValue={this.state.sort}
                onValueChange={(method) => this.changeSortMethod(method)}>
                <Item label="Distance near to far" value="distance" />
                <Item label="Price low to high" value="pricelow" />
                <Item label="Price high to low" value="pricehigh" />
                <Item label="Year low to high" value="yearlow" />
                <Item label="Year high to low" value="yearhigh" />
              </Picker>
            </View>
          }
          {cards}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  pickerRow: {
    alignItems: 'flex-end',
  },
  priceRow: {
    flex: 1,
    flexDirection: 'row',
  },
  spinner: {
    paddingTop: 300,
  }
});

export default BuyCars;
