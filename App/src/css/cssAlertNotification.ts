import { StyleSheet } from "react-native";

/**
 * Estilos do alert de notificação.
 * Alinhado ao design do app: rounded-2xl, espaçamento 16, tipografia base/semibold.
 */
export const CssAlertNotification = StyleSheet.create({
	container: {
		position: "absolute",
		borderRadius: 16,
		overflow: "hidden",
		zIndex: 9999,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 12,
		elevation: 12,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "rgba(255,255,255,0.2)",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
		paddingHorizontal: 16,
		paddingVertical: 16,
	},
	iconWrapper: {
		width: 40,
		height: 40,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	content: {
		flex: 1,
		flexDirection: "column",
		gap: 2,
	},
	appName: {
		color: "rgba(255,255,255,0.65)",
		fontSize: 11,
		fontWeight: "600",
		letterSpacing: 0.4,
		textTransform: "uppercase",
	},
	title: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 16,
		letterSpacing: -0.2,
	},
	message: {
		color: "rgba(255,255,255,0.88)",
		fontSize: 13,
		fontWeight: "400",
		lineHeight: 18,
	},
});
