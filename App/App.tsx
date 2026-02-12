import React from "react";

import "./global.css";
import Routes from "./src/routes/Routes";
import { ThemeProvider } from "./src/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";

import AlertNotification from "./src/components/alert/AlertNotification";
import { useNotification, NotificationProvider } from "./src/context/NotificationContext";

const AlertNotificationGlobal = () => {
  const { notification, hideNotification } = useNotification();

  return (
    <AlertNotification
      visible={notification.visible}
      status={notification.status}
      message={notification.message}
      onDismiss={hideNotification}
    />
  );
};

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NotificationProvider>
          <KeyboardProvider>
            <AlertNotificationGlobal />
            <Routes />
          </KeyboardProvider>
        </NotificationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;