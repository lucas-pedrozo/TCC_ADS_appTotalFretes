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
        message: i18n.t("NOTIFICATIONS.LOGINLOADING"),
      });

      const response = await http.post("/auth/login", data);
      const token = response.data.token;
      await login(token);

      await notify({
        status: "success",
        message: response.data.message ?? i18n.t("NOTIFICATIONS.LOGINSUCCESS"),
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