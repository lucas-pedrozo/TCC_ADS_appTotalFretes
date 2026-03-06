import "./global.css";
import "./src/i18n";
import Routes from "./src/routes/Routes";
import { ThemeProvider } from "./src/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AuthProvider } from "./src/context/AuthContext";
import { SingUpProvider } from "./src/context/SingUpContext";
import AlertNotification from "./src/components/alert/AlertDefault";
import { useAlertDefault, AlertDefaultProvider } from "./src/context/AlertDefaultContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import { colorScheme } from "nativewind";

const AlertNotificationGlobal = () => {
  const { alert, hideAlert } = useAlertDefault();

  return (
    <AlertNotification
      key={`${alert.status}-${alert.message ?? ""}-${alert.visible ? "1" : "0"}`}
      visible={alert.visible}
      status={alert.status}
      message={alert.message}
      onDismiss={hideAlert}
    />
  );
};

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider key={colorScheme.get()}>
        <LanguageProvider>
          <AuthProvider>
            <AlertDefaultProvider>
              <KeyboardProvider>
                <SingUpProvider>
                  <AlertNotificationGlobal />
                  <Routes />
                </SingUpProvider>
              </KeyboardProvider>
            </AlertDefaultProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;