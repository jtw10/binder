import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import ProfileScreen from "./components/ProfileScreen";
import ChatScreen from "./components/ChatScreen";
import MatchScreen from "./components/MatchScreen";
import SuggestionScreen from "./components/SuggestionScreen";

import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

console.disableYellowBox = true;

const StackNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null
      }
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null
      }
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: {
        header: null
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        header: null
      }
    },
    Match: {
      screen: MatchScreen,
      navigationOptions: {
        header: null
      }
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: {
        header: null
      }
    },
    Suggestion: {
      screen: SuggestionScreen
    }
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(StackNavigator);
