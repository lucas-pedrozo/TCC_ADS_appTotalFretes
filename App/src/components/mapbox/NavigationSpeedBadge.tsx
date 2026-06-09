import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import { getMapControlTheme } from "@/src/utils/mapControlTheme";

interface NavigationSpeedBadgeProps {
	speedKmh: number | null;
	visible?: boolean;
}

export default function NavigationSpeedBadge({
	speedKmh,
	visible = true,
}: NavigationSpeedBadgeProps) {
	const { t } = useTranslation();
	const { mode } = useThemeMode();
	const colors = useThemeColors();
	const mapControlTheme = getMapControlTheme(mode, colors);

	if (!visible) return null;

	const hasSpeed = speedKmh != null && Number.isFinite(speedKmh);
	const displaySpeed = hasSpeed ? Math.round(Math.max(0, speedKmh)) : null;

	return (
		<View
			style={[
				styles.container,
				mapControlTheme.button,
			]}
			accessibilityRole="text"
			accessibilityLabel={
				displaySpeed != null
					? `${t("MAP.SPEED_A11Y")}: ${displaySpeed} ${t("MAP.SPEED_UNIT_KMH")}`
					: t("MAP.SPEED_A11Y")
			}
		>
			<Text style={[styles.speedText, { color: mapControlTheme.foreground }]} numberOfLines={1}>
				{displaySpeed != null ? `${displaySpeed} ${t("MAP.SPEED_UNIT_KMH")}` : "—"}
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
