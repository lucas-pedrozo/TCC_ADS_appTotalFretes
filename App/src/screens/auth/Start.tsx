import { useCallback } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ButtonDefault } from "@/src/components/form";
import { useAuth } from "@/src/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { useIconColor } from "@/src/context/ThemeContext";
import { useThemeColors } from "@/src/context/ThemeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function Start() {
	const { t } = useTranslation();
	const colors = useThemeColors();
	const iconColor = useIconColor();
	const navigation = useNavigation<NavigationProp>();
	const { lastUsedAccount, removeSavedAccount } = useAuth();

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

	const goSingUp = useCallback(
		() => navigation.navigate("SingUp"),
		[navigation]
	);

	const handleRemoveSavedAccount = useCallback(() => {
		if (lastUsedAccount) removeSavedAccount(lastUsedAccount.email);
	}, [lastUsedAccount, removeSavedAccount]);

	return (
		<SafeAreaView className="flex-1 justify-between px-6 pt-20 pb-8" style={{ backgroundColor: colors.bg }}>
			<View className="flex-1 justify-center pt-8">

				<Text className="text-4xl font-bold text-center" style={{ color: colors.text }}>
					{t("COMMON.APPNAME")}
				</Text>

				{lastUsedAccount ? (
					<>
						<Pressable onPress={goSavedAccount}
							className="mt-10 rounded-2xl px-4 py-4 flex-row items-center gap-4"
							style={{ backgroundColor: colors.bgNonary, borderColor: colors.bgTertiary, borderWidth: 1 }}
						>
							<View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: colors.bgNonary }}>
								<Feather name="user" size={24} color={iconColor} />
							</View>
							<View className="flex-1 min-w-0">
								<Text className="text-xs" style={{ color: colors.textSecondary }}>
									{t("LOGIN.SAVEDACCOUNT")}
								</Text>
								<Text className="text-lg font-semibold mt-1" style={{ color: colors.text }} numberOfLines={1}>
									{lastUsedAccount.displayLabel}
								</Text>
								<Text className="text-xs mt-1" style={{ color: colors.textSecondary }}>
									{t("LOGIN.PASSWORDLABEL")}
								</Text>
							</View>
						</Pressable>

						<View className="mt-4 flex-row justify-between items-center gap-x-6 gap-y-2 px-2.5 flex-wrap">
							<Pressable onPress={goSwitchAccount} className="flex-row items-center gap-2">
								<Feather name="repeat" size={18} color={iconColor} />
								<Text className="text-base font-medium" style={{ color: colors.text }}>
									{t("LOGIN.SWITCHACCOUNT")}
								</Text>
							</Pressable>
							<Pressable onPress={handleRemoveSavedAccount} className="flex-row items-center gap-2">
								<Feather name="trash-2" size={18} color={iconColor} />
								<Text className="text-base font-medium" style={{ color: colors.text }}>
									Excluir conta
								</Text>
							</Pressable>
						</View>
					</>
				) : null}
			</View>

			{!lastUsedAccount ? (
				<View className="w-full gap-3 pb-8">
					<ButtonDefault title={t("START.SIGNIN")} onPress={goLogin} />
					<ButtonDefault title={t("START.SIGNUP")} onPress={goSingUp} />
				</View>
			) : null}
		</SafeAreaView>
	);
}

export default Start;
