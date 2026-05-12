import Mapbox from "@rnmapbox/maps";
import { MAPBOX_PUBLIC_TOKEN } from "@env";

Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN);

export const CAMERA_ANIMATION_MS = 500;

export const ROTA_LINE_STYLE = {
	lineColor: "#2ECC71",
	lineWidth: 5,
	lineCap: "round" as const,
	lineJoin: "round" as const,
};

/** Halo sob a linha (efeito “brilho” estilo apps de navegação). */
export const ROTA_LINE_GLOW_STYLE = {
	lineColor: "#5DADE2",
	lineWidth: 14,
	lineOpacity: 0.35,
	lineCap: "round" as const,
	lineJoin: "round" as const,
};

export const ROTA_LINE_NAV_STYLE = {
	lineColor: "#74D4FF",
	lineWidth: 5,
	lineCap: "round" as const,
	lineJoin: "round" as const,
};

export const THEME_COLORS = {
	dark: "#74AEF1",
	light: "#3498db",
} as const;

export function getMapStyleURL(darkMode: boolean): string {
	return darkMode ? Mapbox.StyleURL.Dark : Mapbox.StyleURL.Street;
}
