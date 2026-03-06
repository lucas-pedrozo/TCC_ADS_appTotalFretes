import { useTranslation } from "react-i18next";
import { useThemeMode } from "@/src/context/ThemeContext";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { Ionicons } from "@expo/vector-icons";
import { InputGroup } from "@/src/components/fom/inputs/InputGroup";
import { useHookEditPerfil } from "@/src/hooks/editPerfil/hookEditPerfil";
import { useHookImagePicker } from "@/src/hooks/editPerfil/imagePicker";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";
import { InputCpf, InputDate, InputDefault, InputPhone } from "@/src/components/fom/inputs/InputDefault";

const EditPerfil = () => {
	const { t } = useTranslation();
	const { mode } = useThemeMode();
	const insets = useSafeAreaInsets();
	const { control, handleSubmit, handleEditPerfil, rules } = useHookEditPerfil();
	const { imageUri, handlePickFromGallery, handleTakePhoto } = useHookImagePicker();

	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: insets.bottom + 20 }}
			keyboardShouldPersistTaps="handled"
		>
			<View className="flex-1 items-center gap-5 mb-8">
				{
					imageUri ? (
						<Image
							source={{ uri: imageUri }}
							style={{ width: 80, height: 80, borderRadius: 50 }}
						/>
					) : (
						<TouchableOpacity onPress={handleTakePhoto} className="w-24 h-24 bg-lightBgSecondary dark:bg-darkBgSecondary rounded-full items-center justify-center">
							<Ionicons name="camera" size={24} color={mode === "dark" ? "white" : "black"} />
						</TouchableOpacity>
					)
				}
				<View className="flex-row gap-3">
					<TesteButton title="Tirar" onPress={handleTakePhoto} />
					<TesteButton title="Buscar" onPress={handlePickFromGallery} />
				</View>
			</View>

			<View className="gap-4 flex-1">
				<InputDefault
					name="name"
					control={control}
					label={t("SIGNUP.BASIC.FULLNAMELABEL")}
					maxLength={100}

					placeholder={t("SIGNUP.BASIC.FULLNAMEPLACEHOLDER")}
					rules={rules.name}
				/>

				<InputDefault
					name="email"
					control={control}
					desabled={true}
					placeholder={t("SIGNUP.BASIC.EMAILPLACEHOLDER")}
					label={t("SIGNUP.BASIC.EMAILLABEL")}
					rules={rules.email}
				/>

				<InputCpf
					name="cpf"
					control={control}
					maxLength={14}
					desabled={true}
					placeholder={t("SIGNUP.BASIC.CPFPLACEHOLDER")}
					label={t("SIGNUP.BASIC.CPFLABEL")}
					rules={rules.cpf}
				/>

				<InputPhone
					name="phoneNumber"
					control={control}
					placeholder={t("SIGNUP.BASIC.PHONEPLACEHOLDER")}
					maxLength={15}
					label={t("SIGNUP.BASIC.PHONELABEL")}
					rules={rules.phoneNumber}
				/>

				<InputDate
					name="birthDate"
					control={control}
					placeholder={t("SIGNUP.BASIC.BIRTHDATEPLACEHOLDER")}
					label={t("SIGNUP.BASIC.BIRTHDATELABEL")}
					maxLength={10}
					rules={rules.birthDate}
				/>

				<InputGroup
					name="sex"
					control={control}
					label={t("SIGNUP.BASIC.GENDERLABEL")}
					rules={rules.sex}
					options={[
						{ label: t("SIGNUP.BASIC.GENDERMALE"), value: "M" },
						{ label: t("SIGNUP.BASIC.GENDERFEMALE"), value: "F" },
						{ label: t("SIGNUP.BASIC.GENDERNOTINFORM"), value: "N" },
					]}
				/>

				<InputGroup
					name="isDeficient"
					control={control}
					label={t("SIGNUP.BASIC.DISABILITYLABEL")}
					rules={rules.isDeficient}
					options={[
						{ label: t("SIGNUP.BASIC.YES"), value: "true" },
						{ label: t("SIGNUP.BASIC.NO"), value: "false" },
					]}
				/>

				<View className="flex-1 justify-end pt-4">
					<ButtonDefault
						title={t("SIGNUP.BASIC.NEXT")}
						onPress={handleSubmit(handleEditPerfil)}
					/>
				</View>
			</View>
		</KeyboardAwareScrollView>
	)
}

export default EditPerfil;

const TesteButton = ({ title, onPress }: { title: string, onPress: () => void }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			className="w-24 bg-lightBgNonary dark:bg-darkBgNonary p-2 rounded-xl border border-lightBgTertiary dark:border-darkBgTertiary">
			<Text className="text-lightText dark:text-darkText text-center text-sm">{title}</Text>
		</TouchableOpacity>
	)
}