import http from "../../service/http";

import { RootStackParamList } from "@/src/routes/Routes";
import { useNotification } from "@/src/context/NotificationContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export interface SingUpFormData {
  cnh?: string;
  cpf?: string;
  fullName?: string;
  senha?: string;
  email?: string;
  sex?: string;
  glasses?: string;
  typeCnh?: string;
  disability?: string;
  fullNameCnh?: string;
  issuingAgency?: string;
  birthDate?: string;
  phoneNumber?: string;
  confirmPassword?: string;
}

export function useHookSingUp() {
  const { notify } = useNotification();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const notifyWithDelay = async (payload: { status: "loading" | "success" | "error"; message?: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await notify(payload);
  };

  const handleSingUp = async (data: SingUpFormData) => {
    try {
      await notifyWithDelay({
        status: "loading",
        message: "Criando conta..."
      });

      await http.post("/singup", data);

      await notifyWithDelay({ 
        status: "success", 
        message: "Conta criada com sucesso!",
      });

      await navigation.navigate("Login");
    } catch (error) {
      console.error("SingUp error:", error);
      await notifyWithDelay({ status: "error", message: "Erro ao criar conta. Verifique os dados e tente novamente." });
    }
  }

  return {
    handleSingUp,
  };
}
