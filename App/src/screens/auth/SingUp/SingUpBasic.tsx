import { View } from "react-native";

import {
  ButtonDefault,
  InputDefault,
  InputCpf,
  InputPhone,
  InputDate,
  InputGroup,
} from "@/src/components/form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSignUpDataBasic } from "@/src/hooks/auth/useSignUpDataBasic";
import { StepIndicator } from "@/src/components/header/StepIndicator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SingUp = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<NavigationProp>();
  const { control, rules, handleNext } = useSignUpDataBasic({
    onNext: () => navigation.navigate("SingUpCNH"),
  });

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: insets.bottom + 20 }}
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
          label={t("SIGNUP.BASIC.FULLNAMELABEL")}
          maxLength={100}
          placeholder={t("SIGNUP.BASIC.FULLNAMEPLACEHOLDER")}
          rules={rules.name}
        />

        <InputDefault
          name="email"
          control={control}
          placeholder={t("SIGNUP.BASIC.EMAILPLACEHOLDER")}
          label={t("SIGNUP.BASIC.EMAILLABEL")}
          rules={rules.email}
        />

        <InputCpf
          name="cpf"
          control={control}
          maxLength={14}
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
            onPress={handleNext}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default SingUp;
