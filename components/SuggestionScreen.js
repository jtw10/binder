import React from "react";
import { Text, View, StyleSheet,FlatList } from "react-native";

import { Avatar, Button } from 'react-native-elements';

// import { GiftedChat } from "react-native-gifted-chat";
import Icon from 'react-native-vector-icons/FontAwesome';

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
            if (responseJson.results.length < 7) {
              for (let i = 1; i < responseJson.results.length; i++) {
                suggestedLocations.push(responseJson.results[i]);
              }
            }
            if (responseJson.results.length >= 7) {
              for (let i = 1; i < 7; i++) {
                suggestedLocations.push(responseJson.results[i]);
              }
            }
          }
          console.log("YOUR SUGGESTED LOCATIONS", suggestedLocations);
        });
    }

    return (
      <View style={styles.container}>
        <View style={styles.back}>
          <Button 
            type="clear"
              icon={
                <Icon
                  name="chevron-left"
                  size={35}
                  color="#000"
                />
              }
            onPress={() => this.props.navigation.navigate("Chat")}
          />
        </View>

        <View style={styles.pic_name}>
          <Avatar
            rounded
            source={{ uri: matchImageSource }}
            size = 'large'
          />
         
          <Text style={styles.name}> {matchName} </Text>
          </View>

          <Text style={styles.itemText}>
            Description:{"\b\n"}
            {matchDescription} {"\b\n\n"}
            E-mail your match to arrange a meet up time and location!{"\b\n"}
            Email: {"\b"} {matchEmail}
          </Text>
    

  

          <Text style={styles.itemText}>
          {"\n"}
            Here are some suggested locations to meet up with your match.
            Suggestions are based on a central point between you and your match.
          </Text>
          <FlatList
            data={suggestedLocations}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.itemText}>
                  {item.name}
                  {"\n"}
                  Rating: {item.rating}
                  {"\n"}
                  Address: {item.vicinity}
                </Text>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>

    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  name:{
    fontWeight:"100",
    fontSize:30,
    marginVertical:15,
  },
  pic_name:{
    flexDirection:"row",
    marginTop:50,
    marginBottom:20
  },
  back:{
    position:"absolute",
    top:60,
    left:10
  },
  itemText:{
    marginHorizontal:18,
    marginVertical:5
  }
});
