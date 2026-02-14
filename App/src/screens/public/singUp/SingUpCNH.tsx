import { View } from "react-native";

import { useHookCnh } from "@/src/hooks/singUp/hookCNH";
import { StepIndicator } from "@/src/components/header/StepIndicator";
import { InputDefault } from "@/src/components/fom/inputs/InputDefault";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";
import { InputGroup } from "@/src/components/fom/inputs/InputGroup";

import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * @description Componente de cadastro de CNH
 * @returns Componente de cadastro de CNH
 */
const SingUpCNH = () => {

	const navigation = useNavigation<NavigationProp>();
	const { control, rules, handleNext } = useHookCnh({
		onNext: () => navigation.navigate("SingUpPassword"),
	});

	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, }}
			keyboardShouldPersistTaps="handled"
		>

			<StepIndicator
				totalSteps={3}
				currentStep={2}
			/>

			<View className="gap-4 flex-1">
				<InputDefault
					name="cnh"
					control={control}
					placeholder="CNH"
					label="CNH"
					maxLength={11}
					rules={rules.cnh}
				/>

				<InputDefault
					name="orgaoEmissor"
					control={control}
					placeholder="Órgão Emissor"
					label="Órgão Emissor"
					maxLength={2}
					rules={rules.orgaoEmissor}
				/>

				<InputGroup
					name="tipoCnh"
					control={control}
					label="Categoria da CNH"
					rules={rules.tipoCnh}
					options={[
						{ label: "A", value: "A" },
						{ label: "B", value: "B" },
						{ label: "C", value: "C" },
						{ label: "D", value: "D" },
						{ label: "E", value: "E" },
					]}
				/>

				<InputGroup
					name="oculos"
					control={control}
					label="Usa oculos?"
					rules={rules.oculos}
					options={[
						{ label: "Sim", value: "sim" },
						{ label: "Nao", value: "nao" },
					]}
				/>

				<View className="flex-1 justify-end py-4">
					<ButtonDefault
						title="Proximo"
						onPress={handleNext}
					/>
				</View>
			</View>
		</KeyboardAwareScrollView>
	)
}

export default SingUpCNH;