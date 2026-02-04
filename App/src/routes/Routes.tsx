import React from "react";
import "react-native-gesture-handler";
import { StatusBar } from "react-native";

import {
  NavigationContainer,
  DefaultTheme,
  Theme,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";

import Home from "../screens/private/Home";
import Login from "../screens/public/Login";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: "fade",
};

const currentMode: "light" | "dark" = "dark";

const AppTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: currentMode === "dark" ? "#000000" : "#FFFFFF",
  },
};

export default function Routes() {
  return (
    <NavigationContainer theme={AppTheme}>
      <StatusBar
        barStyle={currentMode === "dark" ? "light-content" : "dark-content"}
      />
      <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
