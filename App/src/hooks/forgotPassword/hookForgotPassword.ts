import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { validationRules } from "@/src/utils/formValidations";

import { RootStackParamList } from "@/src/routes/Routes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import http from "@/src/service/http";
import { AxiosError } from "axios";

interface ForgotPasswordForm {
  email: string;
}

export function useHookForgotPassword() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { notify } = useAlertDefault();

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const handleForgotPassword = useCallback(async (data: ForgotPasswordForm) => {
    try {
      await notify({ status: "loading", message: "Carregando..." });

      const response = await http.post("/auth/forgot-password", { email: data.email });

      await notify({
        status: "success",
        message: response.data.message ?? "Se o email estiver cadastrado, você receberá o código.",
      });

      await new Promise((resolve) => setTimeout(resolve, 1200));

      navigation.navigate("PasswordValidate", { email: data.email.trim() });
    } catch (error) {
      console.log(error)

      await notify({
        status: "error",
        message: (error as AxiosError<{ message: string }>).response?.data.message,
      })
    }
  }, [notify, navigation])

  const rules = { email: validationRules.email };

  return {
    rules,
    control,
    handleSubmit,
    errors,
    handleForgotPassword
  }
}