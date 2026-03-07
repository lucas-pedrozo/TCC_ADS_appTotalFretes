import "react-native-gesture-handler";

import React from "react";
import RoutesTabs from "./RoutesTabs";
import { StatusBar } from "expo-status-bar";
import PrivateRoute from "./PrivateRoutes";
import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import { useThemeMode } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Start from "../screens/auth/Start";
import Login from "../screens/auth/Login";
import EditCnh from "../screens/user/EditCnh";
import SingUp from "../screens/auth/SingUp/SingUpBasic";
import SingUpCNH from "../screens/auth/SingUp/SingUpCNH";
import EditPerfil from "../screens/user/EditPerfil";
import NewPassword from "../screens/auth/NewPassword";
import SingUpPassword from "../screens/auth/SingUp/SingUpPassword";
import ForgotPassword from "../screens/auth/ForgotPassword";
import CancelAccount from "../screens/user/CancelAccount";
import VerificationCode from "../screens/auth/VerificationCode";
import AdvancedOptions from "../screens/user/AdvancedOptions";
import DetailFreight from "../screens/freight/DetailFreight";

import type { EditPerfilMap, EditCnhMap } from "@/src/interfaces/profile";
import RenewPassword from "../screens/user/RenewPassword";

interface EditPerfilRouteParams {
  editPerfilData: EditPerfilMap;
}

interface EditCnhRouteParams {
  editCnhData: EditCnhMap;
}


export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Start: undefined;
  SingUp: undefined;
  SingUpCNH: undefined;
  SingUpPassword: undefined;
  ForgotPassword: undefined;
  VerificationCode: { email: string };
  EditPerfil: EditPerfilRouteParams;
  EditCnh: EditCnhRouteParams;
  AdvancedOptions: undefined;
  NewPassword: { email: string; resetToken: string };
  CancelAccount: undefined;
  RenewPassword: undefined;
  DetailFreight: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function PrivateHome() {
  return <PrivateRoute><RoutesTabs /></PrivateRoute>;
}

function PrivateEditPerfil() {
  return <PrivateRoute><EditPerfil /></PrivateRoute>;
}

function PrivateEditCnh() {
  return <PrivateRoute><EditCnh /></PrivateRoute>;
}

function PrivateAdvancedOptions() {
  return <PrivateRoute><AdvancedOptions /></PrivateRoute>;
}

function PrivateCancelAccount() {
  return <PrivateRoute><CancelAccount /></PrivateRoute>;
}

function PrivateRenewPassword() {
  return <PrivateRoute><RenewPassword /></PrivateRoute>;
}

function PrivateDetailFreight() {
  return <PrivateRoute><DetailFreight /></PrivateRoute>;
}

export default function Routes() {
  const { theme } = useThemeMode();
  const { t } = useTranslation();
  const backgroundColor = theme.colors.background;

  return (
    <NavigationContainer theme={theme}>
      <StatusBar
        style={backgroundColor === "#000000" ? "light" : "dark"}
        backgroundColor={backgroundColor}
      />

      <Stack.Navigator
        initialRouteName="Start"
        screenOptions={{
          header: ({ options }) => (
            options.title ? (
              <SafeAreaView edges={["top"]} style={{ paddingHorizontal: 12, backgroundColor }}>
                <Header title={options.title} />
              </SafeAreaView>
            ) : null
          ),
        }}
      >
        <Stack.Screen name="Home" component={PrivateHome} options={{ headerShown: false }} />
        <Stack.Screen name="EditPerfil" component={PrivateEditPerfil} options={{ title: t("ROUTES.EDITPERFIL") }} />
        <Stack.Screen name="EditCnh" component={PrivateEditCnh} options={{ title: t("ROUTES.EDITCNH") }} />
        <Stack.Screen name="AdvancedOptions" component={PrivateAdvancedOptions} options={{ title: t("ROUTES.ADVANCEDOPTIONS") }} />
        <Stack.Screen name="CancelAccount" component={PrivateCancelAccount} options={{ title: t("ROUTES.CANCELACCOUNT") }} />
        <Stack.Screen name="RenewPassword" component={PrivateRenewPassword} options={{ title: t("ROUTES.RENEWPASSWORD") }} />
        <Stack.Screen name="DetailFreight" component={PrivateDetailFreight} options={{ title: t("ROUTES.DETAILFREIGHT") }} />

        <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ title: t("ROUTES.LOGIN") }} />
        <Stack.Screen name="SingUp" component={SingUp} options={{ title: t("ROUTES.SIGNUPBASIC") }} />
        <Stack.Screen name="SingUpCNH" component={SingUpCNH} options={{ title: t("ROUTES.SIGNUPCNH") }} />
        <Stack.Screen name="NewPassword" component={NewPassword} options={{ title: t("ROUTES.NEWPASSWORD") }} />
        <Stack.Screen name="SingUpPassword" component={SingUpPassword} options={{ title: t("ROUTES.SIGNUPPASSWORD") }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: t("ROUTES.FORGOTPASSWORD") }} />
        <Stack.Screen name="VerificationCode" component={VerificationCode} options={{ title: t("ROUTES.VERIFICATIONCODE") }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
