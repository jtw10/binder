"use strict";

import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";

import SwipeCards from "react-native-swipe-cards";

import Firebase from "../config/Firebase";

import * as geolib from "geolib";

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <View style={styles.card}>
          <Image
            style={styles.card}
            source={{
              uri:
                "https://pbs.twimg.com/profile_images/711687178921717760/DLSZLtLQ_400x400.jpg"
            }}
          />
        </View>
        <Text style={styles.nameStyle}>{this.props.name}</Text>
        <Text>
          {this.props.distance}km away{"\n"}
        </Text>
        <Text>{this.props.description}</Text>
      </View>
    );
  }
}

class NoMoreCards extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text style={styles.noMoreCardsText}>Nobody new to match with :(</Text>
      </View>
    );
  }
}

export default class CardStack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        { name: "Tomato", distance: "10 km", imageSource: "red" },
        { name: "Aubergine", distance: "10 km", imageSource: "purple" },
        { name: "Courgette", distance: "10 km", imageSource: "green" },
        { name: "Blueberry", distance: "10 km", imageSource: "blue" },
        { name: "Umm...", distance: "10 km", imageSource: "cyan" },
        { name: "orange", distance: "10 km", imageSource: "orange" }
      ],
      user: {},
      userInfo: {},
      currentUserLat: "",
      currentUserLon: ""
    };
  }

  componentDidMount() {
    console.log("swipecard mounted");

    user = Firebase.auth().currentUser;
    let currentUserRef = Firebase.firestore()
      .collection("users")
      .doc(user.email);
    let userInfo = currentUserRef
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
    let userRef = Firebase.firestore().collection("users");

    let allUsers = userRef
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
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
            geolib.getPreciseDistance(currentUser, targetUser, 1000) / 1000;

          console.log(distanceBetween, "hi");

          let tempUser = {
            email: doc.data().email,
            name: doc.data().name,
            // TODO: calculate distance & get user image & check if previously matched
            distance: distanceBetween,
            description: doc.data().description
          };
          userlist.push(tempUser);
        });
        this.setState({ cards: userlist });
      })
      .catch(error => {
        console.log("Error", error);
      });
  }

  getUserDetails() {
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

    let currentUserLocation = this.state.userInfo.locationCoordinates;
    let currentUserLocationSplit = currentUserLocation.split(",");
    let currentUserLat = currentUserLocationSplit[0];
    let currentUserLon = currentUserLocationSplit[1];

    this.setState({
      currentUserLat: currentUserLat,
      currentUserLon: currentUserLon
    });
  }

  handleYup(card) {
    console.log(`Yup for ${card.name}`);
  }
  handleNope(card) {
    console.log(`Nope for ${card.name}`);
  }
  render() {
    return (
      <SwipeCards
        cards={this.state.cards}
        renderCard={cardData => <Card {...cardData} />}
        renderNoMoreCards={() => <NoMoreCards />}
        handleYup={this.handleYup}
        handleNope={this.handleNope}
      />
    );
  }
}

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 300
  },
  nameStyle: {
    fontSize: 28
  },
  noMoreCardsText: {
    fontSize: 22
  }
});
