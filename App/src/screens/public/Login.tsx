import useHookLogin from "@/src/hooks/hookLogin";
import { Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { InputCpfCnpj } from "@/src/components/fom/inputs/inputCpfCnpj";
import { InputDefault } from "@/src/components/fom/inputs/InputDefault";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";

function Login() {
  const { control, handleSubmit, handleLogin } = useHookLogin();

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, padding: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-4 flex-1">
        <InputCpfCnpj
          name="cpf"
          label="CPF"
          placeholder="Digite seu CPF"
          control={control}
          rules={{ required: "CPF é obrigatório" }}
        />

        <InputDefault
          name="senha"
          label="Senha"
          placeholder="Digite sua senha"
          type="default"
          secureTextEntry
          control={control}
          rules={{ required: "Senha é obrigatória" }}
        />

        <Pressable onPress={() => {}} className="self-start">
          <Text className="text-lightText dark:text-darkText font-medium underline text-base pl-2.5">
            Esqueci minha Senha
          </Text>
        </Pressable>

        <View className="flex-1 justify-end py-4">
          <ButtonDefault
            title="Login"
            onPress={handleSubmit(handleLogin)}
            disabled={false}
            loading={false}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default Login;