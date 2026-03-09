import { StyleSheet } from "react-native";

export const CssAlertNotification = StyleSheet.create({
    container: {
        position: "absolute",
        borderRadius: 12,
        zIndex: 9999,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 16
    },
    content: {
        flex: 1,
        flexDirection: "column",
        gap: 2
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    },
    message: {
        color: "#fff",
        fontSize: 14,
    },
});
