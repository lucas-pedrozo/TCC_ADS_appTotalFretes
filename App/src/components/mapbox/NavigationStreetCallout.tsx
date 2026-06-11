import React, { memo } from "react";
import { View, Text } from "react-native";

const GOOGLE_NAV_BLUE = "#1A73E8";

type NavigationStreetCalloutProps = {
	label: string;
};

/**
 * Balão azul com nome da rua no cruzamento (estilo Google Maps).
 */
export const NavigationStreetCallout = memo(function NavigationStreetCallout({
	label,
}: NavigationStreetCalloutProps) {
	return (
		<View className="items-center" pointerEvents="none" collapsable={false}>
			<View
				style={{
					backgroundColor: GOOGLE_NAV_BLUE,
					borderRadius: 8,
					paddingHorizontal: 10,
					paddingVertical: 5,
					maxWidth: 180,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 1 },
					shadowOpacity: 0.2,
					shadowRadius: 3,
					elevation: 4,
				}}
			>
				<Text
					className="text-xs font-semibold"
					style={{ color: "#FFFFFF" }}
					numberOfLines={1}
				>
					{label}
				</Text>
			</View>
			<View
				style={{
					width: 0,
					height: 0,
					borderLeftWidth: 6,
					borderRightWidth: 6,
					borderTopWidth: 7,
					borderLeftColor: "transparent",
					borderRightColor: "transparent",
					borderTopColor: GOOGLE_NAV_BLUE,
					marginTop: -1,
				}}
			/>
		</View>
	);
});
