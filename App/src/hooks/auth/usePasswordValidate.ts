import { useCallback } from "react";
import i18n from "@/src/i18n";
import { AxiosError } from "axios";
import http from "@/src/services/http";
import { useForm } from "react-hook-form";
import { RootStackParamList } from "@/src/routes/Routes";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";

interface PasswordValidateForm {
  code: string;
}

export function usePasswordValidate() {
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
        message: i18n.t("NOTIFICATIONS.CODEVALIDATIONLOADING"),
      });

      const response = await http.post("/auth/validate-code", {
        email,
        code: data.code.trim(),
      });

      await notify({
        status: "success",
        message: response.data.message ?? i18n.t("NOTIFICATIONS.CODEVALIDATED"),
      });

      const resetToken = response.data.resetToken as string;
      if (!resetToken) {
        await notify({ status: "error", message: "Resposta inválida. Tente novamente." });
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));

      navigation.navigate("NewPassword", { email, resetToken });
    } catch (error) {
      const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
      if (message) {
        await notify({ status: "error", message });
      }
    }
  }, [email, notify, navigation]);

  const rules = {
    code: {
      required: i18n.t("FORGOTPASSWORDCODE.CODEREQUIRED"),
      minLength: {
        value: 6,
        message: i18n.t("FORGOTPASSWORDCODE.CODEMINLENGTH"),
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
