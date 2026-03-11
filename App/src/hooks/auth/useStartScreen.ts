import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAuth } from "@/src/context/AuthContext";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import http, { getStoredAuthToken, getStoredAuthTokenSilent, clearAuthToken } from "@/src/services/http";
import { RootStackParamList } from "@/src/routes/Routes";
import i18n from "@/src/i18n";

const validateAuthToken = async (token: string): Promise<boolean> => {
	try {
		const response = await http.post<{ valid: boolean }>("/auth/validate", { token });
		return response.data.valid;
	} catch {
		return false;
	}
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useStartScreen() {
	const navigation = useNavigation<NavigationProp>();
	const { notify, hideAlert } = useAlertDefault();
	const { isAuthReady, lastUsedAccount, removeSavedAccount, login, biometricsEnabled } = useAuth();
	const [hasStoredToken, setHasStoredToken] = useState<boolean | null>(null);

	useEffect(() => {
		if (!biometricsEnabled) {
			setHasStoredToken(null);
			return;
		}
		getStoredAuthTokenSilent().then((token) => setHasStoredToken(!!token));
	}, [biometricsEnabled]);

	const goLogin = useCallback(
		() => navigation.navigate("Login", { startMode: "full" }),
		[navigation]
	);

	const goSavedAccount = useCallback(async () => {
		if (biometricsEnabled) {
			const hasToken = await getStoredAuthTokenSilent();
			if (!hasToken) {
				navigation.navigate("Login", { startMode: "saved", focusPassword: true });
				return;
			}
			const token = await getStoredAuthToken({ useBiometrics: biometricsEnabled });
			if (token) {
				notify({ status: "loading", message: i18n.t("NOTIFICATIONS.LOGINLOADING") });
				const isValid = await validateAuthToken(token);
				if (!isValid) {
					hideAlert();
					await clearAuthToken();
					notify({ status: "error", message: i18n.t("NOTIFICATIONS.TOKENINVALID") });
					setHasStoredToken(false);
					return;
				}
				await login(token);
				hideAlert();
				navigation.reset({ index: 0, routes: [{ name: "Home" as never }] });
				return;
			}
		}
		navigation.navigate("Login", { startMode: "saved", focusPassword: true });
	}, [navigation, login, biometricsEnabled, notify, hideAlert]);

	const goToLoginWithPassword = useCallback(() => {
		navigation.navigate("Login", { startMode: "saved", focusPassword: true });
	}, [navigation]);

	const goSwitchAccount = useCallback(
		() => navigation.navigate("Login", { startMode: "full" }),
		[navigation]
	);

	const goSingUp = useCallback(
		() => navigation.navigate("SingUp"),
		[navigation]
	);

	const handleRemoveSavedAccount = useCallback(() => {
		if (lastUsedAccount) removeSavedAccount(lastUsedAccount.email);
	}, [lastUsedAccount, removeSavedAccount]);

	const showBiometricOnCard = biometricsEnabled && hasStoredToken === true;

	return {
		isAuthReady,
		lastUsedAccount,
		biometricsEnabled,
		showBiometricOnCard,
		goLogin,
		goSavedAccount,
		goToLoginWithPassword,
		goSwitchAccount,
		goSingUp,
		handleRemoveSavedAccount,
	};
}
