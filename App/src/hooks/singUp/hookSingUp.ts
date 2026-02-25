import http from "../../service/http";

import { RootStackParamList } from "@/src/routes/Routes";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import i18n from "@/src/i18n";
import { AxiosError } from "axios";

export interface SingUpFormData {
  cnhNumber?: string;
  cpf?: string;
  name?: string;
  password?: string;
  email?: string;
  sex?: string;
  useGlasses?: boolean;
  cnhType_id?: number;
  isDeficient?: boolean;
  issuingAgency?: string;
  birthDate?: string;
  phoneNumber?: string;
  confirmPassword?: string;
}

export function useHookSingUp() {
  const { notify } = useAlertDefault();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSingUp = async (data: SingUpFormData) => {
    try {
      await notify({
        status: "loading",
        message: i18n.t("notifications.signUpLoading")
      });

      await http.post("/user/end-account", {
        name: data.name,
        email: data.email,
        sex: data.sex,
        cpf: data.cpf,
        cnhNumber: data.cnhNumber,
        useGlasses: data.useGlasses,
        cnhType_id: data.cnhType_id,
        isDeficient: data.isDeficient,
        issuingAgency: data.issuingAgency,
        birthDate: data.birthDate,
        phoneNumber: data.phoneNumber,
        password: data.password,
        account_type_id: 1,
      });

      await notify({
        status: "success",
        message: i18n.t("notifications.signUpSuccess"),
      });

      await new Promise(resolve => setTimeout(resolve, 1200));
      
      await navigation.navigate("Login");
      
    } catch (error) {
      notify({
        status: "error",
        message: (error as AxiosError<{ message: string }>).response?.data.message ?? i18n.t("notifications.signUpError"),
      });
    }
  }

  return {
    handleSingUp,
  };
}
