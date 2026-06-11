import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useMapNavUI } from "@/src/utils/mapControlTheme";

interface NavigationRecenterButtonProps {
	onPress: () => void;
	visible?: boolean;
}

export default function NavigationRecenterButton({
	onPress,
	visible = true,
}: NavigationRecenterButtonProps) {
	const { t } = useTranslation();
	const navUi = useMapNavUI();
	if (!visible) return null;

	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.85}
			className="flex-row items-center gap-2 px-4 py-2.5 rounded-full shadow shadow-black/18"
			style={{ backgroundColor: navUi.pillBg }}
			accessibilityRole="button"
			accessibilityLabel={t("MAP.RECENTER_A11Y")}
		>
			<Ionicons name="locate" size={18} color={navUi.textPrimary} />
			<Text
				className="text-[15px] font-semibold tracking-tight"
				style={{ color: navUi.textPrimary }}
				numberOfLines={1}
			>
				{t("MAP.RECENTER")}
			</Text>
		</TouchableOpacity>
	);
}
