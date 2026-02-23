import { useCallback } from "react"
import { useForm } from "react-hook-form";
import { validateEmail } from "@/src/utils/formValidations";

import { RootStackParamList } from "@/src/routes/Routes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import http from "@/src/service/http";

interface ForgotPasswordForm {
  email: string;
}

export function useHookForgotPassword() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { notify } = useAlertDefault();

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    defaultValues: { email: "" },
    mode: "onSubmit",
  });;

  const handleForgotPassword = useCallback(async (data: ForgotPasswordForm) => {
    try {

      await notify({
        status: "loading",
        message: "carregando..."
      })

      await http.post("/auth/forgot-password", { email: data.email });

      await notify({
        status: "success",
        message: "Email enviado com sucesso!"
      })

      await new Promise(resolve => setTimeout(resolve, 1200));

      navigation.navigate("Login");
    } catch (error) {
      console.error(error)

      await notify({
        status: "error",
        message: "Erro Ao enviar"
      })
    }
  }, [notify, navigation])

  const rules = {
    email: {
      required: "Email is required",
      validator: validateEmail
    }
  }

  return {
    rules,
    control,
    handleSubmit,
    errors,
    handleForgotPassword
  }
}