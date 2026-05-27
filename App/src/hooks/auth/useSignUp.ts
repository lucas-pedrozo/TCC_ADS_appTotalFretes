import http from "@/src/services/http";

import { RootStackParamList } from "@/src/routes/Routes";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AxiosError } from "axios";
import i18n from "@/src/i18n";

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
  issuingAgencyCnh?: string;
  birthDate?: string;
  phoneNumber?: string;
  confirmPassword?: string;
}

export function useSignUp() {
  const { notify } = useAlertDefault();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSingUp = async (data: SingUpFormData) => {
    try {
      await notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.SIGNUPLOADING"),
      });
      console.log(data);
      await http.post<SingUpFormData>("user/end-account", {
        name: data.name,
        email: data.email,
        birthDate: data.birthDate,
        phoneNumber: data.phoneNumber,
        cpf: data.cpf,
        sex: data.sex,
        useGlasses: data.useGlasses,
        isDeficient: data.isDeficient,
        cnhNumber: data.cnhNumber,
        issuingAgencyCnh: data.issuingAgencyCnh,
        cnhType_id: data.cnhType_id,
        password: data.password,
        account_type_id: 1,
      }
      );

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.SIGNUPSUCCESS"),
      });

      await navigation.navigate({ name: "Login", params: { startMode: "saved", focusPassword: true } });
    } catch (error) {
      const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
      if (message) {
        notify({ status: "error", message });
      }
    }
  };

  return {
    handleSingUp,
  };
}
