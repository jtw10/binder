import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Image
} from "react-native";
import * as Permissions from "expo-permissions";
import { Button } from 'react-native-elements';

import Firebase from "../config/Firebase";

const defaultImage =
  "https://firebasestorage.googleapis.com/v0/b/binderatbcit.appspot.com/o/default_profile.jpg?alt=media&token=1dd61c65-f633-4469-a7fc-73d4142c4fc7";

export default class RegisterScreen extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    locationCoordinates: "",
    imageSource: "",
    address: "",
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
    const { email, password, name, locationCoordinates, address } = this.state;

    Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        let newData = {
          name: name,
          email: email,
          locationCoordinates: locationCoordinates,
          imageSource: defaultImage,
          address: address,
          swipedAlready: [],
          swipedYes: [],
          searchDistance: 50
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
        <Image style={styles.logo} source={require('../assets/logo.jpg')}/>
        <View style={styles.content}>
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
          <TextInput
            style={styles.inputBox}
            value={this.state.address}
            onChangeText={address => this.setState({ address })}
            placeholder="Address"
          />
          <Button
            title="Signup"
            buttonStyle={styles.button}
            type="solid"
            onPress={this.handleSignUp}
          />

          <Button
            title="← Have an account? Back to Login"
            type="clear"
            onPress={() => this.props.navigation.navigate("Login")}
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
    bottom:"20%"
  }
});
