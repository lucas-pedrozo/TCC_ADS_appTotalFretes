import { useCallback } from "react";
import http from "@/src/services/http";
import { useForm } from "react-hook-form";
import { useAuth } from "@/src/context/AuthContext";
import { getValidationRules } from "@/src/utils/formValidations";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import i18n from "@/src/i18n";
import { getApiErrorMessage } from "@/src/utils/apiError";

import { RootStackParamList } from "@/src/routes/Routes";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { EditCnhMap } from "@/src/interfaces/profile";

export function useEditCnh() {

  const { id } = useAuth();
  const { notify } = useAlertDefault();

  const route = useRoute<RouteProp<RootStackParamList, "EditCnh">>();
  const editCnhData = route.params?.editCnhData;
  const userName = route.params?.userName ?? "";
  const userImageUrl = route.params?.userImageUrl;

  const { control, handleSubmit, formState: { errors } } = useForm<EditCnhMap>({
    defaultValues: {
      cnhNumber: editCnhData?.cnhNumber ?? "",
      issuingAgencyCnh: editCnhData?.issuingAgencyCnh ?? "",
      cnhType_id: Number(editCnhData?.cnhType_id) || 0,
      useGlasses: editCnhData?.useGlasses ?? false,
    },
  });

  const handleEditCnh = useCallback(async (data: EditCnhMap) => {
    try {
      await notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.EDITCNHLOADING"),
      });

      await http.patch<EditCnhMap>(`user/${id}`, {
        ...data,
        cnhType_id: Number(data.cnhType_id),
      });

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.EDITCNHSUCCESS"),
      });
    } catch (error) {
      notify({
        status: "error",
        message: getApiErrorMessage(error),
      });
    }
  }, [notify, id]);

  const validationRules = getValidationRules();
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
    editCnhData,
    userName,
    userImageUrl,
  };
}
