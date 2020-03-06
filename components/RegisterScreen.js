import React from "react";
import { Image, Button, View, Text, StyleSheet } from "react-native";

export default class RegisterScreen extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Text>Register Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate("Login")}
          onPress={() => this.props.navigation.navigate("Home")}
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
  }
});
