import { AxiosError } from "axios";
import { useCallback } from "react";
import http from "@/src/services/http";
import { useForm } from "react-hook-form";
import { useAuth } from "@/src/context/AuthContext";
import { validationRules } from "@/src/utils/formValidations";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import i18n from "@/src/i18n";

import { RootStackParamList } from "@/src/routes/Routes";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { EditCnhMap } from "@/src/interfaces/profile";

export function useEditCnh() {
  const { notify } = useAlertDefault();
  const { id } = useAuth();

  const route = useRoute<RouteProp<RootStackParamList, "EditCnh">>();
  const editCnhData = route.params?.editCnhData;

  const { control, handleSubmit, formState: { errors } } = useForm<EditCnhMap>({
    defaultValues: {
      cnhNumber: editCnhData?.cnhNumber ?? "",
      issuingAgencyCnh: editCnhData?.issuingAgencyCnh ?? "",
      cnhType_id: editCnhData?.cnhType_id ?? "",
      useGlasses: editCnhData?.useGlasses ?? "",
    },
  });

  const handleEditCnh = useCallback(async (data: EditCnhMap) => {
    try {
      await notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.EDITCNHLOADING"),
      });

      await http.patch<EditCnhMap>(`/user/${id}`, data);

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.EDITCNHSUCCESS"),
      });
    } catch (error) {
      const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
      if (message) {
        notify({ status: "error", message });
      }
    }
  }, [notify, id]);

  const rules = {
    cnhNumber: validationRules.cnhNumber,
    issuingAgencyCnh: validationRules.issuingAgencyCnh,
    cnhType_id: validationRules.cnhType_id,
    useGlasses: validationRules.useGlasses,
  };

  return {
    control,
    errors,
    rules,
    handleEditCnh,
    handleSubmit,
  };
}
