import { View } from "react-native";

import useHookLogin from "@/src/hooks/hookLogin";

import { InputDefault } from "@/src/components/fom/inputs/InputDefault";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";

function SingUp() {
  const { control, handleSubmit, handleLogin } = useHookLogin();

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, }}
      keyboardShouldPersistTaps="handled"
    >

      <View className="flex-row gap-2.5 items-center justify-center py-8">
        <View className="w-14 h-2.5 rounded-lg bg-green-500" />
        <View className="w-14 h-2.5 rounded-lg bg-gray-500" />
        <View className="w-14 h-2.5 rounded-lg bg-gray-500" />
        <View className="w-14 h-2.5 rounded-lg bg-gray-500" />
      </View>

      <View className="gap-4 flex-1">
        <InputDefault
          name="nome"
          label="Nome Completo"
          placeholder="Nome completo"
          type="default"
          secureTextEntry
          control={control}
          rules={{ required: "Nome é obrigatório" }}
        />
        <InputDefault
          name="email"
          label="Email"
          placeholder="exemplo@exemplo.com"
          type="default"
          secureTextEntry
          control={control}
          rules={{ required: "Email é obrigatório" }}
        />
        <InputDefault
          name="dataNascimento"
          label="Data de Nascimento"
          placeholder="00/00/0000"
          type="default"
          secureTextEntry
          control={control}
          rules={{ required: "Data de nascimento é obrigatória" }}
        />
        <InputDefault
          name="numeroTelefone"
          label="Número de Telefone"
          placeholder="(XX) XXXXX-XXXX"
          type="default"
          secureTextEntry
          control={control}
          rules={{ required: "Número de telefone é obrigatório" }}
        />

        <View className="flex-1 justify-end py-4">
          <ButtonDefault
            title="Proximo"
            onPress={handleSubmit(handleLogin)}
            disabled={false}
            loading={false}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default SingUp;