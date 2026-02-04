import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, ActivityIndicator, ViewStyle } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import animation from "@/src/utils/animation";
import { AlertStatus } from "@/src/types/statusNotify";
import { CssAlertNotification } from "@/src/css/cssAlertNotification";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface AlertNotificationProps {
  visible: boolean;
  status: AlertStatus;
  message?: string;
  onDismiss?: () => void;
}

interface StatusConfig {
  backgroundColor: string;
  icon?: IoniconName;
  title: string;
}

const STATUS_CONFIG: Record<AlertStatus, StatusConfig> = {
  success: {
    backgroundColor: "#22c55e",
    icon: "checkmark-circle-outline",
    title: "Tudo certo!",
  },
  error: {
    backgroundColor: "#ef4444",
    icon: "close-circle-outline",
    title: "Algo deu errado!",
  },
  loading: {
    backgroundColor: "#334155",
    title: "Carregando...",
  },
  alert: {
    backgroundColor: "#eab308",
    icon: "alert-circle-outline",
    title: "Notificação",
  },
};

function AlertNotification({ visible, status, message, onDismiss }: AlertNotificationProps) {
  const insets = useSafeAreaInsets();
  const config = STATUS_CONFIG[status];
  
  useEffect(() => {
    if (!visible || !onDismiss || status === "loading") return;
    const timeoutId = setTimeout(onDismiss, 1200);
    return () => clearTimeout(timeoutId);
  }, [visible, status, onDismiss]);
  
  if (!visible) return null;
  
  const containerStyle: ViewStyle = {
    top: insets.top + 30,
    left: 10,
    right: 10,
    backgroundColor: config.backgroundColor,
  };

  return (
    <animation.iPhoneBounceDown
      style={[CssAlertNotification.container, containerStyle]}
      accessibilityRole="alert"
      accessibilityLabel={config.title}
    >
      <View style={CssAlertNotification.row}>
        {status === "loading" ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : config.icon ? (
          <Ionicons name={config.icon} size={36} color="#fff" />
        ) : null}

        <View style={CssAlertNotification.content}>
          <Text style={CssAlertNotification.title}>{config.title}</Text>
          {!!message && <Text style={CssAlertNotification.message}>{message}</Text>}
        </View>
      </View>
    </animation.iPhoneBounceDown>
  );
}

export default AlertNotification;

