import { View } from "react-native";

import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { InputDefault, InputCpf, InputPhone, InputDate } from "@/src/components/fom/inputs/InputDefault";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHookDataBasic } from "@/src/hooks/singUp/hookDataBasic";
import { InputGroup } from "@/src/components/fom/inputs/InputGroup";
import { StepIndicator } from "@/src/components/header/StepIndicator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SingUp = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<NavigationProp>();
  const { control, rules, handleNext } = useHookDataBasic({
    onNext: () => navigation.navigate("SingUpCNH"),
  });

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}
      keyboardShouldPersistTaps="handled"
    >

      <StepIndicator
        totalSteps={3}
        currentStep={1}
      />

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
          placeholder={t("signUp.basic.emailPlaceholder")}
          label={t("signUp.basic.emailLabel")}
          rules={rules.email}
        />

        <InputCpf
          name="cpf"
          control={control}
          maxLength={14}
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
            onPress={handleNext}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default SingUp;