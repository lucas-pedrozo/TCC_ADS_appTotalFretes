import React, { memo } from "react";
import { MaterialIcons } from "@expo/vector-icons";

type NavigationRoutesIconProps = {
	size?: number;
	color?: string;
};

/** Ícone de visão geral de rotas (estilo Google Maps). */
export const NavigationRoutesIcon = memo(function NavigationRoutesIcon({
	size = 22,
	color = "#5F6368",
}: NavigationRoutesIconProps) {
	return <MaterialIcons name="alt-route" size={size} color={color} />;
});
