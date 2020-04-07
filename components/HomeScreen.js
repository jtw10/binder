import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Button } from 'react-native-elements';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image style={styles.logo} source={require('../assets/logo.jpg')}/>
         
        </View>
        <View style={styles.buttons}>

            <Button 
              title="Login"
              buttonStyle={styles.button}
              type="solid"
              onPress={() => this.props.navigation.navigate("Login")}
            />

            <Button 
              title="Register"
              buttonStyle={styles.button}
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
    justifyContent: "center",
    backgroundColor:"#fff"
  },
  logo: {
    height:400,
    width:380
  },
  button:{
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: "center",
    borderRadius: 5,
    width: 120
  },
  buttons: {
    flexDirection: 'row',
    width:"80%",
    justifyContent:"space-between",
    position:"absolute",
    bottom:40
  },
  logo:{
    width:"100%",
    height: 100,
    top:"25%",
    position:"absolute"
  }
});
