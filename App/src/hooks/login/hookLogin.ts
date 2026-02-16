import { useCallback } from "react";

import http from "../../service/http";
import { cpf } from 'cpf-cnpj-validator';
import { useForm } from "react-hook-form";
import { useNotification } from "@/src/context/NotificationContext";

interface LoginForm {
  cpf: string;
  password: string;
}

function useHookLogin() {
  const { notify } = useNotification();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { cpf: "", password: "" },
    mode: "onSubmit",
  });

  const handleLogin = useCallback( async (data: LoginForm) => {
      try {

        setTimeout(() => {
          notify({
            status: "loading",
            message: "Efetuando login...",
          });
        }, 100);

        await http.post("/login", data);

        await notify({
          status: "success",
          message: "Login efetuado com sucesso!",
        });

      } catch (error) {
        console.error("Login error:", error);
        await notify({
          status: "error",
          message: "Erro ao efetuar login. Verifique suas credenciais.",
        });
      }
    },
    [notify]
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
    password: {
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