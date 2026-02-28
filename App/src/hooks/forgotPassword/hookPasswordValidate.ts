import { useCallback } from "react";
import i18n from "@/src/i18n";
import { AxiosError } from "axios";
import http from "@/src/service/http";
import { useForm } from "react-hook-form";
import { RootStackParamList } from "@/src/routes/Routes";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";

interface PasswordValidateForm {
  code: string;
}

export function useHookPasswordValidate() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "VerificationCode">>();
  const { notify } = useAlertDefault();
  const email = route.params?.email ?? "";

  const { control, handleSubmit, formState: { errors } } = useForm<PasswordValidateForm>({
    defaultValues: { code: "" },
    mode: "onSubmit",
  });

  const handleValidateCode = useCallback(async (data: PasswordValidateForm) => {
    if (!email) {
      await notify({ status: "error", message: "Email não informado. Volte e informe o email." });
      return;
    }
    try {
      await notify({
        status: "loading",
        message: i18n.t("notifications.codeValidationLoading"),
      });

      const response = await http.post("/auth/validate-code", {
        email,
        code: data.code.trim(),
      });

      await notify({
        status: "success",
        message: response.data.message ?? "Código validado com sucesso",
      });

      const resetToken = response.data.resetToken as string;
      if (!resetToken) {
        await notify({ status: "error", message: "Resposta inválida. Tente novamente." });
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      navigation.navigate("NewPassword", { email, resetToken });

    } catch (error) {
      await notify({
        status: "error",
        message:
          (error as AxiosError<{ message: string }>).response?.data
            ?.message ?? "Código inválido",
      });
    }
  }, [email, notify, navigation]);

  const rules = {
    code: {
      required: "Código é obrigatório",
      minLength: {
        value: 6,
        message: "Código deve ter 6 dígitos",
      },
    },
  };

  return {
    control,
    handleSubmit,
    errors,
    rules,
    handleValidateCode,
    email,
  };
}