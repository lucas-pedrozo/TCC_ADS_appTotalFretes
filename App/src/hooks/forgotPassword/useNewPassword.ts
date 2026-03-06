import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import http from "@/src/services/http";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import i18n from "@/src/i18n";
import { validationRules, validatePasswordConfirmationMatch } from "@/src/utils/formValidations";

export interface NewPasswordForm {
  password: string;
  confirmPassword: string;
}

export function useNewPassword() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "NewPassword">>();
  const { notify } = useAlertDefault();
  const resetToken = route.params?.resetToken ?? "";

  const { control, handleSubmit, formState: { errors } } = useForm<NewPasswordForm>({
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  const handleResetPassword = useCallback(
    async (data: NewPasswordForm) => {
      if (!resetToken) {
        await notify({ status: "error", message: "Sessão inválida. Refça o fluxo de esqueci minha senha." });
        return;
      }
      try {
        await notify({
          status: "loading",
          message: i18n.t("NOTIFICATIONS.NEWPASSWORDLOADING"),
        });

        await http.post("/auth/reset-password", {
          resetToken,
          password: data.password,
        });

        await notify({
          status: "success",
          message: i18n.t("NOTIFICATIONS.NEWPASSWORDSUCCESS"),
        });
        await new Promise((r) => setTimeout(r, 1200));
        navigation.navigate("Login");
      } catch (error) {
        const message = (error as AxiosError<{ message?: string }>).response?.data?.message ?? "";
        if (message) {
          await notify({ status: "error", message });
        }
      }
    },
    [resetToken, notify, navigation]
  );

  const rules = {
    password: validationRules.password,
    confirmPassword: {
      required: i18n.t("VALIDATION.REQUIREDCONFIRMPASSWORD"),
      validate: (value: string, formValues: NewPasswordForm) =>
        validatePasswordConfirmationMatch(value, formValues?.password ?? "") ||
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
