import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import * as Animatable from 'react-native-animatable';
import { Button } from 'react-native-elements';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Animatable.Image style={styles.heart} animation="rubberBand" source={require('../assets/heart.jpg')} iterationCount={10000} />
        </View>
        <View style={styles.buttons}>

            <Button 
              title="Login"
              type="solid"
              onPress={() => this.props.navigation.navigate("Login")}
            />

            <Button 
              title="Register"
              type="outline"
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
    alignItems: "center",
    justifyContent: "center"
  },
  heart: {
    marginTop:50,
    height:150,
    width:150
  },
  buttons: {
    flexDirection: 'row',
    width:"80%",
    justifyContent:"space-between",
    position:"absolute",
    bottom:40
  }
});
