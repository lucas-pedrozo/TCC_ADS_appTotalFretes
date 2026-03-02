import { useCallback } from "react";
import http from "../../service/http";
import { useForm } from "react-hook-form";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { validationRules } from "@/src/utils/formValidations";

import i18n from "@/src/i18n";
import { AxiosError } from "axios";
import { useAuth } from "@/src/context/AuthContext";
import { RootStackParamList } from "@/src/routes/Routes";
import { NavigationProp, useNavigation } from "@react-navigation/native";


interface LoginForm {
  email: string;
  password: string;
}

function useHookLogin() {
  const { notify } = useAlertDefault();
  const { login } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const handleLogin = useCallback(async (data: LoginForm) => {
    try {

      notify({
        status: "loading",
        message: i18n.t("notifications.loginLoading"),
      });

      const response = await http.post("/auth/login", data);
      const token = response.data.token;
      login(token);

      await notify({
        status: "success",
        message: response.data.message ?? i18n.t("notifications.loginSuccess"),
      });

      await new Promise(resolve => setTimeout(resolve, 1200));
      navigation.navigate("Home");

    } catch (error) {
      notify({
        status: "error",
        message: (error as AxiosError<{ message: string }>).response?.data.message ?? i18n.t("notifications.loginError"),
      });
    }
  },
    [notify, login, navigation]
  );

  const rules = {
    email: validationRules.email,
    password: validationRules.password,
  }

  return {
    handleLogin,
    handleSubmit,
    control,
    errors,
    rules
  };
}

export default useHookLogin;