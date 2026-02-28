
import { AxiosError } from "axios";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import http from "@/src/service/http";
import { useCallback } from "react";

export function useHookResendCode(email: string) {
  const { notify } = useAlertDefault();

  const handleResendCode = useCallback(async () => {

    if (!email) {
      await notify({
        status: "alert",
        message: "tente novamente. mais tarde.",
      });
      return;
    }

    try {
      await notify({
        status: "loading",
        message: "Reenviando código...",
      });

      await http.post("/auth/resend-code", { email });

      await notify({
        status: "success",
        message: "Código reenviado com sucesso. Verifique seu email.",
      });
      
    } catch (error) {
      await notify({
        status: "error",
        message: (error as AxiosError<{ message: string }>).response?.data?.message ?? "Erro ao reenviar código. Tente novamente."
      });
    }
  }, [email, notify]);

  return {
    handleResendCode,
  }
}
