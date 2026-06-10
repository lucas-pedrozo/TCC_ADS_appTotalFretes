import "./global.css";
import "./src/i18n";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Routes from "./src/routes/Routes";
import { ThemeProvider } from "./src/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AuthProvider } from "./src/context/AuthContext";
import { SingUpProvider } from "./src/context/SingUpContext";
import { RegisterVehicleProvider } from "./src/context/RegisterVehicleContext";
import AlertNotification from "./src/components/alert/AlertDefault";
import { useAlertDefault, AlertDefaultProvider } from "./src/context/AlertDefaultContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import { FreightUserProvider } from "./src/context/FreightUserContext";

const AlertNotificationGlobal = () => {
  const { alert, hideAlert } = useAlertDefault();

  return (
    <AlertNotification
      visible={alert.visible}
      status={alert.status}
      message={alert.message}
      onDismiss={hideAlert}
    />
  );
};

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AlertDefaultProvider>
            <FreightUserProvider>
              <KeyboardProvider>
                <SingUpProvider>
                  <RegisterVehicleProvider>
                    <AlertNotificationGlobal />
                    <Routes />
                  </RegisterVehicleProvider>
                </SingUpProvider>
              </KeyboardProvider>
            </FreightUserProvider>
            </AlertDefaultProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;