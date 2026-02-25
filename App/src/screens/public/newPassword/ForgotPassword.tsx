import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { InputDefault } from "@/src/components/fom/inputs/InputDefault";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";
import { useHookForgotPassword } from "@/src/hooks/forgotPassword/hookForgotPassword";


const ForgotPassword = () => {
	const insets = useSafeAreaInsets();
	const { t } = useTranslation();

	const { control, rules, handleForgotPassword, handleSubmit} = useHookForgotPassword();

	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: insets.bottom + 20}}
			keyboardShouldPersistTaps="handled"
		>

			<View className="gap-4 flex-1">
				<Text className="text-lightText dark:text-darkText text-base">{
					t("forgotPassword.description")}
				</Text>
				<InputDefault
					name="email"
					control={control}
					label={t("forgotPassword.emailLabel")}
					placeholder={t("forgotPassword.emailPlaceholder")}
					rules={rules.email}
				/>
			</View>
			<View className="flex-1 justify-end pt-4">
				<ButtonDefault
					title={t("forgotPassword.submit")}
					onPress={handleSubmit(handleForgotPassword)}
					disabled={false}
					loading={false}
				/>
			</View>

		</KeyboardAwareScrollView>
	)
}

export default ForgotPassword;