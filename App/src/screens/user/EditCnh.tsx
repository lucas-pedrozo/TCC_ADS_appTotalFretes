import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";

import { InputGroup, InputDefault, ButtonDefault, InputSelect } from "@/src/components/form";
import { BRAZIL_STATE_OPTIONS } from "@/src/constants/brazilianStates";
import { DetailRow } from "@/src/components/info/DetailRow";
import { useEditCnh } from "@/src/hooks/user/useEditCnh";
import { useThemeColors } from "@/src/context/ThemeContext";

const CNH_TYPE_LETTERS: Record<number, string> = { 1: "A", 2: "B", 3: "C", 4: "D", 5: "E" };

const CNH_HEADER_GREEN = "#006b3f";
const CNH_HEADER_YELLOW = "#fcd116";

const EditCnh = () => {
	const insets = useSafeAreaInsets();
	const { t } = useTranslation();
	const colors = useThemeColors();
	const { control, rules, handleEditCnh, handleSubmit, editCnhData, userName, userImageUrl } = useEditCnh();

	const categoryLabel = editCnhData?.cnhType_id != null ? CNH_TYPE_LETTERS[editCnhData.cnhType_id] ?? String(editCnhData.cnhType_id) : "—";
	const useGlassesLabel = editCnhData?.useGlasses != null
		? (editCnhData.useGlasses ? t("SIGNUP.CNH.YES") : t("SIGNUP.CNH.NO"))
		: "—";

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

				<InputSelect
					name="issuingAgencyCnh"
					control={control}
					placeholder={t("SIGNUP.CNH.ISSUINGAGENCYPLACEHOLDER")}
					label={t("SIGNUP.CNH.ISSUINGAGENCYLABEL")}
					rules={rules.issuingAgencyCnh}
					options={BRAZIL_STATE_OPTIONS}
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
						title={t("SIGNUP.BASIC.SAVE")}
						onPress={handleSubmit(handleEditCnh)}
					/>
				</View>
			</View>
		</KeyboardAwareScrollView>
	)
}

export default EditCnh;
