import useHookLogin from "@/src/hooks/hookLogin";
import { Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InputCpfCnpj } from "@/src/components/fom/inputs/inputCpfCnpj";
import { InputDefault } from "@/src/components/fom/inputs/InputDefault";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";

function Login() {
  const { control, rules, handleSubmit, handleLogin } = useHookLogin();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: insets.top }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-4 flex-1">
        <InputCpfCnpj
          name="cpf"
          label="CPF"
          placeholder="Digite seu CPF"
          control={control}
          rules={rules.cpf}
        />

        <InputDefault
          name="senha"
          label="Senha"
          placeholder="Digite sua senha"
          type="default"
          secureTextEntry
          control={control}
          rules={rules.senha}
        />

        <Pressable onPress={() => {}} className="self-start">
          <Text className="text-lightText dark:text-darkText font-medium underline text-base pl-2.5 pt-2.5">
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