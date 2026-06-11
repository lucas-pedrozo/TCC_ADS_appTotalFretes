import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMapNavUI } from "@/src/utils/mapControlTheme";
import MapDirectionPill from "@/src/components/mapbox/MapDirectionPill";

interface MapNavigationHeaderProps {
	title: string;
	directionIcon?: React.ComponentProps<typeof Ionicons>["name"];
	directionLabel?: string;
}

export default function MapNavigationHeader({
	title,
	directionIcon,
	directionLabel,
}: MapNavigationHeaderProps) {
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();
	const navUi = useMapNavUI();
	const showDirection = Boolean(directionIcon && directionLabel?.trim());

	return (
		<View
			className="absolute left-4 right-4 z-30 gap-2"
			style={{ top: insets.top + 8 }}
			pointerEvents="box-none"
		>
			<View
				className="flex-row items-center rounded-full px-2 py-2 shadow-lg"
				style={{ backgroundColor: navUi.pillBg }}
			>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					className="w-10 h-10 rounded-full items-center justify-center"
					style={{ backgroundColor: navUi.circleButtonBg }}
					accessibilityRole="button"
					accessibilityLabel="Voltar"
				>
					<Ionicons name="arrow-back" size={20} color={navUi.textPrimary} />
				</TouchableOpacity>
				<Text
					className="flex-1 text-center text-[17px] font-bold tracking-wide"
					style={{ color: navUi.textPrimary }}
					numberOfLines={1}
				>
					{title}
				</Text>
				<View className="w-10 h-10" />
			</View>

			{showDirection ? (
				<MapDirectionPill iconName={directionIcon!} label={directionLabel!} />
			) : null}
		</View>
	);
}
