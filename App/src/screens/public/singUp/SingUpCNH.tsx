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
import { useTranslation } from "react-i18next";


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * @description Componente de cadastro de CNH
 * @returns Componente de cadastro de CNH
 */
const SingUpCNH = () => {
  const { t } = useTranslation();

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
					placeholder={t("signUp.cnh.cnhPlaceholder")}
					label={t("signUp.cnh.cnhLabel")}
					maxLength={11}
					rules={rules.cnhNumber}
				/>

				<InputDefault
					name="issuingAgencyCnh"
					control={control}
					placeholder={t("signUp.cnh.issuingAgencyPlaceholder")}
					label={t("signUp.cnh.issuingAgencyLabel")}
					maxLength={2}
					rules={rules.issuingAgencyCnh}
				/>

				<InputGroup
					name="cnhType_id"
					control={control}
					label={t("signUp.cnh.categoryLabel")}
					rules={rules.cnhType_id}
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
					label={t("signUp.cnh.useGlassesLabel")}
					rules={rules.useGlasses}
					options={[
						{ label: t("signUp.cnh.yes"), value: "true" },
						{ label: t("signUp.cnh.no"), value: "false" },
					]}
				/>

				<View className="flex-1 justify-end py-4">
					<ButtonDefault
						title={t("signUp.cnh.next")}
						onPress={handleNext}
					/>
				</View>
			</View>
		</KeyboardAwareScrollView>
	)
}

export default SingUpCNH;