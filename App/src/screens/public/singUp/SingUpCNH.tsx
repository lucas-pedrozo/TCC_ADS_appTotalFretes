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
					name="cnhNumber"
					control={control}
					placeholder="00000000000"
					label="CNH"
					maxLength={12}
					rules={rules.cnhNumber}
				/>

				<InputDefault
					name="issuingAgencyCnh"
					control={control}
					placeholder="Órgão Emissor"
					label="Órgão Emissor"
					maxLength={2}
					rules={rules.issuingAgencyCnh}
				/>

				<InputGroup
					name="typeCnh"
					control={control}
					label="Categoria da CNH"
					rules={rules.typeCnh}
					options={[
						{ label: "A", value: "1" },
						{ label: "B", value: "2" },
						{ label: "C", value: "3" },
						{ label: "D", value: "4" },
						{ label: "E", value: "5" },
					]}
				/>

				<InputGroup
					name="useGlasses"
					control={control}
					label="Usa oculos?"
					rules={rules.useGlasses}
					options={[
						{ label: "Sim", value: "true" },
						{ label: "Nao", value: "false" },
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