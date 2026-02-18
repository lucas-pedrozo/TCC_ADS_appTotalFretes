import http from "../../service/http";

import { RootStackParamList } from "@/src/routes/Routes";
import { useNotification } from "@/src/context/NotificationContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export interface SingUpFormData {
  cnhNumber?: string;
  cpf?: string;
  name?: string;
  password?: string;
  email?: string;
  sex?: string;
  useGlasses?: boolean;
  typeCnh?: number;
  isDeficient?: boolean;
  issuingAgency?: string;
  birthDate?: string;
  phoneNumber?: string;
  confirmPassword?: string;
}

export function useHookSingUp() {
  const { notify } = useNotification();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSingUp = async (data: SingUpFormData) => {
    try {
      await notify({
        status: "loading",
        message: "Criando conta..."
      });

      await http.post("/end-account", {
        cnhNumber: data.cnhNumber,
        cpf: data.cpf,
        name: data.name,
        email: data.email,
        sex: data.sex,
        useGlasses: data.useGlasses,
        typeCnh: data.typeCnh,
        isDeficient: data.isDeficient,
        issuingAgency: data.issuingAgency,
        birthDate: data.birthDate,
        phoneNumber: data.phoneNumber,

        password: data.password,
        account_type_id: 1,
      });

      await notify({
        status: "success",
        message: "Conta criada com sucesso!",
      });

      await navigation.navigate("Login");

    } catch (error) {
      console.error("SingUp error:", error);
      await notify({
        status: "error",
        message: "Erro ao criar conta. Verifique os dados e tente novamente."
      });
    }
  }

  return {
    handleSingUp,
  };
}
