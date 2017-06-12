import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  ImagePickerIOS,
  Navigator,
  Image,
  TouchableHighlight
} from 'react-native';
import { Text, Spinner, Container, Content, List, ListItem, InputGroup, Input, Icon, Picker, Button } from 'native-base';
import Camera from 'react-native-camera';

const IMAGE_SIZE = 80;

class EditCar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: '',
      model: '',
      miles: '',
      year: '',
      email: '',
      location: null,
      loc_loading: false,
      address: null,
      images: this.props.carInfo.images,
      price: '',
    };
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
              address: responseJson.results[0].formatted_address,
              loc_loading: false,
            });
          })
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  pickImage() {
    ImagePickerIOS.openSelectDialog({}, imageUri => {
      if (imageUri) {
        var imageId = this.getParameterByName('id', imageUri);
        if (!(imageId in this.state.images)) {
          var images = this.state.images;
          images[imageId] = imageUri;
          this.setState({ images });
        }
      }
    }, error => console.log(error));
  }

  editCar() {
    console.log(this.state);
    fetch('http://localhost:3000/api/editcar', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.props.carid,
        car: this.state,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.refresh();
        this.props.navigator.pop();
      })
  }

  deleteImage(key) {
    var images = this.state.images;
    delete images[key];
    this.setState(images);
  }

  renderScene(route, navigator) {
    var carImages = Object.keys(this.state.images).map((key) =>
      <TouchableHighlight
        key={key}
        onPress={() => this.deleteImage(key)}>
        <Image
          style={{marginLeft: 20, marginBottom: 20, height: IMAGE_SIZE, width: IMAGE_SIZE}}
          source={{uri: this.state.images[key]}}
          >
          <View style={styles.grayOverlap}>
            <Icon name='md-close-circle' style={styles.deleteButton}/>
          </View>
        </Image>
      </TouchableHighlight>
    );

    var carInfo = this.props.carInfo;
    return (
      <Container style={{marginTop: 64}}>
        <Content>
          <List>
            <ListItem>
              <InputGroup>
                <Input
                  autoCapitalize="none"
                  inlineLabel
                  label="Brand"
                  placeholder={carInfo.brand}
                  onChangeText={(brand) => { this.setState({brand: brand}) }}
                  />
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input
                  autoCapitalize="none"
                  inlineLabel
                  label="Model"
                  placeholder={carInfo.model}
                  onChangeText={(model) => { this.setState({model: model}) }}
                  />
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input
                  autoCapitalize="none"
                  inlineLabel
                  label="Miles"
                  placeholder={carInfo.miles}
                  onChangeText={(miles) => { this.setState({miles: miles}) }}
                  />
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input
                  autoCapitalize="none"
                  inlineLabel
                  label="Year"
                  placeholder={carInfo.year}
                  onChangeText={(year) => { this.setState({year: year}) }}
                  />
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input
                  autoCapitalize="none"
                  inlineLabel
                  label="Price"
                  placeholder={carInfo.price}
                  onChangeText={(price) => { this.setState({price: price}) }}
                  />
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup>
                <Input
                  autoCapitalize="none"
                  inlineLabel
                  label="Email"
                  placeholder={carInfo.email}
                  onChangeText={(email) => { this.setState({email: email}) }}
                  />
              </InputGroup>
            </ListItem>
            <ListItem>
              {this.state.address ?
                <InputGroup disabled>
                  <Input
                    inlineLabel
                    label="Address"
                    placeholder={this.state.address} />
                </InputGroup> :
                <Button
                  block
                  onPress={() => this.getLocation()}
                  style={{height: 40}}
                  >
                  {this.state.loc_loading ?
                    <Spinner color='gray' /> :
                      <Text style={{color: 'white'}}> Get Your Location </Text>
                    }
                </Button>
                }
            </ListItem>
            <ListItem>
              <Button
                block
                onPress={() => this.pickImage()}
                style={{flex: 1, height: 40}}
                >
                <Text style={{color: 'white'}}> Add Your Car Images </Text>
              </Button>
            </ListItem>
            <View style={styles.imageRow}>
              {carImages}
            </View>
          </List>
          <Button
            style={{ alignSelf: 'center', marginBottom: 20 }}
            onPress={() => this.editCar()}
            >
            Save
          </Button>
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
        Edit Car
      </Text>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backArr: {
    fontSize: 28,
    color: '#0A69FE',
    marginLeft: 10,
  },
  deleteButton: {
    position: 'absolute',
    left: 30,
    top: 30,
    fontSize: 24,
    color: 'white'
  },
  grayOverlap: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    flexWrap: 'wrap',
  },
});

export default EditCar;
