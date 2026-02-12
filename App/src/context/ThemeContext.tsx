import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import { DefaultTheme, Theme } from "@react-navigation/native";
import { colorScheme } from "nativewind";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  theme: Theme;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

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
    return {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: mode === "dark" ? "#000000" : "#FAFAFA",
        text: mode === "dark" ? "#FFFFFF" : "#000000",
      },
    };
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return context;
};
