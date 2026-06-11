import React from "react";
import { TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { NavigationRoutesIcon } from "@/src/components/mapbox/NavigationRoutesIcon";

type NavigationRoutesButtonProps = {
	onPress: () => void;
	active?: boolean;
	size?: number;
	iconColor?: string;
	borderColor?: string;
	backgroundColor?: string;
	activeBorderColor?: string;
	accessibilityLabel?: string;
};

export default function NavigationRoutesButton({
	onPress,
	active = false,
	size = 44,
	iconColor = "#5F6368",
	borderColor = "#DADCE0",
	backgroundColor = "#FFFFFF",
	activeBorderColor = "#1A73E8",
	accessibilityLabel,
}: NavigationRoutesButtonProps) {
	const { t } = useTranslation();

	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.75}
			className="items-center justify-center rounded-full border"
			style={{
				width: size,
				height: size,
				backgroundColor,
				borderColor: active ? activeBorderColor : borderColor,
				borderWidth: active ? 2 : 1,
			}}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel ?? t("MAP.ROUTE_OVERVIEW_A11Y")}
			accessibilityState={{ selected: active }}
		>
			<NavigationRoutesIcon size={Math.round(size * 0.5)} color={active ? activeBorderColor : iconColor} />
		</TouchableOpacity>
	);
}
