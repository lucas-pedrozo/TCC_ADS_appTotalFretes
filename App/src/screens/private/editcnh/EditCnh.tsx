import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { InputGroup, InputDefault, ButtonDefault } from "@/src/components/form";
import { useEditCnh } from "@/src/hooks/editCnh/useEditCnh";

const EditCnh = () => {

	const insets = useSafeAreaInsets();
	const { t } = useTranslation();
	const { control, rules, handleEditCnh, handleSubmit } = useEditCnh();

	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: insets.bottom + 20 }}
			keyboardShouldPersistTaps="handled"
		>

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
				<View className="flex-1 justify-end pt-4">
					<ButtonDefault
						title={t("SIGNUP.BASIC.NEXT")}
						onPress={handleSubmit(handleEditCnh)}
					/>
				</View>
			</View>
		</KeyboardAwareScrollView>
	)
}

export default EditCnh;