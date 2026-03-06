import { View } from "react-native";

import { useSignUpCnh } from "@/src/hooks/singUp/useSignUpCnh";
import { StepIndicator } from "@/src/components/header/StepIndicator";
import { InputDefault, ButtonDefault, InputGroup } from "@/src/components/form";

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
	const { control, rules, handleNext } = useSignUpCnh({
		onNext: () => navigation.navigate("SingUpPassword"),
	});

	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, }}
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
					placeholder={t("SIGNUP.CNH.CNHPLACEHOLDER")}
					label={t("SIGNUP.CNH.CNHLABEL")}
					maxLength={11}
					rules={rules.cnhNumber}
				/>

				<InputDefault
					name="issuingAgencyCnh"
					control={control}
					placeholder={t("SIGNUP.CNH.ISSUINGAGENCYPLACEHOLDER")}
					label={t("SIGNUP.CNH.ISSUINGAGENCYLABEL")}
					maxLength={2}
					rules={rules.issuingAgencyCnh}
				/>

				<InputGroup
					name="cnhType_id"
					control={control}
					label={t("SIGNUP.CNH.CATEGORYLABEL")}
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
					label={t("SIGNUP.CNH.USEGLASSESLABEL")}
					rules={rules.useGlasses}
					options={[
						{ label: t("SIGNUP.CNH.YES"), value: "true" },
						{ label: t("SIGNUP.CNH.NO"), value: "false" },
					]}
				/>

				<View className="flex-1 justify-end py-4">
					<ButtonDefault
						title={t("SIGNUP.CNH.NEXT")}
						onPress={handleNext}
					/>
				</View>
			</View>
		</KeyboardAwareScrollView>
	)
}

export default SingUpCNH;