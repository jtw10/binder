import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import ProfileScreen from "./components/ProfileScreen";
import ChatScreen from "./components/ChatScreen";
import MatchScreen from "./components/MatchScreen";

import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const SwitchNavigator = createSwitchNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Login: {
      screen: LoginScreen
    },
    Register: {
      screen: RegisterScreen
    },
    Profile: {
      screen: ProfileScreen
    },
    Match: {
      screen: MatchScreen
    },
    Chat: {
      screen: ChatScreen
    }
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(SwitchNavigator);
