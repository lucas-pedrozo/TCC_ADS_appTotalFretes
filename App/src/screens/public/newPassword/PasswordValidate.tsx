import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { OtpInput } from "@/src/components/otpInput/OtpInput";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";
import { useHookPasswordValidate } from "@/src/hooks/forgotPassword/hookPasswordValidate";

const PasswordValidate = () => {
	const insets = useSafeAreaInsets();
	const { t } = useTranslation();

	const { control, handleSubmit, rules, handleValidateCode, email } = useHookPasswordValidate();

	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{
				flexGrow: 1,
				paddingHorizontal: 20,
				paddingBottom: insets.bottom + 20,
			}}
			keyboardShouldPersistTaps="handled"
		>
			<Text className="text-lightText dark:text-darkText text-base">
				{t("forgotPassword.description")} Informe o código para: {email || "—"}
			</Text>

			<View className="flex-1 pt-8">
				<Text className="text-lightText dark:text-darkText text-3xl font-semibold text-center pb-5">
					Código de Redefinição
				</Text>

				<OtpInput
					control={control}
					name="code"
					length={6}
					rules={rules.code}
				/>
			</View>

			<View className="flex-1 justify-end pt-4">
				<ButtonDefault
					title={t("forgotPassword.submit")}
					onPress={handleSubmit(handleValidateCode)}
				/>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default PasswordValidate;