import http from "../../service/http";
import { useNotification } from "@/src/context/NotificationContext";

export interface SingUpFormData {
  cnh?: string;
  cpf?: string;
  nome?: string;
  senha?: string;
  email?: string;
  oculos?: string;
  tipoCnh?: string;
  deficiencia?: string;
  orgaoEmissor?: string;
  dataNascimento?: string;
  numeroTelefone?: string;
  confirmarSenha?: string;
}

export function useHookSingUp() {
  const { notify } = useNotification();

  const notifyWithDelay = async (payload: { status: "loading" | "success" | "error"; message?: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await notify(payload);
  };

  const handleSingUp = async (data: SingUpFormData) => {
    try {
      await notifyWithDelay({ status: "loading", message: "Criando conta..." });
      await http.post("/singup", data);
      await notifyWithDelay({ status: "success", message: "Conta criada com sucesso!" });
    } catch (error) {
      console.error("SingUp error:", error);
      await notifyWithDelay({ status: "error", message: "Erro ao criar conta. Verifique os dados e tente novamente." });
    }
  }

  return {
    handleSingUp,
  };
}
