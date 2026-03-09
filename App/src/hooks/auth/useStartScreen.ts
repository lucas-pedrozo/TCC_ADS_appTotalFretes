import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAuth } from "@/src/context/AuthContext";
import { getStoredAuthToken, getStoredAuthTokenSilent } from "@/src/services/http";
import { RootStackParamList } from "@/src/routes/Routes";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useStartScreen() {
	const navigation = useNavigation<NavigationProp>();
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
			const token = await getStoredAuthToken();
			if (token) {
				await login(token);
				setTimeout(() => {
					navigation.reset({ index: 0, routes: [{ name: "Home" as never }] });
				}, 150);
				return;
			}
		}
		navigation.navigate("Login", { startMode: "saved", focusPassword: true });
	}, [navigation, login, biometricsEnabled]);

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
