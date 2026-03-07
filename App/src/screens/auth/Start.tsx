import { useCallback } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useThemeMode } from "@/src/context/ThemeContext";
import { ButtonDefault } from "@/src/components/form";
import { useAuth } from "@/src/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { useIconColor } from "@/src/context/ThemeContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function Start() {
	const iconColor = useIconColor();
	const navigation = useNavigation<NavigationProp>();
	const { t } = useTranslation();
	const { lastUsedAccount, removeSavedAccount } = useAuth();
	const { mode } = useThemeMode();
	const isDark = mode === "dark";
	const linkColor = isDark ? "#94a3b8" : "#475569";

	const goLogin = useCallback(
		() => navigation.navigate("Login", { startMode: "full" }),
		[navigation]
	);
	const goSavedAccount = useCallback(
		() => navigation.navigate("Login", { startMode: "saved", focusPassword: true }),
		[navigation]
	);
	const goSwitchAccount = useCallback(
		() => navigation.navigate("Login", { startMode: "full" }),
		[navigation]
	);
	const goSingUp = useCallback(() => navigation.navigate("SingUp"), [navigation]);
	const handleRemoveSavedAccount = useCallback(() => {
		if (lastUsedAccount) removeSavedAccount(lastUsedAccount.email);
	}, [lastUsedAccount, removeSavedAccount]);

	return (
		<SafeAreaView className="flex-1 justify-between px-6 pt-20 pb-8 bg-lightBg dark:bg-darkBg">
			<View className="flex-1 justify-center pt-8">
				<Text
					className="text-4xl font-bold text-center text-lightText dark:text-darkText">
					{t("COMMON.APPNAME")}
				</Text>

				{lastUsedAccount ? (
					<>
						<Pressable
							onPress={goSavedAccount}
							className="mt-10 rounded-2xl px-4 py-4 bg-lightBgNonary dark:bg-darkBgNonary border border-lightBgTertiary dark:border-darkBgTertiary flex-row items-center gap-4"
						>
							<View className="w-12 h-12 rounded-full bg-lightBgTertiary/30 dark:bg-darkBgTertiary/30 items-center justify-center">
								<Feather name="user" size={24} color={iconColor} />
							</View>
							<View className="flex-1 min-w-0">
								<Text className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
									{t("LOGIN.SAVEDACCOUNT")}
								</Text>
								<Text
									className="text-lg font-semibold text-lightText dark:text-darkText mt-1"
									numberOfLines={1}
								>
									{lastUsedAccount.displayLabel}
								</Text>
								<Text className="text-xs text-slate-500 dark:text-slate-300 mt-1">
									{t("LOGIN.PASSWORDLABEL")}
								</Text>
							</View>
						</Pressable>

						<View className="mt-4 flex-row justify-between items-center gap-x-6 gap-y-2 px-2.5 flex-wrap">
							<Pressable onPress={goSwitchAccount} className="flex-row items-center gap-2">
								<Feather name="repeat" size={18} color={iconColor} />
								<Text className="text-base font-medium text-lightText dark:text-darkText">
									{t("LOGIN.SWITCHACCOUNT")}
								</Text>
							</Pressable>
							<Pressable onPress={handleRemoveSavedAccount} className="flex-row items-center gap-2">
								<Feather name="trash-2" size={18} color={iconColor} />
								<Text className="text-base font-medium text-lightText dark:text-darkText">
									Excluir conta
								</Text>
							</Pressable>
						</View>
					</>
				) : null}
			</View>

			<View className="w-full gap-3 pb-8">
				{!lastUsedAccount ? (
					<>
						<ButtonDefault title={t("START.SIGNIN")} onPress={goLogin} />
					</>
				) : null}
				{!lastUsedAccount ? (
					<TouchableOpacity onPress={goSingUp} className="py-3 w-full rounded-lg items-center justify-center border-2 border-lightBgTertiary dark:border-darkBgTertiary">
						<Text className="text-lightText dark:text-darkText font-semibold text-base">
							{t("START.SIGNUP")}
						</Text>
					</TouchableOpacity>
				) : null}
			</View>
		</SafeAreaView>
	);
}

export default Start;
