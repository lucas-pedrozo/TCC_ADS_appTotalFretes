import i18n from "@/src/i18n";
import { AxiosError } from "axios";
import { useCallback } from "react";
import http from "@/src/services/http";
import { useForm } from "react-hook-form";
import { RootStackParamList } from "@/src/routes/Routes";
import type { ValidateCodeResponse } from "@/src/types/api";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { NavigationProp, useNavigation, useRoute, RouteProp } from "@react-navigation/native";

interface PasswordValidateForm {
  code: string;
}

export function usePasswordValidate() {
  const { notify } = useAlertDefault();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "VerificationCode">>();
  const email = route.params?.email ?? "";

  const { control, handleSubmit, formState: { errors } } = useForm<PasswordValidateForm>({ defaultValues: { code: "" }, mode: "onSubmit" });

  const handleValidateCode = useCallback(async (data: PasswordValidateForm) => {
    if (!email) {
      await notify({
        status: "error",
        message: i18n.t("NOTIFICATIONS.EMAILNOTINFORMED")
      });
      return;
    }

    try {
      await notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.CODEVALIDATIONLOADING"),
      });

      const response = await http.post<ValidateCodeResponse>("/auth/validate-code", {
        email,
        code: data.code.trim(),
      });
      const resetToken = response.data.resetToken;

      if (!resetToken) {
        await notify({
          status: "error",
          message: i18n.t("NOTIFICATIONS.INVALIDRESPONSE")
        });
        return;
      }

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.CODEVALIDATED"),
      });

      navigation.navigate("NewPassword", { email, resetToken });
    } catch (error) {
      notify({
        status: "error",
        message: (error as AxiosError<{ message?: string }>).response?.data?.message ?? i18n.t("NOTIFICATIONS.CODEVALIDATIONERROR"),
      });
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
