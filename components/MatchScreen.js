import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";

import {Button} from "react-native-elements";

import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import Firebase from "../config/Firebase";
import CardStack from "./CardComponent";

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userInfo: {}
    };
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
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
       <Image style={styles.logo} source={require('../assets/logo.jpg')}/>
        <View style={styles.card}>
         <CardStack />
        </View>
        <View style={styles.tabbar}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Match")}>
            <Button
              type="clear"
              icon={
                <Icon
                  name="meetup"
                  size={40}
                  color="#44aee3"
                />
              }
              buttonStyle={styles.buttonselected}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate("Chat")}>
            <Button
              type="clear"
              icon={
                <Icon
                  name="comments"
                  size={40}
                  color="#44aee3"
                />
              }
              buttonStyle={styles.button}
            />
          </TouchableOpacity>

          <TouchableOpacity  onPress={() => this.props.navigation.navigate("Profile")}>
          <Button
            type="clear"
            icon={
              <Icon
                name="user"
                size={40}
                color="#44aee3"
              />
            }
            buttonStyle={styles.button}
          />
          </TouchableOpacity>
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
    marginBottom: 0,
    paddingVertical: 0,
    alignItems: "center",
    width: 115,
    height:70,
    borderTopColor:"#44aee3",
    borderTopWidth:2,
    
  },
  buttonselected: {
    marginTop: 30,
    marginBottom: 0,
    paddingVertical: 0,
    alignItems: "center",
    width: 115,
    height:70,
    borderTopColor:"#44aee3",
    borderTopWidth:4
  },
  tabbar:{
    flexDirection: 'row',
    width:"90%",
    justifyContent:"space-between",
    position:"absolute",
    bottom:12,
  },
  card:{
    height:"78%",
    position:'absolute',
    bottom:88
  },
  logo:{
    width:"80%",
    height: 70,
    top:38,
    left:20,
    position:"absolute"
  },
});
