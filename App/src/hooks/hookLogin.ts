import { useCallback } from "react";

import http from "../service/http";
import { useNotification } from "@/src/context/NotificationContext";

interface LoginResponse {
  email: string;
  senha: string;
}

function useHookLogin() {
  const { notify } = useNotification();

  const handleLogin = useCallback(
    async (data: LoginResponse) => {
      try {
        notify({ status: "loading", message: "Efetuando login..." });

        await http.post("/login", {
          email: data.email,
          senha: data.senha,
        });

        notify({
          status: "success",
          message: "Login efetuado com sucesso!",

        });
      } catch (error) {
        notify({
          status: "error",
          message: "Erro ao efetuar login. Verifique suas credenciais.",
        });
      }
    },
    [notify]
  );

  return { handleLogin };
}

export default useHookLogin;