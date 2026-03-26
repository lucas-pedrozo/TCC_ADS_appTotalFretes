import i18n from "@/src/i18n";
import { AxiosError } from "axios";
import { useCallback } from "react";
import http from "@/src/services/http";
import { useForm } from "react-hook-form";
import { getValidationRules } from "@/src/utils/formValidations";
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

  const { control, handleSubmit, formState: { errors } } = useForm<PasswordValidateForm>({ mode: "onSubmit" });

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

      const response = await http.post<ValidateCodeResponse>("auth/validate-code", { email, data });
      const resetToken = response.data.resetToken;

      if (!resetToken) {
        await notify({
          status: "alert",
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
        message: (error as AxiosError<{ message?: string }>).response?.data?.message ?? i18n.t("NOTIFICATIONS.ERROR"),
      });
    }
  }, [email, notify, navigation]);

  const rules = {
    code: getValidationRules().code,
  };

  return {
    email,
    rules,
    errors,
    control,
    handleSubmit,
    handleValidateCode,
  };
}
