import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList
} from "react-native";

import {Button, Avatar} from "react-native-elements";

import { TouchableOpacity } from "react-native-gesture-handler";

import Firebase from "../config/Firebase";

import * as geolib from "geolib";

import Icon from 'react-native-vector-icons/FontAwesome';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userInfo: {},
      currentUserLat: "",
      currentUserLon: "",
      matchedUsers: []
    };
    this.checkMatches = this.checkMatches.bind(this);
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

          let currentUserLocation = this.state.userInfo.locationCoordinates;
          let currentUserLocationSplit = currentUserLocation.split(",");
          let currentUserLat = currentUserLocationSplit[0];
          let currentUserLon = currentUserLocationSplit[1];

          this.setState({
            currentUserLat: currentUserLat,
            currentUserLon: currentUserLon
          });
        }
      })
      .catch(error => {
        console.log("Error getting document", error);
      });

    this.setState({ user: user, userInfo: userInfo });

    let userlist = [];
    let allUserRef = Firebase.firestore().collection("users");

    allUserRef
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let userInfo = this.state.userInfo;

          console.log(doc.id, "=>", doc.data());

          let locationCoordinates = doc.data().locationCoordinates;
          let locationSplit = locationCoordinates.split(",");
          let targetUserLat = locationSplit[0];
          let targetUserLon = locationSplit[1];

          var targetUser = {
            latitude: targetUserLat,
            longitude: targetUserLon
          };

          var currentUser = {
            latitude: this.state.currentUserLat,
            longitude: this.state.currentUserLon
          };

          var distanceBetween =
            geolib.getPreciseDistance(currentUser, targetUser, 100) / 1000;

          let tempUser = {
            email: doc.data().email,
            name: doc.data().name,
            description: doc.data().description,
            distance: distanceBetween,
            imageSource: doc.data().imageSource,
            swipedYes: doc.data().swipedYes,
            locationCoordinates: doc.data().locationCoordinates
          };

          console.log(tempUser);

          if (tempUser.swipedYes.indexOf(userInfo.email) > -1 && userInfo.swipedYes.indexOf(tempUser.email) > -1) {
            userlist.push(tempUser);
          }
        });
        this.setState({ matchedUsers: userlist });
        console.log("list matched users here:", userlist);
      })
      .catch(error => {
        console.log("Error here", error);
      });
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  checkMatches() {}

  render() {
    var userInfo = this.state.userInfo;
    var matchedUsers = [];
    for (let i = 0; i < this.state.matchedUsers.length; i++) {
      matchedUsers.push(this.state.matchedUsers[i]);
    }
    matchedUsers = this.shuffle(matchedUsers);

    return (
      <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logo.jpg')}/>
        <View style={styles.hello}>
          <Text>
            Hi {this.state.userInfo.name}, this is where you suggest a meeting
            place with your matches!
          </Text>
        </View>
        <View style={styles.list}>
        <FlatList
          data={matchedUsers}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Meet Up", {
                  matchName: item.name,
                  matchImageSource: item.imageSource,
                  matchDescription: item.description,
                  matchCoordinates: item.locationCoordinates,
                  matchEmail: item.email
                })
              }
            >
              <View style={styles.matchcard}>
                <Avatar
                  rounded
                  source={{ uri: item.imageSource }}
                  size = 'medium'
                />
                <Text style={styles.itemText}>
                  {item.name}
                  {"\b"}
                  {"\n"}
                  ({item.distance} km)
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.email}
        />
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
              buttonStyle={styles.button}
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
              buttonStyle={styles.buttonselected}
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
  itemText: {
    paddingLeft:10,
    paddingVertical:5,
    marginVertical:0,
    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor:"#abcbff",
    color: "#013670",
    width:"80%",
  },
  itemImage: {
    padding: 80,
    marginTop: 10,
    marginBottom: 0,
    marginHorizontal: 16
  },
  list:{
    marginTop:0,
    height:"70%",
    position:"absolute",
    bottom:88
  },
  hello:{
    position:"absolute",
    top:80,
    padding:50,
    paddingBottom:10
  },
  logo:{
    width:"80%",
    height: 70,
    top:38,
    left:20,
    position:"absolute",
  },
  matchcard:{
    flexDirection:"row",
    marginVertical:5,
  }
});
