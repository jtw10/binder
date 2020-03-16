import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";

import Firebase from "../config/Firebase";

export default class RegisterScreen extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    location: ""
  };

  handleSignUp = () => {
    const { email, password, name } = this.state;

    Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate("Profile"))
      .catch(error => console.log(error));

    let newData = { name: name, email: email };
    Firebase.firestore()
      .collection("users")
      .doc(email)
      .set(newData);
  };

  render() {
    const { navigation } = this.props;

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
