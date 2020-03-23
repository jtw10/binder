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
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userInfo: {},
      profilePicture: "https://miro.medium.com/max/1080/0*DqHGYPBA-ANwsma2.gif",
      description: "",
      userDescription: ""
    };
    this.userChanges = this.userChanges.bind(this);
    this.updateProfileDescription = this.updateProfileDescription.bind(this);
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
        }
      })
      .catch(error => {
        console.log("Error getting document", error);
      });

    this.setState({ user: user, userInfo: userInfo });

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
        const defaultPic = Firebase.storage().ref("unnamed.jpg");
        defaultPic.getDownloadURL().then(url => {
          console.log(url);
          this.setState({ profilePicture: url });
        });
      });
  }

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

  logout() {
    Firebase.auth().signOut();
    this.props.navigation.navigate("Login");
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Text>{this.state.userInfo.name}</Text>
        <Image
          source={{ uri: this.state.profilePicture }}
          style={{ height: 250, width: 250 }}
        />
        <FirebaseStorageUploader />

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
