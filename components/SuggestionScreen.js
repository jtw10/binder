import React from "react";
import { Text, View, StyleSheet, Image, Button, FlatList } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

import Firebase from "../config/Firebase";

import * as geolib from "geolib";

export default class SuggestionScreen extends React.Component {
  state = {
    user: {},
    userInfo: {},
    currentUserLat: "",
    currentUserLon: "",
    messaegs: []
  };

  componentDidMount() {
    user = Firebase.auth().currentUser;
    let userRef = Firebase.firestore()
      .collection("users")
      .doc(user.email);
    let userInfo = userRef
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No user");
        } else {
          let currentUserLocation = doc.data().locationCoordinates;
          let currentUserLocationSplit = currentUserLocation.split(",");
          let currentUserLat = currentUserLocationSplit[0];
          let currentUserLon = currentUserLocationSplit[1];

          this.setState({
            userInfo: doc.data(),
            searchDistance: doc.data().searchDistance,
            currentUserLat: currentUserLat,
            currentUserLon: currentUserLon
          });
        }
      })
      .catch(error => {
        console.log("Error getting document", error);
      });

    this.setState({ user: user, userInfo: userInfo });
  }

  render() {
    const { navigation } = this.props;

    const matchName = navigation.getParam(
      "matchName",
      "User information unavailable"
    );
    const matchImageSource = navigation.getParam(
      "matchImageSource",
      "https://1m19tt3pztls474q6z46fnk9-wpengine.netdna-ssl.com/wp-content/themes/unbound/images/No-Image-Found-400x264.png"
    );
    const matchDescription = navigation.getParam(
      "matchDescription",
      "User information unvailable"
    );
    const matchEmail = navigation.getParam(
      "matchEmail",
      "User information unvailable"
    );
    const matchCoordinates = navigation.getParam(
      "matchCoordinates",
      "User information unavailable"
    );

    let userLat = this.state.currentUserLat;
    let userLon = this.state.currentUserLon;

    let matchUserLocation = matchCoordinates;
    let matchUserLocationSplit = matchUserLocation.split(",");
    let matchUserLat = matchUserLocationSplit[0];
    let matchUserLon = matchUserLocationSplit[1];

    var midpoint = geolib.getCenter([
      { latitude: userLat, longitude: userLon },
      { latitude: matchUserLat, longitude: matchUserLon }
    ]);

    console.log("The midpoint coordinates are:", midpoint);

    var suggestedLocations = [];

    if (midpoint != "") {
      fetch(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
          "key=AIzaSyCIF6EknD6lPU8XAywcFE6McHPGNr70ur4" +
          "&location=" +
          midpoint.latitude +
          "," +
          midpoint.longitude +
          "&radius=4000" +
          "&type=cafe"
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.results.length == 1) {
            suggestedLocations.push(responseJson.results[0]);
          }
          if (responseJson.results.length > 1) {
            if (responseJson.results.length < 4) {
              for (let i = 1; i < responseJson.results.length; i++) {
                suggestedLocations.push(responseJson.results[i]);
              }
            }
            if (responseJson.results.length >= 4) {
              for (let i = 1; i < 4; i++) {
                suggestedLocations.push(responseJson.results[i]);
              }
            }
          }
          console.log("YOUR SUGGESTED LOCATIONS", suggestedLocations);
        });
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{matchName}</Text>
        <Image
          style={styles.itemImage}
          source={{ uri: matchImageSource }}
          resizeMode="cover"
        />
        <View style={styles.itemText}>
          <Text>User Description: </Text>
          <Text>{matchDescription}</Text>
          <Text>User Contact: </Text>
          <Text>{matchEmail}</Text>
        </View>
        <View style={styles.container}>
          <Text>
            Here are some suggested locations to meet up with your match.
            Suggestions are based on a central point between you and your match.
            E-mail your match to arrange a meet up time and location!
          </Text>
          <FlatList
            data={suggestedLocations}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.itemText}>
                  Name: {item.name}
                  {"\n"}
                  Rating: {item.rating}
                  {"\n"}
                  Address: {item.vicinity}
                </Text>
              </View>
            )}
            keyExtractor={item => item.name}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemText: {
    backgroundColor: "#E3E4E5",
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 0,
    marginBottom: 0,
    marginHorizontal: 16,
    color: "#013670"
  },
  itemImage: {
    padding: 80,
    marginBottom: 0,
    marginHorizontal: 16,
    height: 300
  },
  bottom_margin: {
    marginTop: 10,
    padding: 6
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    backgroundColor: "#E3E4E5",
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 5,
    marginTop: 0,
    marginBottom: 0,
    marginHorizontal: 16,
    marginTop: 10,
    color: "#013670"
  }
});
