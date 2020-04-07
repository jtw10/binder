import React from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import * as Permissions from "expo-permissions";

import Firebase from "../config/Firebase";

export default class LoginScreen extends React.Component {
  state = {
    email: "",
    password: "",
    locationCoordinates: ""
  };

  _getLocationPermissions = async () => {
    let { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({ locationPermission: false });
    } else {
      this.setState({ locationPermission: true });
    }
  };

  componentDidMount() {
    this._getLocationPermissions();

    navigator.geolocation.getCurrentPosition(
      position => {
        console.log(position.coords);
        console.log(
          "My position: " +
            position.coords.latitude +
            ", " +
            position.coords.longitude
        );
        let coordinates =
          position.coords.latitude + ", " + position.coords.longitude;

        this.setState({
          locationCoordinates: coordinates
        });
      },
      error => alert(JSON.stringify(error))
    );
  }

  handleLogin = () => {
    if (
      this.state.email == "" ||
      this.state.password == "" ||
      this.state.locationCoordinates == ""
    ) {
      Alert.alert(
        "Uh oh.",
        "Looks like your e-mail or password is incorrect",
        { text: "Try Again!", onPress: () => console.log("Try Again!") },
        { cancelable: false }
      );
    } else {
      Firebase.auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => this.props.navigation.navigate("Profile"))
        .catch(error => {
          console.log(error);
          Alert.alert(
            "Uh oh.",
            "Looks like your e-mail or password is incorrect",
            { text: "Try Again!", onPress: () => console.log("Try Again!") },
            { cancelable: false }
          );
        });
      let updatedLocation = {
        locationCoordinates: this.state.locationCoordinates
      };
      Firebase.firestore()
        .collection("users")
        .doc(this.state.email)
        .update(updatedLocation);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          placeholder="Email"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputBox}
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          placeholder="Password"
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Button
          title="Don't have an account yet? Sign up"
          onPress={() => this.props.navigation.navigate("Register")}
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
