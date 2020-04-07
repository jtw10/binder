import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  Image
} from "react-native";
import * as Permissions from "expo-permissions";
import { Button } from 'react-native-elements';

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

    const { email, password, locationCoordinates } = this.state;
    if (
      this.state.email == "" ||
      this.state.password == "" ||
      this.state.locationCoordinates == ""
    ) {
      Alert.alert(
        "Uh oh.",
        "Looks like your e-mail or password is incorrect",
        [{ text: "Try Again!", onPress: () => console.log("Try Again!") }],
        { cancelable: false }
      );
    } else {

    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate("Profile"))
      .catch(error => {
        console.log(error);
        Alert.alert(
          "Uh oh.",
          "Looks like your e-mail or password is incorrect",
          [{ text: "Try Again!", onPress: () => console.log("Try Again!") }],
          { cancelable: false }
        );
      });

    let updatedLocation = {
      locationCoordinates: locationCoordinates
    };
    Firebase.firestore()
      .collection("users")
      .doc(email)
      .update(updatedLocation);
  }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/logo.jpg')}/>
        <View style={styles.content}>
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
          <Button 
            buttonStyle={styles.button} 
            title="Login"
            type="solid"
            onPress={this.handleLogin}

          />
          <Button
            title="Don't have an account yet? Sign up"
            type="clear"
            onPress={() => this.props.navigation.navigate("Register")}
          />
        </View>
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
    borderRadius: 5,
    width: 200
  },
  logo:{
    width:"80%",
    height: 80,
    top:"20%",
    position:"absolute"
  },
  content:{
    backgroundColor:"#fff",
    width:"100%",
    alignItems:"center",
    position:"absolute",
    bottom:"25%"
  }
});
