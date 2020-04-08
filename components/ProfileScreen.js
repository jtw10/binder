import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Slider,
  Image,
  Alert,
  ScrollView
} from "react-native";

import { Avatar, Button } from 'react-native-elements';

import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";

import * as ImagePicker from "expo-image-picker";

import Firebase from "../config/Firebase";

import Icon from 'react-native-vector-icons/FontAwesome';

export default class ProfileScreen extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userInfo: {
        imageSource: "https://miro.medium.com/max/1080/0*DqHGYPBA-ANwsma2.gif"
      },
      description: "",
      userDescription: "",
      searchDistance: ""
    };
    this.userChanges = this.userChanges.bind(this);
    this.updateProfileDescription = this.updateProfileDescription.bind(this);
    this.handleSearchDistanceChange = this.handleSearchDistanceChange.bind(this);
    this.uploadToFirebase = this.uploadToFirebase.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  static defaultProps = {
    value: false,
    sliderValue: 3,
    min: 1,
    max: 5,
    step: 1
  };

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
          this.setState({
            userInfo: doc.data(),
            searchDistance: doc.data().searchDistance
          });
        }
      })
      .catch(error => {
        console.log("Error getting document", error);
      });

    this.setState({ user: user, userInfo: userInfo });
  }

  handleOnPress = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images"
    })
      .then(result => {
        if (!result.cancelled) {
          const { height, width, type, uri } = result;
          return this.uriToBlob(uri);
        }
      })
      .then(blob => {
        return this.uploadToFirebase(blob);
      })
      .then(snapshot => {
        console.log("File uploaded");
      })
      .catch(error => {
        throw error;
      });
  };

  uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  uploadToFirebase = blob => {
    return new Promise((resolve, reject) => {
      console.log(this.state.user.email);

      var storageRef = Firebase.storage().ref();
      storageRef
        .child("profilePictures/" + this.state.user.email + ".jpg")
        .put(blob, {
          contentType: "image/jpeg"
        })
        .then(snapshot => {
          blob.close();
          resolve(snapshot);
        })
        .then(
          (updateUserImageSource = () => {
            console.log("updating image url...");
            Firebase.storage()
              .ref("profilePictures/" + this.state.user.email + ".jpg")
              .getDownloadURL()
              .then(url => {
                console.log(url);
                let updatedImageUrl = {
                  imageSource: url
                };
                Firebase.firestore()
                  .collection("users")
                  .doc(this.state.user.email)
                  .update(updatedImageUrl);
              });
          })
        )
        .then(
          (confirmUpload = () => {
            console.log("...updated image url");
            this.refresh();
          })
        )
        .catch(error => {
          reject(error);
        });
    });
  };

  updateProfileDescription() {
    var description = this.state.description;
    let updatedDescription = {
      description: description
    };
    Firebase.firestore()
      .collection("users")
      .doc(user.email)
      .update(updatedDescription);

 

      Alert.alert(
        "Congrats",
        "Description Updated Successfully!",["ok"],
        { cancelable: false }
      );
  }

  userChanges = userInput => {
    this.setState({ description: userInput });
  };

  handleSearchDistanceChange = () => {
    var searchDistance = this.state.searchDistance;
    console.log(
      "User search distance settings changed to:",
      searchDistance + "km"
    );
    let updatedSearchDistance = {
      searchDistance: searchDistance
    };
    Firebase.firestore()
      .collection("users")
      .doc(user.email)
      .update(updatedSearchDistance);
  };

  logout() {
    Firebase.auth().signOut();
    this.props.navigation.navigate("Login");
  }

  refresh() {
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
        <View style={styles.mypic}>
          <TouchableOpacity onPress={this.handleOnPress}>
            <Avatar
              rounded
              source={{ uri: this.state.userInfo.imageSource }}
              size="xlarge"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.textstyle}>{this.state.userInfo.name}</Text>
        <View style={styles.descriptioncontainer}>
          <Text style={styles.textstyle}>Description:</Text>
          <View style={styles.descriptioninput}>
          <ScrollView contentContainerStyle={styles.descriptionWrapper} scrollEnabled={false} keyboardShouldPersistTaps={"never"}>
          <TextInput
            style={styles.description}
            multiline={true}
            onChangeText={this.userChanges}
            placeholder="Write about yourself here!"
          >
         
            {this.state.userInfo.description}
          </TextInput>
          <Button
            icon={
                <Icon
                  name="check"
                  size={25}
                  color="#44aee3"
                />
              }
            type="outline"
            buttonStyle={styles.descriptionbutton}
            onPress={() => this.updateProfileDescription()}
          />
          </ScrollView>
          </View>
        </View>

        <Text style={styles.textstyle}>Search Distance: {this.state.searchDistance}km</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          value={this.state.userInfo.searchDistance}
          minimumValue={5}
          maximumValue={50}
          step={5}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#GGGGGG"
          onValueChange={val => this.setState({ searchDistance: val })}
          onSlidingComplete={this.handleSearchDistanceChange}
        />
        </View>

        <View style={styles.logout}>
          <Button 
            type="clear"
              icon={
                <Icon
                  name="sign-out"
                  size={40}
                  color="#44aee3"
                />
              }
            onPress={() => this.logout()} 
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
            buttonStyle={styles.buttonselected}
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
    fontSize: 30,
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
    borderTopWidth:2
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
    bottom:12
  },
  logout:{
    position:"absolute",
    top:50,
    right:20
  },
  description:{
    width:"60%",
    backgroundColor:"#c8dedc",
    marginVertical:20
  },
  descriptionbutton:{
    width:40,
    height:40,
    marginVertical:20
  },
  descriptioninput:{
    flexDirection: "row"
  },
  mypic:{
    position:'absolute',
    top:140,
    marginVertical:10
  },
  textstyle:{
    fontSize:20,
    fontWeight:"bold"
  },
  descriptioncontainer:{
    marginVertical:20,
    alignItems:"center"
  },
  logo:{
    width:"80%",
    height: 70,
    top:38,
    left:20,
    position:"absolute"
  },
  content:{
    alignItems:"center",
    backgroundColor:"#fff"
  },
  descriptionWrapper: {
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "center"
  },
});
