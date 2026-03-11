import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { useThemeColors } from "@/src/context/ThemeContext";
import { InputDefault, ButtonDefault } from "@/src/components/form";
import { useForgotPassword } from "@/src/hooks/auth/useForgotPassword";

const ForgotPassword = () => {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const { t } = useTranslation();

	const { control, rules, handleForgotPassword, handleSubmit } = useForgotPassword();

	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: insets.bottom + 20}}
			keyboardShouldPersistTaps="handled"
		>

			<View className="gap-4 flex-1">
				<Text className="text-base" style={{ color: colors.text }}>{
					t("FORGOTPASSWORD.DESCRIPTION")}
				</Text>
				<InputDefault
					name="email"
					control={control}
					label={t("FORGOTPASSWORD.EMAILLABEL")}
					placeholder={t("FORGOTPASSWORD.EMAILPLACEHOLDER")}
					rules={rules.email}
					autoFocus
				/>
			</View>
			<View className="flex-1 justify-end pt-4">
				<ButtonDefault
					title={t("FORGOTPASSWORD.SUBMIT")}
					onPress={handleSubmit(handleForgotPassword)}
					disabled={false}
					loading={false}
				/>
			</View>

		</KeyboardAwareScrollView>
	)
}

export default ForgotPassword;
