import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Appearance, Platform, View } from "react-native";
import { DefaultTheme, Theme } from "@react-navigation/native";
import * as SystemUI from "expo-system-ui";
import * as SplashScreen from "expo-splash-screen";
import { setStatusBarStyle } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync().catch(() => { });

const THEME_KEY = "app:themeMode";
const BACKGROUND = { dark: "#000000", light: "#FFFFFF" } as const;
const TEXT = { dark: "#FFFFFF", light: "#000000" } as const;

export type ThemeMode = "light" | "dark";

export type ThemeColors = {
	bg: string;
	bgSecondary: string;
	bgTertiary: string;
	bgQuaternary: string;
	bgQuinary: string;
	bgSenary: string;
	bgSeptenary: string;
	bgOctonary: string;
	bgNonary: string;
	text: string;
	textSecondary: string;
	textTertiary: string;
	textQuaternary: string;
	textQuinary: string;
	textSenary: string;
	textSeptenary: string;
};

const COLORS: Record<ThemeMode, ThemeColors> = {
	dark: {
		bg: "#000000",
		bgSecondary: "#202020",
		bgTertiary: "#383838",
		bgQuaternary: "#FFFFFF",
		bgQuinary: "#D1F9E2",
		bgSenary: "#E3992C",
		bgSeptenary: "#FF0000",
		bgOctonary: "#74AEF1",
		bgNonary: "rgba(255,255,255,0.1)",
		text: "#FFFFFF",
		textSecondary: "rgba(255,255,255,0.6)",
		textTertiary: "#000000",
		textQuaternary: "rgba(0,0,0,0.6)",
		textQuinary: "#FF0000",
		textSenary: "#FFAA2E",
		textSeptenary: "rgba(255,255,255,0.8)",
	},
	light: {
		bg: "#FFFFFF",
		bgSecondary: "#E5E5E5",
		bgTertiary: "#3F3F3F",
		bgQuaternary: "#000000",
		bgQuinary: "#D1F9E2",
		bgSenary: "#E3992C",
		bgSeptenary: "#FF0000",
		bgOctonary: "#74AEF1",
		bgNonary: "rgba(0,0,0,0.1)",
		text: "#000000",
		textSecondary: "rgba(0,0,0,0.6)",
		textTertiary: "#FFFFFF",
		textQuaternary: "rgba(255,255,255,0.6)",
		textQuinary: "#FF0000",
		textSenary: "#FFAA2E",
		textSeptenary: "rgba(0,0,0,0.8)",
	},
};

type ThemeContextValue = {
	mode: ThemeMode;
	colors: ThemeColors;
	theme: Theme;
	toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [mode, setMode] = useState<ThemeMode>("light");
	const [isReady, setIsReady] = useState(false);
	const isMounted = useRef(true);

	const applyNativeEffects = useCallback((m: ThemeMode) => {
		Appearance.setColorScheme(m);
		setStatusBarStyle(m === "dark" ? "light" : "dark");
		if (Platform.OS === "android") {
			SystemUI.setBackgroundColorAsync(BACKGROUND[m]);
		}
	}, []);

	useEffect(() => {
		isMounted.current = true;
		const load = async () => {
			try {
				const stored = await loadThemeFromStorage();
				const resolved: ThemeMode = stored === "light" || stored === "dark" ? stored : "light";
				if (isMounted.current) {
					applyNativeEffects(resolved);
					setMode(resolved);
				}
			} catch {
				if (isMounted.current) applyNativeEffects("light");
			} finally {
				if (isMounted.current) {
					setIsReady(true);
					SplashScreen.hideAsync().catch(() => { });
				}
			}
		};
		load();
		return () => { isMounted.current = false; };
	}, [applyNativeEffects]);

	const toggleMode = useCallback(async () => {
		const next: ThemeMode = mode === "dark" ? "light" : "dark";
		applyNativeEffects(next);
		setMode(next);
		await saveThemeToStorage(next);
	}, [applyNativeEffects, mode]);

	const colors = useMemo(() => COLORS[mode], [mode]);

	const theme = useMemo<Theme>(() => ({
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			background: BACKGROUND[mode],
			card: BACKGROUND[mode],
			border: BACKGROUND[mode],
			text: TEXT[mode],
		},
	}), [mode]);

	if (!isReady) return null;

	return (
		<ThemeContext.Provider value={{ mode, colors, theme, toggleMode }}>
			<View style={{ flex: 1, backgroundColor: BACKGROUND[mode] }}>
				{children}
			</View>
		</ThemeContext.Provider>
	);
};

export const useThemeMode = (): ThemeContextValue => {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useThemeMode must be used within ThemeProvider");
	return ctx;
};

export const useThemeColors = (): ThemeColors => {
	const { colors } = useThemeMode();
	return colors;
};

export const useIconColor = (): string => {
	const { mode } = useThemeMode();
	return mode === "dark" ? "#FFFFFF" : "#000000";
};

const saveThemeToStorage = async (theme: ThemeMode) => {
	try {
		await AsyncStorage.setItem(THEME_KEY, theme);
	} catch {}
};

const loadThemeFromStorage = async (): Promise<ThemeMode> => {
	try {
		const stored = await AsyncStorage.getItem(THEME_KEY);
		return stored === "light" || stored === "dark" ? stored : "light";
	} catch {
		return "light";
	}
};