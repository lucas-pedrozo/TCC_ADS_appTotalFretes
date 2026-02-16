import { View } from "react-native";

import { InputDefault, InputCpf, InputPhone, InputDate } from "@/src/components/fom/inputs/InputDefault";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";

import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { useHookDataBasic } from "@/src/hooks/singUp/hookDataBasic";
import { InputGroup } from "@/src/components/fom/inputs/InputGroup";
import { StepIndicator } from "@/src/components/header/StepIndicator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * @description Componente de cadastro basico
 * @returns Componente de cadastro basico
 */
const SingUp = () => {

  const navigation = useNavigation<NavigationProp>();
  const { control, rules, handleNext } = useHookDataBasic({
    onNext: () => navigation.navigate("SingUpCNH"),
  });

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, }}
      keyboardShouldPersistTaps="handled"
    >

      <StepIndicator
        totalSteps={3}
        currentStep={1}
      />

      <View className="gap-4 flex-1">
        <InputDefault
          name="fullName"
          control={control}
          label="Nome Completo"
          maxLength={100}
          placeholder="Nome Completo"
          rules={rules.fullName}
        />

        <InputDefault
          name="email"
          control={control}
          placeholder="email@exemplo.com"
          label="Email"
          rules={rules.email}
        />

        <InputCpf
          name="cpf"
          control={control}
          maxLength={14}
          placeholder="000.000.000-00"
          label="CPF"
          rules={rules.cpf}
        />

        <InputPhone
          name="phoneNumber"
          control={control}
          placeholder="00 00000-0000"
          maxLength={15}
          label="Número de Telefone"
          rules={rules.phoneNumber}
        />

        <InputDate
          name="birthDate"
          control={control}
          placeholder="dd/mm/aaaa"
          label="Data de Nascimento"
          rules={rules.birthDate}
        />

        <InputGroup
          name="gender"
          control={control}
          label="Sexo"
          rules={rules.gender}
          options={[
            { label: "Masculino", value: "masculino" },
            { label: "Feminino", value: "feminino" },
            { label: "Não Informar", value: "naoInformar" },
          ]}
        />

        <InputGroup
          name="disability"
          control={control}
          label="Possui deficiencia?"
          rules={rules.disability}
          options={[
            { label: "Sim", value: "sim" },
            { label: "Não", value: "nao" },
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
  );
}

export default SingUp;