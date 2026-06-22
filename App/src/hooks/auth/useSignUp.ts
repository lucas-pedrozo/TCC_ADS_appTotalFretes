import http from "@/src/services/http";

import { RootStackParamList } from "@/src/routes/Routes";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import i18n from "@/src/i18n";
import { getApiErrorMessage } from "@/src/utils/apiError";
import {
  applyRhfFieldErrors,
  getSignupScreenForFieldErrors,
  parseApiFieldErrors,
} from "@/src/utils/apiFieldErrors";
import { useSingUpContext } from "@/src/context/SingUpContext";

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
  const { setFieldErrors } = useSingUpContext();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSingUp = async (data: SingUpFormData) => {
    try {
      await notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.SIGNUPLOADING"),
      });
      console.log(data);
      await http.post<SingUpFormData>("user/end-account", {
        ...data,
        account_type_id: 1,
      }
      );

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.SIGNUPSUCCESS"),
      });

      await navigation.navigate({ name: "Login", params: { startMode: "saved", focusPassword: true } });
    } catch (error) {
      const parsed = parseApiFieldErrors(error);
      if (parsed?.fieldErrors.length) {
        setFieldErrors(parsed.fieldErrors);
        navigation.navigate(getSignupScreenForFieldErrors(parsed.fieldErrors));
      }
      notify({
        status: "error",
        message: getApiErrorMessage(error),
      });
    }
  };

  return {
    handleSingUp,
  };
}
