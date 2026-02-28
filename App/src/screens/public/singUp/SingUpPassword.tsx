import { View } from "react-native";

import { InputDefault } from "@/src/components/fom/inputs/InputDefault";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";

import { useHookPassword } from "@/src/hooks/singUp/hookPassword";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { StepIndicator } from "../../../components/header/StepIndicator";
import { useTranslation } from "react-i18next";

/**
 * @description Componente de cadastro de senha
 * @returns Componente de cadastro de senha
 */
const SingUpPassword = () => {
	const { t } = useTranslation();
	const { control, rules, handleFinish } = useHookPassword();

	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, }}
			keyboardShouldPersistTaps="handled"
		>

			<StepIndicator
				totalSteps={3}
				currentStep={3}
			/>

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
						onPress={handleFinish}
						disabled={false}
						loading={false}
					/>
				</View>
			</View>
		</KeyboardAwareScrollView>
	)
}

export default SingUpPassword;