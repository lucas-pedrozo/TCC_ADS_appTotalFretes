import { MAPBOX_PUBLIC_TOKEN } from "@env";
import Mapbox from "@rnmapbox/maps";

Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN);
export const CAMERA_ANIMATION_MS = 1000;
export const CAMERA_ANIMATION_MODE = "easeTo" as const;

export type MapCameraAnimationMode =
	| typeof CAMERA_ANIMATION_MODE
	| "flyTo"
	| "linearTo"
	| "moveTo"
	| "none";

type CameraAnimationConfig = {
	animationDuration?: number;
	animationMode?: MapCameraAnimationMode;
};

/**
 * 
 * @param config - Configuração da câmera
 * @param durationMs - Duração da animação
 * @returns - Configuração da câmera com duração e modo de animação
 */
export function withCameraEase<T extends Record<string, unknown>>(
	config: T,
	durationMs: number,
): T & CameraAnimationConfig {
	if (durationMs <= 0) {
		return {
			...config,
			animationDuration: 0,
			animationMode: "moveTo",
		};
	}
	return {
		...config,
		animationDuration: durationMs,
		animationMode: CAMERA_ANIMATION_MODE,
	};
}

/** Follow contínuo da navegação — animação linear e curta para reduzir atraso visual. */
export function withCameraFollow<T extends Record<string, unknown>>(
	config: T,
	durationMs: number,
): T & CameraAnimationConfig {
	if (durationMs <= 0) {
		return withCameraEase(config, 0);
	}
	return {
		...config,
		animationDuration: durationMs,
		animationMode: "linearTo",
	};
}

export const ROTA_LINE_STYLE = {
	lineColor: "#2ECC71",
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
