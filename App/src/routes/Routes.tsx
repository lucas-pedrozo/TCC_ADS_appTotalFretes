import "react-native-gesture-handler";

import RoutesTabs from "./RoutesTabs";
import { StatusBar } from "expo-status-bar";
import PrivateRoute from "./PrivateRoutes";
import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import { useThemeMode } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Start from "../screens/public/start/Start";
import Login from "../screens/public/login/Login";
import EditCnh from "../screens/private/editcnh/EditCnh";
import SingUp from "../screens/public/singUp/SingUpBasic";
import SingUpCNH from "../screens/public/singUp/SingUpCNH";
import EditPerfil from "../screens/private/editPerfil/EditPerfil";
import NewPassword from "../screens/public/newPassword/NewPassword";
import SingUpPassword from "../screens/public/singUp/SingUpPassword";
import ForgotPassword from "../screens/public/newPassword/ForgotPassword";
import CancelAccount from "../screens/private/cancelAccount/CancelAccount";
import VerificationCode from "../screens/public/newPassword/VerificationCode";
import AdvancedOptions from "../screens/private/advancedOptions/AdvancedOptions";

import type { EditPerfilMap, EditCnhMap } from "@/src/interfaces/profile";

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
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
        <Stack.Screen name="Home" component={() => <PrivateRoute><RoutesTabs /></PrivateRoute>} options={{ headerShown: false }} />
        <Stack.Screen name="EditPerfil" component={() => <PrivateRoute><EditPerfil /></PrivateRoute>} options={{ title: t("ROUTES.EDITPERFIL") }} />
        <Stack.Screen name="EditCnh" component={() => <PrivateRoute><EditCnh /></PrivateRoute>} options={{ title: t("ROUTES.EDITCNH") }} />
        <Stack.Screen name="AdvancedOptions" component={() => <PrivateRoute><AdvancedOptions /></PrivateRoute>} options={{ title: t("ROUTES.ADVANCEDOPTIONS") }} />
        <Stack.Screen name="CancelAccount" component={() => <PrivateRoute><CancelAccount /></PrivateRoute>} options={{ title: t("ROUTES.CANCELACCOUNT") }} />

        <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ title: t("ROUTES.LOGIN") }} />
        <Stack.Screen name="SingUp" component={SingUp} options={{ title: t("ROUTES.SIGNUPBASIC") }} />
        <Stack.Screen name="SingUpCNH" component={SingUpCNH} options={{ title: t("ROUTES.SIGNUPCNH") }} />
        <Stack.Screen name="NewPassword" component={NewPassword} options={{ title: t("ROUTES.NEWPASSWORD") }} />
        <Stack.Screen name="SingUpPassword" component={SingUpPassword} options={{ title: t("ROUTES.SIGNUPPASSWORD") }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: t("ROUTES.FORGOTPASSWORD") }} />
        <Stack.Screen name="VerificationCode" component={VerificationCode} options={{ title: t("ROUTES.VERIFICATIO  NCODE") }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
