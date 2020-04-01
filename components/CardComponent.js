"use strict";

import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Alert } from "react-native";

import SwipeCards from "react-native-swipe-cards";

import Firebase from "../config/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";

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
              uri: `${this.props.imageSource}`
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
        { name: "Tomato", distance: "10", imageSource: "red" },
        { name: "Aubergine", distance: "10", imageSource: "purple" },
        { name: "Courgette", distance: "10", imageSource: "green" },
        { name: "Blueberry", distance: "10", imageSource: "blue" },
        { name: "Umm...", distance: "10", imageSource: "cyan" },
        { name: "orange", distance: "10", imageSource: "orange" }
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
            imageSource: doc.data().imageSource
          };
          console.log(tempUser.distance);
          if (
            userInfo.swipedAlready.indexOf(tempUser.email) < 0 &&
            userInfo.searchDistance >= tempUser.distance
          ) {
            userlist.push(tempUser);
          }
        });
        this.setState({ cards: userlist });
      })
      .catch(error => {
        console.log("Error", error);
      });
  }

  handleYup(card) {
    console.log(`Yup for ${card.name}`);

    let userRef = Firebase.firestore()
      .collection("users")
      .doc(user.email);

    userRef.update({
      swipedAlready: firebase.firestore.FieldValue.arrayUnion(card.email)
    });

    userRef.update({
      swipedYes: firebase.firestore.FieldValue.arrayUnion(card.email)
    });
  }

  handleNope(card) {
    console.log(`Nope for ${card.name}`);

    let userRef = Firebase.firestore()
      .collection("users")
      .doc(user.email);

    userRef.update({
      swipedAlready: firebase.firestore.FieldValue.arrayUnion(card.email)
    });
  }

  render() {
    return (
      <SwipeCards
        cards={this.state.cards}
        renderCard={cardData => <Card {...cardData} />}
        renderNoMoreCards={() => <NoMoreCards />}
        handleYup={this.handleYup}
        handleNope={this.handleNope}
        smoothTransition={false}
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
