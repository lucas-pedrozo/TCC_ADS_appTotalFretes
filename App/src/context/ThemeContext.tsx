import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { Platform, View } from "react-native"; // Biblioteca para gerenciar a plataforma e a view

import { DefaultTheme, Theme } from "@react-navigation/native"; // Biblioteca para gerenciar o tema da aplicacao

import { colorScheme } from "nativewind"; // Biblioteca para gerenciar o tema da aplicacao

import * as SystemUI from "expo-system-ui"; // Biblioteca para gerenciar o sistema de cores do sistema operacional

import { setStatusBarStyle } from "expo-status-bar"; // Biblioteca para gerenciar o status bar

/**
 * @description Tipo de modo de tema
 * @returns Tipo de modo de tema
 */
type ThemeMode = "light" | "dark";

/**
 * @description Interface de contexto de tema
 * @returns Interface de contexto de tema
 */
type ThemeContextValue = {
  mode: ThemeMode;
  theme: Theme;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * @description Provider de tema
 * @param children Filhos do provider
 * @returns Provider de tema
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    colorScheme.set("dark");
    return "dark";
  });

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      colorScheme.set(next);
      return next;
    });
  }, []);

  const theme = useMemo<Theme>(() => {
    const background = mode === "dark" ? "#000000" : "#FAFAFA";
    const text = mode === "dark" ? "#FFFFFF" : "#000000";

    return {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background,
        card: background,
        border: background,
        text,
      },
    };
  }, [mode]);

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    SystemUI.setBackgroundColorAsync(theme.colors.background);
    setStatusBarStyle(mode === "dark" ? "light" : "dark");
  }, [mode, theme.colors.background]);

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleMode }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

/**
 * @description Hook para usar o contexto de tema
 * @returns Hook para usar o contexto de tema
 */
export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return context;
};
