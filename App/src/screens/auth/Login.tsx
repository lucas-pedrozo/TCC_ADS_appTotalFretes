import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/context/AuthContext";
import { useLogin } from "@/src/hooks/auth/useLogin";
import { InputDefault, ButtonDefault } from "@/src/components/form";
import { useThemeColors, useIconColor } from "@/src/context/ThemeContext";
import { RootStackParamList } from "@/src/routes/Routes";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";

export default function Login() {

  const { t } = useTranslation();
  const colors = useThemeColors();
  const iconColor = useIconColor();
  const insets = useSafeAreaInsets();
  const { lastUsedAccount } = useAuth();

  const route = useRoute<RouteProp<RootStackParamList, "Login">>();
  const initialShowFull = route.params?.startMode === "full";
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [enableBiometricsForNextTime ] = useState(false);
  const [showFullForm, setShowFullForm] = useState(initialShowFull);
  const passwordOnlyMode = Boolean(lastUsedAccount && !showFullForm);
  const shouldFocusPassword = Boolean(route.params?.focusPassword && passwordOnlyMode);
  const getEnableBiometricsAfterLogin = useCallback(() => enableBiometricsForNextTime, [enableBiometricsForNextTime]);

  const { control, rules, handleSubmit, handleLogin, isDesabled } = useLogin({
    passwordOnlyMode,
    getEnableBiometricsAfterLogin,
  });

  const goForgotPassword = useCallback(
    () => navigation.navigate("ForgotPassword"),
    [navigation]
  );

  useEffect(() => {
    if (initialShowFull) {
      setShowFullForm(true);
    } else {
      setShowFullForm(false);
    }
  }, [initialShowFull]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: insets.bottom + 24 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {passwordOnlyMode && lastUsedAccount ? (
        <View className="p-5 mb-5 rounded-2xl flex-row items-center gap-4" style={{ backgroundColor: colors.bgNonary, borderColor: colors.bgTertiary, borderWidth: 1 }}>
          <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: colors.bgNonary }}>
            <Feather name="user" size={24} color={iconColor} />
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-sm mb-1" style={{ color: colors.textSecondary }}>
              {t("LOGIN.SAVEDACCOUNT")}
            </Text>
            <Text className="text-lg font-semibold" style={{ color: colors.text }} numberOfLines={1}>
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
          <Text className="text-base font-medium underline" style={{ color: colors.text }}>
            {t("LOGIN.FORGOTPASSWORD")}
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 justify-end">
        <ButtonDefault
          title={t("LOGIN.SUBMIT")}
          onPress={handleSubmit(handleLogin)}
          disabled={isDesabled}
          loading={false}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};
