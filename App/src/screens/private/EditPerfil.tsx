import { Image, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InputGroup } from "@/src/components/fom/inputs/InputGroup";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";
import { InputCpf, InputDate, InputDefault, InputPhone } from "@/src/components/fom/inputs/InputDefault";
import { useHookEditPerfil } from "@/src/hooks/editPerfil/EditPerfil";

const EditPerfil = () => {
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const { control, handleSubmit, handleEditPerfil, rules } = useHookEditPerfil();

	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: insets.bottom + 20 }}
			keyboardShouldPersistTaps="handled"
		>
			<View className="flex-1 items-center gap-5 mb-8">
				<Image source={require('../../assets/usuario.jpg')} style={{ width: 80, height: 80, borderRadius: 50 }} />
				<View className="flex-row gap-3">
					<TesteButton title="Tirar" />
					<TesteButton title="Buscar" />
				</View>
			</View>

			<View className="gap-4 flex-1">
				<InputDefault
					name="name"
					control={control}
					label={t("signUp.basic.fullNameLabel")}
					maxLength={100}

					placeholder={t("signUp.basic.fullNamePlaceholder")}
					rules={rules.name}
				/>

				<InputDefault
					name="email"
					control={control}
					desabled={true}
					placeholder={t("signUp.basic.emailPlaceholder")}
					label={t("signUp.basic.emailLabel")}
					rules={rules.email}
				/>

				<InputCpf
					name="cpf"
					control={control}
					maxLength={14}
					desabled={true}
					placeholder={t("signUp.basic.cpfPlaceholder")}
					label={t("signUp.basic.cpfLabel")}
					rules={rules.cpf}
				/>

				<InputPhone
					name="phoneNumber"
					control={control}
					placeholder={t("signUp.basic.phonePlaceholder")}
					maxLength={15}
					label={t("signUp.basic.phoneLabel")}
					rules={rules.phoneNumber}
				/>

				<InputDate
					name="birthDate"
					control={control}
					placeholder={t("signUp.basic.birthDatePlaceholder")}
					label={t("signUp.basic.birthDateLabel")}
					maxLength={10}
					rules={rules.birthDate}
				/>

				<InputGroup
					name="sex"
					control={control}
					label={t("signUp.basic.genderLabel")}
					rules={rules.sex}
					options={[
						{ label: t("signUp.basic.genderMale"), value: "M" },
						{ label: t("signUp.basic.genderFemale"), value: "F" },
						{ label: t("signUp.basic.genderNotInform"), value: "N" },
					]}
				/>

				<InputGroup
					name="isDeficient"
					control={control}
					label={t("signUp.basic.disabilityLabel")}
					rules={rules.isDeficient}
					options={[
						{ label: t("signUp.basic.yes"), value: "true" },
						{ label: t("signUp.basic.no"), value: "false" },
					]}
				/>

				<View className="flex-1 justify-end pt-4">
					<ButtonDefault
						title={t("signUp.basic.next")}
						onPress={handleSubmit(handleEditPerfil)}
					/>
				</View>
			</View>
		</KeyboardAwareScrollView>
	)
}

export default EditPerfil;

const TesteButton = ({ title }: { title: string }) => {
	return (
		<TouchableOpacity
			onPress={() => console.log(title)}
			className="w-24 bg-lightBgNonary dark:bg-darkBgNonary p-2 rounded-xl border border-lightBgTertiary dark:border-darkBgTertiary">
			<Text className="text-lightText dark:text-darkText text-center text-sm">{title}</Text>
		</TouchableOpacity>
	)
}