import { useMemo } from "react";
import type { ThemeColors, ThemeMode } from "@/src/context/ThemeContext";
import { useThemeMode } from "@/src/context/ThemeContext";

export type MapNavUI = {
	sheetBg: string;
	sheetHandle: string;
	textPrimary: string;
	textSecondary: string;
	pillBg: string;
	circleButtonBg: string;
	circleButtonBorder: string;
	directionBorder: string;
	scrollDivider: string;
	cardBg: string;
	cardBorder: string;
};

/** Paleta escura da navegação do mapa (referência do design/Figma). */
const MAP_NAV_UI_DARK: MapNavUI = {
	sheetBg: "#212121",
	sheetHandle: "#424242",
	textPrimary: "#FFFFFF",
	textSecondary: "#9E9E9E",
	pillBg: "#212121",
	circleButtonBg: "#2C2C2E",
	circleButtonBorder: "rgba(255,255,255,0.12)",
	directionBorder: "#4A5D23",
	scrollDivider: "rgba(255,255,255,0.08)",
	cardBg: "#2C2C2E",
	cardBorder: "rgba(255,255,255,0.1)",
};

/** Paleta clara — superfícies claras com texto escuro sobre o mapa light. */
const MAP_NAV_UI_LIGHT: MapNavUI = {
	sheetBg: "#FFFFFF",
	sheetHandle: "#BDBDBD",
	textPrimary: "#212121",
	textSecondary: "#757575",
	pillBg: "#FFFFFF",
	circleButtonBg: "#F0F0F0",
	circleButtonBorder: "rgba(0,0,0,0.12)",
	directionBorder: "#4A5D23",
	scrollDivider: "rgba(0,0,0,0.08)",
	cardBg: "#F5F5F5",
	cardBorder: "rgba(0,0,0,0.1)",
};

export function getMapNavUI(mode: ThemeMode): MapNavUI {
	return mode === "dark" ? MAP_NAV_UI_DARK : MAP_NAV_UI_LIGHT;
}

export function useMapNavUI(): MapNavUI {
	const { mode } = useThemeMode();
	return useMemo(() => getMapNavUI(mode), [mode]);
}

export function getMapControlTheme(mode: ThemeMode, _colors: ThemeColors) {
	const nav = getMapNavUI(mode);
	return {
		button: {
			backgroundColor: nav.circleButtonBg,
			borderColor: nav.circleButtonBorder,
			borderWidth: 1 as const,
		},
		pill: {
			backgroundColor: nav.pillBg,
			borderColor: "transparent",
			borderWidth: 0 as const,
		},
		foreground: nav.textPrimary,
		panel: {
			backgroundColor: nav.sheetBg,
			borderColor: nav.scrollDivider,
			borderWidth: 0 as const,
		},
		panelMuted: {
			backgroundColor: nav.cardBg,
		},
		nav,
	};
}
