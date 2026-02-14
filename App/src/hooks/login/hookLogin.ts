import { useCallback } from "react";

import http from "../../service/http";
import { cpf } from 'cpf-cnpj-validator';
import { useForm } from "react-hook-form";
import { useNotification } from "@/src/context/NotificationContext";

interface LoginForm {
  cpf: string;
  senha: string;
}

function useHookLogin() {
  const { notify } = useNotification();

  const notifyWithDelay = useCallback(
    async (payload: { status: "loading" | "success" | "error"; message?: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await notify(payload);
    },
    [notify]
  );

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { cpf: "", senha: "" },
    mode: "onSubmit",
  });

  const handleLogin = useCallback(
    async (data: LoginForm) => {
      try {
        await notifyWithDelay({
          status: "loading",
          message: "Efetuando login...",
        });

        await http.post("/login", data);

        await notifyWithDelay({
          status: "success",
          message: "Login efetuado com sucesso!",
        });

      } catch (error) {
         console.error("Login error:", error);
        await notifyWithDelay({
          status: "error",
          message: "Erro ao efetuar login. Verifique suas credenciais.",
        });
      }
    },
    [notifyWithDelay]
  );

  /**
   * @description Regras de validacao do formulario de login
   * @returns Regras de validacao do formulario de login
   */
  const rules = {
    cpf: {
      required: "CPF é obrigatório",
      validate: (value: string) => cpf.isValid(value) || "CPF inválido"
    },
    senha: {
      required: "Senha é obrigatória",
    },
  }

  return {
    handleLogin,
    handleSubmit,
    control,
    errors,
    rules
  };
}

export default useHookLogin;