import React from "react";

import "./global.css";
import Routes from "./src/routes/Routes";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNotification } from "./src/context/NotificationContext";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { NotificationProvider } from "./src/context/NotificationContext";
import AlertNotification from "./src/components/alert/AlertNotification";

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
      <NotificationProvider>
        <KeyboardProvider>
          <AlertNotificationGlobal />
          <Routes />
        </KeyboardProvider>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}

export default App;