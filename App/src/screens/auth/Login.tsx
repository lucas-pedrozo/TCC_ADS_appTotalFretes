import { useLogin } from "@/src/hooks/auth/useLogin";
import { useAuth } from "@/src/context/AuthContext";
import { useThemeMode, useIconColor } from "@/src/context/ThemeContext";
import { Feather } from "@expo/vector-icons";

import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { InputDefault, ButtonDefault } from "@/src/components/form";

import { RootStackParamList } from "@/src/routes/Routes";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";

/**
 * @description Componente de login estilo BB: fundo em gradiente, card branco com conta salva ou formulário, link Trocar conta com ícone.
 */
const Login = () => {
  const { lastUsedAccount } = useAuth();
  const route = useRoute<RouteProp<RootStackParamList, "Login">>();
  const initialShowFull = route.params?.startMode === "full";
  const [showFullForm, setShowFullForm] = useState(initialShowFull);
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const iconColor = useIconColor();

  useEffect(() => {
    if (route.params?.startMode === "full") {
      setShowFullForm(true);
      return;
    }
    if (route.params?.startMode === "saved") {
      setShowFullForm(false);
    }
  }, [route.params?.startMode]);

  const passwordOnlyMode = Boolean(lastUsedAccount && !showFullForm);
  const { control, rules, handleSubmit, handleLogin } = useLogin({ passwordOnlyMode });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const linkColor = isDark ? "#94a3b8" : "#475569";
  const shouldFocusPassword = Boolean(route.params?.focusPassword && passwordOnlyMode);

  const goForgotPassword = useCallback(() => navigation.navigate("ForgotPassword"), [navigation]);

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-lightBg dark:bg-darkBg"
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: insets.bottom + 24,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {passwordOnlyMode && lastUsedAccount ? (
        <View className="p-5 mb-5 rounded-2xl bg-lightBgNonary dark:bg-darkBgNonary border border-lightBgTertiary dark:border-darkBgTertiary flex-row items-center gap-4">
          <View className="w-12 h-12 rounded-full bg-lightBgTertiary/30 dark:bg-darkBgTertiary/30 items-center justify-center">
            <Feather name="user" size={24} color={iconColor} />
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-sm mb-1 text-lightTextSecondary dark:text-darkTextSecondary">
              {t("LOGIN.SAVEDACCOUNT")}
            </Text>
            <Text className="text-lg font-semibold text-lightText dark:text-darkText" numberOfLines={1}>
              {lastUsedAccount.displayLabel}
            </Text>
          </View>
        </View>
      ) : null}

      {!passwordOnlyMode ? (
        <View className="mb-4">
          <InputDefault
            name="email"
            label={t("LOGIN.EMAILLABEL")}
            placeholder={t("LOGIN.EMAILPLACEHOLDER")}
            type="email-address"
            control={control}
            rules={rules.email}
          />
        </View>
      ) : null}

      <View className="mb-4">
        <InputDefault
          name="password"
          label={t("LOGIN.PASSWORDLABEL")}
          placeholder={t("LOGIN.PASSWORDPLACEHOLDER")}
          type="default"
          secureTextEntry
          autoFocus={shouldFocusPassword}
          control={control}
          rules={rules.password}
        />
      </View>

      <View className="flex-row flex-wrap items-center gap-x-5 gap-y-2 mb-4">
        <Pressable onPress={goForgotPassword}>
          <Text className="text-base font-medium underline text-lightText dark:text-darkText">
            {t("LOGIN.FORGOTPASSWORD")}
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 justify-end">
        <ButtonDefault
          title={t("LOGIN.SUBMIT")}
          onPress={handleSubmit(handleLogin)}
          disabled={false}
          loading={false}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;
