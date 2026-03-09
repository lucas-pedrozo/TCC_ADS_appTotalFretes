import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";

import i18n from "@/src/i18n";
import { AppLanguage } from "@/src/i18n/resources";

const STORAGE_KEY = "app_language";

type LanguageContextValue = {
	language: AppLanguage;
	changeLanguage: (nextLanguage: AppLanguage) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
	const [language, setLanguage] = useState<AppLanguage>((i18n.language?.split("-")[0] as AppLanguage) || "pt");

	const changeLanguage = useCallback(async (nextLanguage: AppLanguage) => {
		await i18n.changeLanguage(nextLanguage);
		setLanguage(nextLanguage);
		await SecureStore.setItemAsync(STORAGE_KEY, nextLanguage);
	}, []);

	useEffect(() => {
		const loadLanguage = async () => {
			const storedLanguage = await SecureStore.getItemAsync(STORAGE_KEY);

			if (storedLanguage === "pt" || storedLanguage === "en") {
				await i18n.changeLanguage(storedLanguage);
				setLanguage(storedLanguage);
			}
		};

		loadLanguage();
	}, []);

	const value = useMemo(
		() => ({
			language,
			changeLanguage,
		}),
		[changeLanguage, language],
	);

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);

	if (!context) {
		throw new Error("useLanguage must be used within LanguageProvider");
	}

	return context;
};