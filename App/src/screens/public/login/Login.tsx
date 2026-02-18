import useHookLogin from "@/src/hooks/login/hookLogin";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { InputDefault, InputCpf } from "@/src/components/fom/inputs/InputDefault";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";

/**
 * @description Componente de login
 * @returns Componente de login
 */
const Login = () => {
  const { control, rules, handleSubmit, handleLogin } = useHookLogin();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: insets.top }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-4 flex-1">
        <InputDefault
          name="email"
          label="Email"
          placeholder="Digite seu email"
          type="default"
          control={control}
          rules={rules.email}
        />

        <InputDefault
          name="password"
          label="Senha"
          placeholder="Digite sua senha"
          type="default"
          secureTextEntry
          control={control}
          rules={rules.password}
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