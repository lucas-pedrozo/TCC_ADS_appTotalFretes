import { useCallback } from "react";

import http from "../../service/http";
import { useForm } from "react-hook-form";
import { useNotification } from "@/src/context/AlertDefaultContext";
import { validateEmail } from "@/src/utils/formValidations";

import { useAuth } from "@/src/context/AuthContext";


interface LoginForm {
  email: string;
  password: string;
}

function useHookLogin() {
  const { notify } = useNotification();
  const { login } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const handleLogin = useCallback(async (data: LoginForm) => {
    try {

      notify({
        status: "loading",
        message: "Efetuando login...",
      });

      const response = await http.post("auth/login", data);
      const token = response.data.token;
      login(token);

      await notify({
        status: "success",
        message: "Login efetuado com sucesso!",
      });

    } catch (error) {
      console.error("Login error:", error);
      notify({
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
    email: {
      required: "Email é obrigatório",
      validate: (value: string) => validateEmail(value) || "Email inválido"
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