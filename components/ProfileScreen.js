import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Slider
} from "react-native";

import { Avatar, Button } from 'react-native-elements';

import { TouchableOpacity } from "react-native-gesture-handler";

import * as ImagePicker from "expo-image-picker";

import Firebase from "../config/Firebase";

export default class ProfileScreen extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userInfo: {
        imageSource: "https://miro.medium.com/max/1080/0*DqHGYPBA-ANwsma2.gif"
      },
      description: "",
      userDescription: "",
      searchDistance: ""
    };
    this.userChanges = this.userChanges.bind(this);
    this.updateProfileDescription = this.updateProfileDescription.bind(this);
    this.handleSearchDistanceChange = this.handleSearchDistanceChange.bind(this);
    this.uploadToFirebase = this.uploadToFirebase.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  static defaultProps = {
    value: false,
    sliderValue: 3,
    min: 1,
    max: 5,
    step: 1
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
          this.setState({
            userInfo: doc.data(),
            searchDistance: doc.data().searchDistance
          });
        }
      })
      .catch(error => {
        console.log("Error getting document", error);
      });

    this.setState({ user: user, userInfo: userInfo });
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
        .then(
          (updateUserImageSource = () => {
            console.log("updating image url...");
            Firebase.storage()
              .ref("profilePictures/" + this.state.user.email + ".jpg")
              .getDownloadURL()
              .then(url => {
                console.log(url);
                let updatedImageUrl = {
                  imageSource: url
                };
                Firebase.firestore()
                  .collection("users")
                  .doc(this.state.user.email)
                  .update(updatedImageUrl);
              });
          })
        )
        .then(
          (confirmUpload = () => {
            console.log("...updated image url");
            this.refresh();
          })
        )
        .catch(error => {
          reject(error);
        });
    });
  };

  updateProfileDescription() {
    var description = this.state.description;
    let updatedDescription = {
      description: description
    };
    Firebase.firestore()
      .collection("users")
      .doc(user.email)
      .update(updatedDescription);
  }

  userChanges = userInput => {
    this.setState({ description: userInput });
  };

  handleSearchDistanceChange = () => {
    var searchDistance = this.state.searchDistance;
    console.log(
      "User search distance settings changed to:",
      searchDistance + "km"
    );
    let updatedSearchDistance = {
      searchDistance: searchDistance
    };
    Firebase.firestore()
      .collection("users")
      .doc(user.email)
      .update(updatedSearchDistance);
  };

  logout() {
    Firebase.auth().signOut();
    this.props.navigation.navigate("Login");
  }

  refresh() {
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
        }
      })
      .catch(error => {
        console.log("Error getting document", error);
      });

    this.setState({ user: user, userInfo: userInfo });
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.handleOnPress}>
          <Avatar
            rounded
            source={{ uri: this.state.userInfo.imageSource }}
            size="xlarge"
          />
        </TouchableOpacity>

        <Text>{this.state.userInfo.name}</Text>

        <Text>Description:</Text>
        <TextInput
          onChangeText={this.userChanges}
          placeholder="Write about yourself here!"
        >
          {this.state.userInfo.description}
        </TextInput>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.updateProfileDescription()}
        >
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>


        <Text>Search Distance: {this.state.searchDistance}km</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          value={this.state.userInfo.searchDistance}
          minimumValue={5}
          maximumValue={50}
          step={5}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#GGGGGG"
          onValueChange={val => this.setState({ searchDistance: val })}
          onSlidingComplete={this.handleSearchDistanceChange}
        />
        <Button title="← Logout" onPress={() => this.logout()} />
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
