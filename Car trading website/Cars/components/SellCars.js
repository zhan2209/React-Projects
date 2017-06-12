import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  ImagePickerIOS,
  Image,
  TouchableHighlight
} from 'react-native';
import { Title, Header, Text, Spinner, Container, Content, List, ListItem, InputGroup, Input, Icon, Picker, Button } from 'native-base';
import Camera from 'react-native-camera';

const IMAGE_SIZE = 80;

class SellCars extends React.Component {
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
      images: {},
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

  sellCar() {
    fetch('http://localhost:3000/api/sellcar', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.props.username,
        car: this.state,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.toIndex();
      })
  }

  deleteImage(key) {
    var images = this.state.images;
    delete images[key];
    this.setState(images);
  }

  render() {
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

    return (
      <Container>
        <Header>
          <Title>Sell Cars</Title>
        </Header>
        <Content>
          <List>
            <ListItem>
              <InputGroup>
                <Input
                  autoCapitalize="none"
                  inlineLabel
                  label="Brand"
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
          </List>
          <View style={styles.imageRow}>
            {carImages}
          </View>
          <Button
            style={{ alignSelf: 'center', marginTop: 20, marginBottom: 20 }}
            onPress={() => this.sellCar()}
            >
            Sell It!
          </Button>
        </Content>
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

export default SellCars;
