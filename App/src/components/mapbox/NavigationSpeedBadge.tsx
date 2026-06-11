import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useMapNavUI } from "@/src/utils/mapControlTheme";

interface NavigationSpeedBadgeProps {
	speedKmh: number | null;
	visible?: boolean;
}

export default function NavigationSpeedBadge({
	speedKmh,
	visible = true,
}: NavigationSpeedBadgeProps) {
	const { t } = useTranslation();
	const navUi = useMapNavUI();
	if (!visible) return null;

	const hasSpeed = speedKmh != null && Number.isFinite(speedKmh);
	const displaySpeed = hasSpeed ? Math.round(Math.max(0, speedKmh)) : null;

	return (
		<View
			className="px-[18px] py-2.5 rounded-full justify-center items-center shadow shadow-black/12"
			style={{ backgroundColor: navUi.pillBg }}
			accessibilityRole="text"
			accessibilityLabel={
				displaySpeed != null
					? `${t("MAP.SPEED_A11Y")}: ${displaySpeed} ${t("MAP.SPEED_UNIT_KMH")}`
					: t("MAP.SPEED_A11Y")
			}
		>
			<Text
				className="text-lg font-semibold tracking-wide"
				style={{ color: navUi.textPrimary }}
				numberOfLines={1}
			>
				{displaySpeed != null ? `${displaySpeed} ${t("MAP.SPEED_UNIT_KMH")}` : "—"}
			</Text>
		</View>
	);
}
