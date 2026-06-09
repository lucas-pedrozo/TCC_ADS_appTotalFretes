import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/src/context/ThemeContext";

interface NavigationSpeedBadgeProps {
	speedKmh: number | null;
	visible?: boolean;
}

export default function NavigationSpeedBadge({
	speedKmh,
	visible = true,
}: NavigationSpeedBadgeProps) {
	const { t } = useTranslation();
	const colors = useThemeColors();

	if (!visible) return null;

	const displaySpeed = speedKmh != null && Number.isFinite(speedKmh)
		? Math.round(speedKmh)
		: 0;

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: colors.bg,
					borderColor: colors.bgTertiary,
				},
			]}
			accessibilityRole="text"
			accessibilityLabel={`${t("MAP.SPEED_A11Y")}: ${displaySpeed} ${t("MAP.SPEED_UNIT_KMH")}`}
		>
			<Text style={[styles.speedText, { color: colors.text }]} numberOfLines={1}>
				{displaySpeed} {t("MAP.SPEED_UNIT_KMH")}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 10,
		borderWidth: 1,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.12,
		shadowRadius: 8,
		elevation: 6,
	},
	speedText: {
		fontSize: 18,
		fontWeight: "600",
		letterSpacing: 0.5,
	},
});
