import React from "react";
import { View, Text, StyleSheet } from "react-native";

import * as ImagePicker from "expo-image-picker";

import { TouchableOpacity } from "react-native-gesture-handler";

import Firebase from "../config/Firebase";

export default class FirebaseStorageUploader extends React.Component {
  state = {
    user: {}
  };

  componentDidMount() {
    user = Firebase.auth().currentUser;
    this.setState({ user: user });
  }

  handleOnPress = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images"
    })
      .then(result => {
        if (!result.cancelled) {
          const { height, width, type, uri } = result;
          return this.uriToBlob(uri);
        }
      })
      .then(blob => {
        return this.uploadToFirebase(blob);
      })
      .then(snapshot => {
        console.log("File uploaded");
      })
      .catch(error => {
        throw error;
      });
  };

  uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  uploadToFirebase = blob => {
    return new Promise((resolve, reject) => {
      console.log(this.state.user.email);

      var storageRef = Firebase.storage().ref();
      storageRef
        .child("profilePictures/" + this.state.user.email + ".jpg")
        .put(blob, {
          contentType: "image/jpeg"
        })
        .then(snapshot => {
          blob.close();
          resolve(snapshot);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this.handleOnPress}>
          <Text>Upload Photo</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#333",
    textAlign: "center",
    maxWidth: 150
  }
});
