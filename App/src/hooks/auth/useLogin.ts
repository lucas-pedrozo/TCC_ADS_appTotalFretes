import { useCallback, useState } from "react";
import http from "@/src/services/http";
import { useForm } from "react-hook-form";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { getValidationRules } from "@/src/utils/formValidations";
import { maskEmailForDisplay } from "@/src/utils/formMask";
import type { LoginResponse } from "@/src/types/api";
import { fetchUserAvatarUrl } from "@/src/services/userAvatarUrl";
import i18n from "@/src/i18n";
import { AxiosError } from "axios";
import { useAuth } from "@/src/context/AuthContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";

export interface LoginForm {
  email: string;
  password: string;
}

interface UseLoginOptions {
  passwordOnlyMode?: boolean;
  getEnableBiometricsAfterLogin?: () => boolean;
}

export function useLogin(options: UseLoginOptions = {}) {

  const { notify } = useAlertDefault();
  const [isDesabled, setIsDisabled] = useState(false);
  const { passwordOnlyMode = false, getEnableBiometricsAfterLogin } = options;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { login, lastUsedAccount, addSavedAccount, setBiometricsEnabledAsync } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({ mode: "onSubmit", });

  const handleLogin = useCallback(async (data: LoginForm) => {
    try {
      notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.LOGINLOADING"),
      }); setIsDisabled(true);

      const email = passwordOnlyMode && lastUsedAccount ? lastUsedAccount.email : data.email;
      const password = data.password;
      const payload = { email, password };

      const { token, user: loginUser } = (await http.post<LoginResponse>("auth/login", payload)).data;
      await login(token);

      const uid = loginUser?.id != null ? Number(loginUser.id) : NaN;
      const userImageUrl = Number.isFinite(uid) ? await fetchUserAvatarUrl(uid) : undefined;
      await addSavedAccount(email.trim().toLowerCase(), maskEmailForDisplay(email), userImageUrl);

      if (getEnableBiometricsAfterLogin?.()) {
        await setBiometricsEnabledAsync(true);
      }

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.LOGINSUCCESS"),
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });

    } catch (error) {
      notify({
        status: "error",
        message: (error as AxiosError<{ message: string }>).response?.data?.message ?? i18n.t("NOTIFICATIONS.ERROR"),
      });
    } finally {
      setIsDisabled(false);
    }
  }, [notify, login, navigation, passwordOnlyMode, lastUsedAccount, addSavedAccount, setBiometricsEnabledAsync, getEnableBiometricsAfterLogin]);

  const validationRules = getValidationRules();
  const rules = {
    email: validationRules.email,
    password: validationRules.password,
  };

  return {
    handleLogin,
    handleSubmit,
    control,
    errors,
    rules,
    isDesabled,
  };
}
