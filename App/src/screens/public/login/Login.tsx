import { useLogin } from "@/src/hooks/login/useLogin";

import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { InputDefault, ButtonDefault } from "@/src/components/form";

import { RootStackParamList } from "@/src/routes/Routes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

/**
 * @description Componente de login
 * @returns Componente de login
 */
const Login = () => {
  const { control, rules, handleSubmit, handleLogin } = useLogin();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const goForgotPassword = useCallback(() => navigation.navigate("ForgotPassword"), [navigation]);

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: insets.bottom + 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-4 flex-1">
        <InputDefault
          name="email"
          label={t("LOGIN.EMAILLABEL")}
          placeholder={t("LOGIN.EMAILPLACEHOLDER")}
          type="default"
          control={control}
          rules={rules.email}
        />

        <InputDefault
          name="password"
          label={t("LOGIN.PASSWORDLABEL")}
          placeholder={t("LOGIN.PASSWORDPLACEHOLDER")}
          type="default"
          secureTextEntry
          control={control}
          rules={rules.password}
        />

        <Pressable onPress={goForgotPassword} className="self-start">
          <Text className="text-lightText dark:text-darkText font-medium underline text-base pl-2.5 pt-2.5">
            {t("LOGIN.FORGOTPASSWORD")}
          </Text>
        </Pressable>

        <View className="flex-1 justify-end pt-5">
          <ButtonDefault
            title={t("LOGIN.SUBMIT")}
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