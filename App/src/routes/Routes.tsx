import React from "react";
import "react-native-gesture-handler";

import { StatusBar } from "react-native";
import { useThemeMode } from "../context/ThemeContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "../components/header/Header";

import Home from "../screens/private/Home";

import Start from "../screens/public/Start";
import Login from "../screens/public/Login";
import SingUp from "../screens/public/SingUp";
import { SafeAreaView } from "react-native-safe-area-context";


export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Start: undefined;
  SingUp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  const { theme } = useThemeMode();
  const backgroundColor = theme.colors.background;

  return (
    <NavigationContainer theme={theme}>
      
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={backgroundColor === "#000000" ? "light-content" : "dark-content"}
      />

      <Stack.Navigator 
        initialRouteName="Start" 
        screenOptions={{ 
          contentStyle: { backgroundColor }, 
          animation: "fade",
          header: ({ options }) => (
            options.title ? (
              <SafeAreaView style={{paddingHorizontal: 20}}>
                <Header title={options.title} />
              </SafeAreaView>
            ) : null
          ),
        }} 
      >
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />

        <Stack.Screen name="Start" component={Start} options={{headerShown: false}} />
        <Stack.Screen name="Login" component={Login} options={{title: "Login"}} />
        <Stack.Screen name="SingUp" component={SingUp} options={{title: "Cadastro"}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
