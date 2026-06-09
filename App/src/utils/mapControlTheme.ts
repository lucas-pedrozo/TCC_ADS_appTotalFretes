import type { ThemeColors, ThemeMode } from "@/src/context/ThemeContext";

export function getMapControlTheme(mode: ThemeMode, colors: ThemeColors) {
	const isDark = mode === "dark";

	return {
		button: {
			backgroundColor: isDark ? colors.bgTertiary : colors.bg,
			borderColor: colors.bgNonary,
			borderWidth: 1 as const,
		},
		foreground: isDark ? colors.text : colors.text,
		panel: {
			backgroundColor: isDark ? colors.bgSecondary : colors.bg,
			borderColor: colors.bgNonary,
			borderWidth: 1 as const,
		},
		panelMuted: {
			backgroundColor: isDark ? colors.bgTertiary : colors.bgSecondary,
		},
	};
}
