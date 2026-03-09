import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { ButtonDefault } from "@/src/components/form";
import { ButtonNone } from "@/src/components/form/buttons/ButtonDefault";
import { CardUserLogin } from "@/src/components/auth/CardUserLogin";
import { useThemeColors } from "@/src/context/ThemeContext";
import { useStartScreen } from "@/src/hooks/auth/useStartScreen";

export default function Start() {
	const { t } = useTranslation();
	const colors = useThemeColors();
	const {
		isAuthReady,
		lastUsedAccount,
		showBiometricOnCard,
		goLogin,
		goSavedAccount,
		goSwitchAccount,
		goSingUp,
		handleRemoveSavedAccount,
	} = useStartScreen();

	const showAuthButtons = isAuthReady && !lastUsedAccount;
	const showSavedAccount = isAuthReady && !!lastUsedAccount;

	return (
		<SafeAreaView
			className="flex-1 justify-between px-6 pt-20 pb-8"
			style={{ backgroundColor: colors.bg }}
		>
			<View className="flex-1 justify-center pt-8">
				<Text
					className="text-4xl font-bold text-center"
					style={{ color: colors.text }}
				>
					{t("COMMON.APPNAME")}
				</Text>

				{showSavedAccount && lastUsedAccount ? (
					<CardUserLogin
						lastUsedAccount={lastUsedAccount}
						userImage_id={false}
						biometricsEnabled={showBiometricOnCard}
						goSavedAccount={goSavedAccount}
						goSwitchAccount={goSwitchAccount}
						handleRemoveSavedAccount={handleRemoveSavedAccount}
					/>
				) : null}
			</View>

			{showAuthButtons ? (
				<View className="w-full gap-3 pb-8">
					<ButtonDefault title={t("START.SIGNIN")} onPress={goLogin} />
					<ButtonNone title={t("START.SIGNUP")} onPress={goSingUp} />
				</View>
			) : null}
		</SafeAreaView>
	);
}