import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import PrivateRoute from "./PrivateRoutes";
import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import { useThemeMode } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RoutesTabs from "./RoutesTabs";

import Start from "../screens/public/Start";
import Login from "../screens/public/login/Login";
import SingUp from "../screens/public/singUp/SingUpBasic";
import SingUpCNH from "../screens/public/singUp/SingUpCNH";
import SingUpPassword from "../screens/public/singUp/SingUpPassword";
import ForgotPassword from "../screens/public/newPassword/ForgotPassword";
import VerificationCode from "../screens/public/newPassword/VerificationCode";
import NewPassword from "../screens/public/newPassword/NewPassword";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Start: undefined;
  SingUp: undefined;
  SingUpCNH: undefined;
  SingUpPassword: undefined;
  ForgotPassword: undefined;
  VerificationCode: { email: string };
  NewPassword: { email: string; resetToken: string };
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
        <Stack.Screen name="Home" component={() => <PrivateRoute><RoutesTabs /></PrivateRoute>} options={{headerShown: false}} />
   
        <Stack.Screen name="Start" component={Start} options={{headerShown: false}} />
        <Stack.Screen name="Login" component={Login} options={{title: t("routes.login")}} />
        <Stack.Screen name="SingUp" component={SingUp} options={{title: t("routes.signUpBasic")}} />
        <Stack.Screen name="SingUpCNH" component={SingUpCNH} options={{title: t("routes.signUpCnh")}} />  
        <Stack.Screen name="SingUpPassword" component={SingUpPassword} options={{title: t("routes.signUpPassword")}} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: t("routes.forgotPassword") }} />
        <Stack.Screen name="VerificationCode" component={VerificationCode} options={{ title: t("routes.verificationCode") }} />
        <Stack.Screen name="NewPassword" component={NewPassword} options={{ title: t("routes.newPassword") }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
