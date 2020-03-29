import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button
} from "react-native";
import * as Permissions from "expo-permissions";

import Firebase from "../config/Firebase";

const defaultImage =
  "https://firebasestorage.googleapis.com/v0/b/binderatbcit.appspot.com/o/default_profile.jpg?alt=media&token=1dd61c65-f633-4469-a7fc-73d4142c4fc7";

export default class RegisterScreen extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    locationCoordinates: "",
    imageSource: ""
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

  handleSignUp = () => {
    const { email, password, name, locationCoordinates } = this.state;

    Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        let newData = {
          name: name,
          email: email,
          locationCoordinates: locationCoordinates,
          imageSource: defaultImage,
          swipedAlready: [],
          swipedYes: []
        };
        newData.swipedAlready.push(email);
        console.log("DATA BEING WRITTEN: ", newData);
        Firebase.firestore()
          .collection("users")
          .doc(email)
          .set(newData);
        this.props.navigation.navigate("Profile");
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
          placeholder="Full Name"
        />
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
        <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
        <Button
          title="← Back to Login"
          onPress={() => this.props.navigation.navigate("Login")}
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
    backgroundColor: "#FFA611",
    borderColor: "#FFA611",
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
