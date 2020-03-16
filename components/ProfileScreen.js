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

import FirebaseStorageUploader from "./FirebaseStorageUploader";

import Firebase from "../config/Firebase";

export default class ProfileScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      profilePicture: ""
    };
  }

  componentDidMount() {
    user = Firebase.auth().currentUser;
    this.setState({ user: user });

    const ref = Firebase.storage().ref(
      "profilePictures/" + user.email + ".jpg"
    );
    ref
      .getDownloadURL()
      .then(url => {
        console.log(url);
        this.setState({ profilePicture: url });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: this.state.profilePicture }}
          style={{ height: 250, width: 250 }}
        />
        <Text>
          User information goes here. Eg. My name is Jim Bob and I am a compsci
          genius. Let's study together!
        </Text>
        <FirebaseStorageUploader />
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
