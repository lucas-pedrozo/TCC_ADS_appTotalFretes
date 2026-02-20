import "./global.css";
import Routes from "./src/routes/Routes";
import { ThemeProvider } from "./src/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AuthProvider } from "./src/context/AuthContext";
import { SingUpProvider } from "./src/context/SingUpContext";
import AlertNotification from "./src/components/alert/AlertDefault";
import { useAlertDefault, AlertDefaultProvider } from "./src/context/AlertDefaultContext";

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
      <ThemeProvider>
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
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;