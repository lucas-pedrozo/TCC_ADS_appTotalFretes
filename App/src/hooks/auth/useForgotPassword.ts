import { AxiosError } from "axios";
import { useCallback } from "react";
import http from "@/src/services/http";
import type { ApiMessageResponse } from "@/src/types/api";
import { useForm } from "react-hook-form";
import { getValidationRules } from "@/src/utils/formValidations";
import i18n from "@/src/i18n";

import { RootStackParamList } from "@/src/routes/Routes";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";

interface ForgotPasswordForm {
  email: string;
}

export function useForgotPassword() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { notify } = useAlertDefault();
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({ mode: "onSubmit", });

  const handleForgotPassword = useCallback(async (data: ForgotPasswordForm) => {
    try {
      await notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.FORGOTPASSWORDLOADING"),
      });

      const response = await http.post<ApiMessageResponse>("auth/forgot-password", data);

      await notify({
        status: "success",
        message: response.data.message ?? i18n.t("NOTIFICATIONS.FORGOTPASSWORDSUCCESS"),
      });

      navigation.navigate("VerificationCode", data);
    } catch (error) {
      await notify({
        status: "error",
        message: (error as AxiosError<{ message: string }>).response?.data?.message ?? i18n.t("NOTIFICATIONS.ERROR"),
      });
    }
  }, [notify, navigation]);

  const validationRules = getValidationRules();
  const rules = { email: validationRules.email };

  return {
    rules,
    errors,
    control,
    handleSubmit,
    handleForgotPassword,
  };
}
