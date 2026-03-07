import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { InputDefault, ButtonDefault } from "@/src/components/form";
import { useNewPassword } from "@/src/hooks/auth/useNewPassword";

const RenewPassword = () => {
	const { t } = useTranslation();
	const { control, rules, handleSubmit, handleResetPassword } = useNewPassword();

	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: 20}}
			keyboardShouldPersistTaps="handled"
		>
			<View className="gap-4 flex-1">
                
				<InputDefault
					name="oldPassword"
					control={control}
					placeholder={t("SIGNUP.PASSWORD.OLDPPASSWORDPLACEHOLDER")}
					label={t("SIGNUP.PASSWORD.OLDPWPASSWORDLABEL")}
					secureTextEntry
					rules={rules.password}
				/>
				<InputDefault
					name="password"
					control={control}
					placeholder={t("SIGNUP.PASSWORD.PASSWORDPLACEHOLDER")}
					label={t("SIGNUP.PASSWORD.PASSWORDLABEL")}
					secureTextEntry
					rules={rules.password}
				/>

				<InputDefault
					name="confirmPassword"
					control={control}
					placeholder={t("SIGNUP.PASSWORD.CONFIRMPASSWORDPLACEHOLDER")}
					label={t("SIGNUP.PASSWORD.CONFIRMPASSWORDLABEL")}
					secureTextEntry
					rules={rules.confirmPassword}
				/>

				<View className="flex-1 justify-end py-4">
					<ButtonDefault
						title={t("SIGNUP.PASSWORD.FINISH")}
						onPress={handleSubmit(handleResetPassword)}
						disabled={false}
						loading={false}
					/>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default RenewPassword;
