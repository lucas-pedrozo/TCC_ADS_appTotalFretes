import React, { memo, useMemo } from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type NavigationManeuverMarkerProps = {
	bearing?: number | null;
	mapHeading?: number | null;
	size?: number;
};

function normalizeDegrees(value: number): number {
	let angle = value % 360;
	if (angle > 180) angle -= 360;
	if (angle < -180) angle += 360;
	return angle;
}

/**
 * Círculo cinza com seta branca na rota (estilo Google Maps).
 */
export const NavigationManeuverMarker = memo(function NavigationManeuverMarker({
	bearing = 0,
	mapHeading = 0,
	size = 36,
}: NavigationManeuverMarkerProps) {
	const iconSize = Math.round(size * 0.56);

	return (
		<View
			style={{
				width: size,
				height: size,
				borderRadius: size / 2,
				backgroundColor: "rgba(154, 160, 166, 0.92)",
				alignItems: "center",
				justifyContent: "center",
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.2,
				shadowRadius: 2,
				elevation: 3,
			}}
			pointerEvents="none"
			collapsable={false}
		>
			<View
				style={{
					width: iconSize,
					height: iconSize,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<MaterialIcons name="navigation" size={iconSize} color="#FFFFFF" />
			</View>
		</View>
	);
});
