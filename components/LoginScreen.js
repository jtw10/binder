import React from "react";
import {
  TouchableHighlight,
  Modal,
  Image,
  Button,
  View,
  Text,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";

export default class LoginScreen extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Text>Login Screen</Text>
        <Button
          title="Go Home"
          onPress={() => this.props.navigation.navigate("Home")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff0",
    alignItems: "center",
    justifyContent: "center"
  }
});
