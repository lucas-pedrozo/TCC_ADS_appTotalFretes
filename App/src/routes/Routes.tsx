import React from "react";
import "react-native-gesture-handler";
import { StatusBar, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";

import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";

import Home from "../screens/private/Home";
import Login from "../screens/public/Login";
import Start from "../screens/public/Start";
import { useThemeMode } from "../context/ThemeContext";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Start: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: "fade",
};

export default function Routes() {
  const { theme } = useThemeMode();

  return (
    <NavigationContainer theme={theme}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={theme.colors.background === "#000000" ? "light-content" : "dark-content"}
      />
      <Stack.Navigator initialRouteName="Start" screenOptions={screenOptions}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: true,
            headerBackVisible: true,
            headerTitle: "Login",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
            headerTitleStyle: { color: theme.colors.text },
          }}
        />

        <Stack.Screen
          name="Home"
          component={Home}
        />

        <Stack.Screen
          name="Start"
          component={Start}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
