import { AxiosError } from "axios";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import http from "@/src/services/http";
import i18n from "@/src/i18n";
import type { ApiMessageResponse, ResendCodePayload } from "@/src/types/api";
import { useCallback } from "react";

export function useResendCode({ email }: { email: string }) {
  const { notify } = useAlertDefault();

  const handleResendCode = useCallback(async () => {

    if (!email) {
      await notify({
        status: "error",
        message: i18n.t("NOTIFICATIONS.EMAILNOTINFORMED"),
      });
      return;
    }

    try {
      await notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.RESENDCODELOADING"),
      });

      const payload: ResendCodePayload = { email };
      await http.post<ApiMessageResponse>("/auth/resend-code", payload);

      await notify({
        status: "success",
        message: "Código reenviado com sucesso. Verifique seu email.",
      });
    } catch (error) {
      await notify({
        status: "error",
        message: (error as AxiosError<{ message: string }>).response?.data?.message ?? "Erro ao reenviar código. Tente novamente.",
      });
    }
  }, [email, notify]);

  return {
    handleResendCode,
  };
}
