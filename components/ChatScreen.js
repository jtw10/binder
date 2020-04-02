import React from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity
} from "react-native";

import Firebase from "../config/Firebase";

import * as geolib from "geolib";

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userInfo: {},
      currentUserLat: "",
      currentUserLon: "",
      matchedUsers: []
    };
    this.checkMatches = this.checkMatches.bind(this);
  }

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
          this.setState({ userInfo: doc.data() });

          let currentUserLocation = this.state.userInfo.locationCoordinates;
          let currentUserLocationSplit = currentUserLocation.split(",");
          let currentUserLat = currentUserLocationSplit[0];
          let currentUserLon = currentUserLocationSplit[1];

          this.setState({
            currentUserLat: currentUserLat,
            currentUserLon: currentUserLon
          });
        }
      })
      .catch(error => {
        console.log("Error getting document", error);
      });

    this.setState({ user: user, userInfo: userInfo });

    let userlist = [];
    let allUserRef = Firebase.firestore().collection("users");

    allUserRef
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let userInfo = this.state.userInfo;

          console.log(doc.id, "=>", doc.data());

          let locationCoordinates = doc.data().locationCoordinates;
          let locationSplit = locationCoordinates.split(",");
          let targetUserLat = locationSplit[0];
          let targetUserLon = locationSplit[1];

          var targetUser = {
            latitude: targetUserLat,
            longitude: targetUserLon
          };

          var currentUser = {
            latitude: this.state.currentUserLat,
            longitude: this.state.currentUserLon
          };

          var distanceBetween =
            geolib.getPreciseDistance(currentUser, targetUser, 100) / 1000;

          let tempUser = {
            email: doc.data().email,
            name: doc.data().name,
            description: doc.data().description,
            distance: distanceBetween,
            imageSource: doc.data().imageSource,
            swipedYes: doc.data().swipedYes
          };

          console.log(tempUser);

          if (tempUser.swipedYes.indexOf(userInfo.email) > -1) {
            userlist.push(tempUser);
          }
        });
        this.setState({ matchedUsers: userlist });
        console.log("list matched users here:", userlist);
      })
      .catch(error => {
        console.log("Error here", error);
      });
  }

  checkMatches() {}

  render() {
    var matchedUsers = [];
    for (let i = 0; i < this.state.matchedUsers.length; i++) {
      matchedUsers.push(this.state.matchedUsers[i]);
    }
    console.log(matchedUsers);

    return (
      <View style={styles.container}>
        <Text>Hi {this.state.userInfo.name}, this is where you chat</Text>

        <Button
          title="Match"
          onPress={() => this.props.navigation.navigate("Match")}
        />
        <Button
          title="Chat"
          onPress={() => this.props.navigation.navigate("Chat")}
        />
        <Button
          title="Profile"
          onPress={() => this.props.navigation.navigate("Profile")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  inputBox: {
    width: "85%",
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: "#d3d3d3",
    borderBottomWidth: 1,
    textAlign: "center"
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: "#F6820D",
    borderColor: "#F6820D",
    borderWidth: 1,
    borderRadius: 5,
    width: 200
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff"
  },
  buttonSignup: {
    fontSize: 12
  }
});
