import { useCallback } from "react";
import http from "@/src/services/http";
import { useForm } from "react-hook-form";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { getValidationRules } from "@/src/utils/formValidations";
import { maskEmailForDisplay } from "@/src/utils/savedAccounts";
import type { LoginResponse } from "@/src/types/api";

import i18n from "@/src/i18n";
import { AxiosError } from "axios";
import { useAuth } from "@/src/context/AuthContext";
import { RootStackParamList } from "@/src/routes/Routes";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export interface LoginForm {
  email: string;
  password: string;
}

interface UseLoginOptions {
  passwordOnlyMode?: boolean;
  getEnableBiometricsAfterLogin?: () => boolean;
}

export function useLogin(options: UseLoginOptions = {}) {
  const { passwordOnlyMode = false, getEnableBiometricsAfterLogin } = options;
  const { notify } = useAlertDefault();
  const { login, lastUsedAccount, addSavedAccount, setBiometricsEnabledAsync } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const handleLogin = useCallback(async (data: LoginForm) => {
    try {
      notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.LOGINLOADING"),
      });

      const email = passwordOnlyMode && lastUsedAccount ? lastUsedAccount.email : data.email;
      const password = data.password;
      const payload = { email, password };

      const response = await http.post<LoginResponse>("/auth/login", payload);
      const token = response.data.token;
      await login(token);

      await addSavedAccount(email, maskEmailForDisplay(email));

      if (getEnableBiometricsAfterLogin?.()) {
        await setBiometricsEnabledAsync(true);
      }

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.LOGINSUCCESS"),
      });

      await new Promise(resolve => setTimeout(resolve, 1200));
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
      if (message) {
        notify({ status: "error", message });
      }
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
  };
}
