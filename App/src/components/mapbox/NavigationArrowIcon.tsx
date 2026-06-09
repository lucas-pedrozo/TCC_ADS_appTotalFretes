import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const GOOGLE_NAV_BLUE = "#1A73E8";
/** O ícone `navigation` do Material aponta para nordeste (45°) por padrão. */
const MATERIAL_NAV_BASE_DEG = 45;

type NavigationArrowIconProps = {
	bearing?: number;
	size?: number;
};

/**
 * Seta compacta estilo Google Maps (ícone vetorial, sem fundo branco).
 */
export const NavigationArrowIcon = memo(function NavigationArrowIcon({
	bearing = 0,
	size = 26,
}: NavigationArrowIconProps) {
	const rotation = Number.isFinite(bearing) ? bearing : 0;
	const iconSize = Math.round(size * 0.85);

	return (
		<View
			style={[styles.root, { width: size, height: size }]}
			pointerEvents="none"
			collapsable={false}
		>
			<View
				style={{
					transform: [
						{ rotate: `${rotation - MATERIAL_NAV_BASE_DEG}deg` },
					],
				}}
			>
				<MaterialIcons name="navigation" size={iconSize} color={GOOGLE_NAV_BLUE} />
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	root: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "transparent",
	},
});
