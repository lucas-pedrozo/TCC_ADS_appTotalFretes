import { View } from "react-native";

import { InputDefault, InputCpf } from "@/src/components/fom/inputs/InputDefault";
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
          name="nome"
          control={control}
          label="Nome Completo"
          placeholder="Nome Completo"
          rules={rules.nome}
        />

        <InputDefault
          name="email"
          control={control}
          placeholder="Email"
          label="Email"
          rules={rules.email}
        />

        <InputCpf
          name="cpf"
          control={control}
          placeholder="CPF"
          label="CPF"
          rules={rules.cpf}
        />

        <InputDefault
          name="numeroTelefone"
          control={control}
          placeholder="Número de Telefone"
          maxLength={11}
          label="Número de Telefone"
          rules={rules.numeroTelefone}
        />

        <InputGroup
          name="sexo"
          control={control}
          label="Sexo"
          rules={rules.sexo}
          options={[
            { label: "Masculino", value: "masculino" },
            { label: "Feminino", value: "feminino" },
            { label: "Não Informar", value: "outro" },
          ]}
        />

        <InputGroup
          name="deficiencia"
          control={control}
          label="Possui deficiencia?"
          rules={rules.deficiencia}
          options={[
            { label: "Sim", value: "sim" },
            { label: "Nao", value: "nao" },
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