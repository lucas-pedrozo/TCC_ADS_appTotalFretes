import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import http from "@/src/services/http";
import { useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import i18n from "@/src/i18n";
import { getValidationRules, validatePasswordConfirmationMatch } from "@/src/utils/formValidations";

export interface NewPasswordForm {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export function useNewPassword() {
  const { notify } = useAlertDefault();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "NewPassword">>();

  const resetToken = route.params?.resetToken ?? "";
  const { control, handleSubmit, formState: { errors }, watch } = useForm<NewPasswordForm>({ mode: "onSubmit" });

  const handleResetPassword = useCallback(async (data: NewPasswordForm) => {
    if (!resetToken) {
      await notify({
        status: "error",
        message: i18n.t("NOTIFICATIONS.INVALIDSESSION")
      });
      return;
    }

    try {
      await notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.NEWPASSWORDLOADING"),
      });

      await http.post("auth/reset-password", { resetToken, data });

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.NEWPASSWORDSUCCESS"),
      });

      navigation.navigate({ name: "Login", params: { startMode: "full" } });
    } catch (error) {
      notify({
        status: "error",
        message: (error as AxiosError<{ message: string }>).response?.data?.message ?? i18n.t("NOTIFICATIONS.ERROR"),
      });
    }
  }, [resetToken, notify, navigation]);

  const validationRules = getValidationRules();
  const rules = {
    oldPassword: validationRules.currentPassword,
    password: validationRules.password,
    confirmPassword: {
      required: validationRules.confirmPassword.required,
      validate: (value: string) =>
        validatePasswordConfirmationMatch(value, watch("password")) ||
        i18n.t("VALIDATION.INVALIDCONFIRMPASSWORD"),
    },
  };

  return {
    control,
    handleSubmit,
    errors,
    rules,
    handleResetPassword,
  };
}
