import { useEffect, useMemo } from "react";
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
    tintColor: string;
    iconBg: string;
    icon?: IoniconName;
    appName: string;
    titleKey: "ALERT.SUCCESS_TITLE" | "ALERT.ERROR_TITLE" | "ALERT.LOADING_TITLE" | "ALERT.NOTIFICATION_TITLE";
}

const STATUS_CONFIG: Record<AlertStatus, StatusConfig> = {
    success: {
        tintColor: "#166534",
        iconBg: "#22c55e",
        icon: "checkmark-circle",
        appName: "Sistema",
        titleKey: "ALERT.SUCCESS_TITLE",
    },
    error: {
        tintColor: "#7f1d1d",
        iconBg: "#ef4444",
        icon: "close-circle",
        appName: "Sistema",
        titleKey: "ALERT.ERROR_TITLE",
    },
    loading: {
        tintColor: "#1e293b",
        iconBg: "#475569",
        appName: "Sistema",
        titleKey: "ALERT.LOADING_TITLE",
    },
    alert: {
        tintColor: "#713f12",
        iconBg: "#eab308",
        icon: "alert-circle",
        appName: "Sistema",
        titleKey: "ALERT.NOTIFICATION_TITLE",
    },
};

const AlertIcon = ({ status, icon, bg }: { status: AlertStatus; icon?: IoniconName; bg: string }) => (
    <View style={[CssAlertNotification.iconWrapper, { backgroundColor: bg }]}>
        {status === "loading"
            ? <ActivityIndicator size="small" color="#fff" />
            : icon && <Ionicons name={icon} size={22} color="#fff" />
        }
    </View>
);

function AlertDefault({ visible, status, message, onDismiss }: AlertDefaultProps) {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const config = STATUS_CONFIG[status];

    useEffect(() => {
        if (!visible || !onDismiss || status === "loading") return;
        const id = setTimeout(onDismiss, 1000);
        return () => clearTimeout(id);
    }, [visible, status, onDismiss]);

    const containerStyle = useMemo<ViewStyle>(() => ({
        top: insets.top + 12,
        left: 12,
        right: 12,
        backgroundColor: config.tintColor,
    }), [insets.top, config.tintColor]);

    if (!visible) return null;

    return (
        <animation.iPhoneBounceDown
            style={[CssAlertNotification.container, containerStyle]}
            accessibilityRole="alert"
        >
            <View style={CssAlertNotification.row}>
                <AlertIcon status={status} icon={config.icon} bg={config.iconBg} />
                <View style={CssAlertNotification.content}>
                    <Text style={CssAlertNotification.appName}>{config.appName}</Text>
                    <Text style={CssAlertNotification.title}>{t(config.titleKey)}</Text>
                    {!!message && (
                        <Text style={CssAlertNotification.message} numberOfLines={2}>
                            {message}
                        </Text>
                    )}
                </View>
            </View>
        </animation.iPhoneBounceDown>
    );
}

export default AlertDefault;