import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, ActivityIndicator, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";

import { Ionicons } from "@expo/vector-icons";
import animation from "@/src/utils/animation";
import { AlertStatus } from "@/src/types/statusNotify";
import { CssAlertNotification } from "@/src/css/cssAlertNotification";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface AlertDefaultProps {
  visible: boolean;
  status: AlertStatus;
  message?: string;
  onDismiss?: () => void;
}

interface StatusConfig {
  backgroundColor: string;
  icon?: IoniconName;
  titleKey: "ALERT.SUCCESS_TITLE" | "ALERT.ERROR_TITLE" | "ALERT.LOADING_TITLE" | "ALERT.NOTIFICATION_TITLE";
}

const STATUS_CONFIG: Record<AlertStatus, StatusConfig> = {
  success: {
    backgroundColor: "#22c55e",
    icon: "checkmark-circle-outline",
    titleKey: "ALERT.SUCCESS_TITLE",
  },
  error: {
    backgroundColor: "#ef4444",
    icon: "close-circle-outline",
    titleKey: "ALERT.ERROR_TITLE",
  },
  loading: {
    backgroundColor: "#334155",
    titleKey: "ALERT.LOADING_TITLE",
  },
  alert: {
    backgroundColor: "#eab308",
    icon: "alert-circle-outline",
    titleKey: "ALERT.NOTIFICATION_TITLE",
  },
};

function AlertDefault({ visible, status, message, onDismiss }: AlertDefaultProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const config = STATUS_CONFIG[status];
  const title = t(config.titleKey);

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
      accessibilityLabel={title}
    >
      <View style={CssAlertNotification.row}>
        {status === "loading" ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : config.icon ? (
          <Ionicons name={config.icon} size={36} color="#fff" />
        ) : null}

        <View style={CssAlertNotification.content}>
          <Text style={CssAlertNotification.title}>{title}</Text>
          {!!message && <Text style={CssAlertNotification.message}>{message}</Text>}
        </View>
      </View>
    </animation.iPhoneBounceDown>
  );
}

export default AlertDefault;

