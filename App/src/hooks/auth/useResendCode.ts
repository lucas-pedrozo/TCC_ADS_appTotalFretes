import { useCallback } from "react";

import i18n from "@/src/i18n";
import { AxiosError } from "axios";
import http from "@/src/services/http";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { ApiMessageResponse, ResendCodePayload } from "@/src/types/api";
interface UseResendCodeProps {
  email: string;
}

export function useResendCode({ email }: UseResendCodeProps) {
  const { notify } = useAlertDefault();

  const handleResendCode = useCallback(async ( data: ResendCodePayload ) => {

    if (!email) {
      await notify({status: "error", message: i18n.t("NOTIFICATIONS.EMAILNOTINFORMED"),});
      return;
    }

    try {
      await notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.RESENDCODELOADING"),
      });

      await http.post<ApiMessageResponse>("auth/resend-code", data);

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.RESENDCODESUCCESS"),
      });
    } catch (error) {
      await notify({
        status: "error",
        message: (error as AxiosError<{ message: string }>).response?.data?.message ?? i18n.t("NOTIFICATIONS.ERROR"),
      });
    }
  }, [email, notify]);

  return {
    handleResendCode,
  };
}
