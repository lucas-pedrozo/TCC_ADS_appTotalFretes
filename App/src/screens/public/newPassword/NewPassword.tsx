import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { InputDefault } from "@/src/components/fom/inputs/InputDefault";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";
import { useHookNewPassword } from "@/src/hooks/forgotPassword/hookNewPassword";

const NewPassword = () => {
	const { t } = useTranslation();
	const { control, rules, handleSubmit, handleResetPassword } = useHookNewPassword();

	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12 }}
			keyboardShouldPersistTaps="handled"
		>
			<View className="gap-4 flex-1">
				<InputDefault
					name="password"
					control={control}
					placeholder={t("signUp.password.passwordPlaceholder")}
					label={t("signUp.password.passwordLabel")}
					secureTextEntry
					rules={rules.password}
				/>

				<InputDefault
					name="confirmPassword"
					control={control}
					placeholder={t("signUp.password.confirmPasswordPlaceholder")}
					label={t("signUp.password.confirmPasswordLabel")}
					secureTextEntry
					rules={rules.confirmPassword}
				/>

				<View className="flex-1 justify-end py-4">
					<ButtonDefault
						title={t("signUp.password.finish")}
						onPress={handleSubmit(handleResetPassword)}
						disabled={false}
						loading={false}
					/>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default NewPassword;
