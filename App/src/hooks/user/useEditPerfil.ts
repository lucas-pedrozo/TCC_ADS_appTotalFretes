import { AxiosError } from "axios";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import i18n from "@/src/i18n";
import http from "@/src/services/http";
import { useAuth } from "@/src/context/AuthContext";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { EditPerfilMap } from "@/src/interfaces/profile";

import { RootStackParamList } from "@/src/routes/Routes";
import { RouteProp, useRoute } from "@react-navigation/native";
import { getValidationRules } from "@/src/utils/formValidations";

export function useEditPerfil() {
  const { id } = useAuth();
  const { notify } = useAlertDefault();

  const route = useRoute<RouteProp<RootStackParamList, "EditPerfil">>();
  const editPerfilData = route.params?.editPerfilData;

  const { control, handleSubmit, formState: { errors } } = useForm<EditPerfilMap>({
    defaultValues: {
      name: editPerfilData?.name ?? "",
      email: editPerfilData?.email ?? "",
      birthDate: editPerfilData?.birthDate ?? "",
      phoneNumber: editPerfilData?.phoneNumber ?? "",
      cpf: editPerfilData?.cpf ?? "",
      isDeficient: editPerfilData?.isDeficient ?? undefined,
      sex: editPerfilData?.sex ?? "",
    },
    mode: "onSubmit",
  });

  const handleEditPerfil = useCallback(async (data: EditPerfilMap) => {
    try {
      notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.EDITPERFILLOADING"),
      });

      await http.patch<EditPerfilMap>(`/user/${id}`, data);

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.EDITPERFILSUCCESS"),
      });
    } catch (error) {
      const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
      notify({ status: "error", message });
    }
  }, [notify, id]);

  const validationRules = getValidationRules();

  const rules = {
    name: validationRules.name,
    email: validationRules.email,
    cpf: validationRules.cpf,
    sex: validationRules.sex,
    birthDate: validationRules.birthDate,
    phoneNumber: validationRules.phoneNumber,
    isDeficient: validationRules.isDeficient,
  };

  return {
    control,
    handleSubmit,
    handleEditPerfil,
    errors,
    rules,
  };
}
