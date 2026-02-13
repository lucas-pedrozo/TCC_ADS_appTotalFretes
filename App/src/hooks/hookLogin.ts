import { useCallback } from "react";

import http from "../service/http";
import { cpf } from 'cpf-cnpj-validator';
import { useForm } from "react-hook-form";
import { useNotification } from "@/src/context/NotificationContext";


interface LoginForm {
  cpf: string;
  senha: string;
}

function useHookLogin() {
  const { notify } = useNotification();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { cpf: "", senha: "" },
  });

  const handleLogin = useCallback(
    async (data: LoginForm) => {
      try {
        notify({
          status: "loading",
          message: "Efetuando login...",
        });

        await http.post("/login", {
          cpf: data.cpf,
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