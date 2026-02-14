import { View } from "react-native";

import { InputDefault } from "@/src/components/fom/inputs/InputDefault";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";

import { useHookPassword } from "@/src/hooks/singUp/hookPassword";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { StepIndicator } from "../../../components/header/StepIndicator";

/**
 * @description Componente de cadastro de senha
 * @returns Componente de cadastro de senha
 */
const SingUpPassword = () => {
	const { control, rules, handleFinish } = useHookPassword();

	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, }}
			keyboardShouldPersistTaps="handled"
		>

			<StepIndicator
				totalSteps={3}
				currentStep={3}
			/>

			<View className="gap-4 flex-1">
				<InputDefault
					name="senha"
					control={control}
					placeholder="Senha"
					label="Senha"
					secureTextEntry
					rules={rules.senha}
				/>

				<InputDefault
					name="confirmarSenha"
					control={control}
					placeholder="Confirmar Senha"
					label="Confirmar Senha"
					secureTextEntry
					rules={rules.confirmarSenha}
				/>

				<View className="flex-1 justify-end py-4">
					<ButtonDefault
						title="Finalizar"
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