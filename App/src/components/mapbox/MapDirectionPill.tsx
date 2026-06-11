import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMapNavUI } from "@/src/utils/mapControlTheme";

interface MapDirectionPillProps {
	iconName: React.ComponentProps<typeof Ionicons>["name"];
	label: string;
}

export default function MapDirectionPill({ iconName, label }: MapDirectionPillProps) {
	const navUi = useMapNavUI();

	return (
		<View
			className="flex-row items-center gap-2 self-stretch rounded-full border px-3.5 py-2.5 shadow shadow-black/15"
			style={{
				backgroundColor: navUi.pillBg,
				borderColor: navUi.directionBorder,
			}}
			pointerEvents="none"
		>
			<Ionicons name={iconName} size={18} color={navUi.textPrimary} />
			<Text
				className="shrink text-sm font-semibold leading-[18px]"
				style={{ color: navUi.textPrimary }}
				numberOfLines={1}
			>
				{label}
			</Text>
		</View>
	);
}
