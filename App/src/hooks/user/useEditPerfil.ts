import { useCallback } from "react";

import { AxiosError } from "axios";
import http from "@/src/services/http";
import { useForm } from "react-hook-form";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import i18n from "@/src/i18n";

import { RootStackParamList } from "@/src/routes/Routes";
import { getValidationRules } from "@/src/utils/formValidations";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useAuth } from "@/src/context/AuthContext";
import type { EditPerfilMap } from "@/src/interfaces/profile";

const SEX_VALUES = ["M", "F", "N"] as const;

export function useEditPerfil() {
  const { notify } = useAlertDefault();
  const { id } = useAuth();
  const route = useRoute<RouteProp<RootStackParamList, "EditPerfil">>();
  const editPerfilData = route.params?.editPerfilData;

  const normalizedSex =
    editPerfilData?.sex && SEX_VALUES.includes(editPerfilData.sex as (typeof SEX_VALUES)[number])
      ? editPerfilData.sex
      : "";

  const { control, handleSubmit, formState: { errors } } = useForm<EditPerfilMap>({
    defaultValues: {
      name: editPerfilData?.name ?? "",
      email: editPerfilData?.email ?? "",
      birthDate: editPerfilData?.birthDate ?? "",
      phoneNumber: editPerfilData?.phoneNumber ?? "",
      cpf: editPerfilData?.cpf ?? "",
      isDeficient: editPerfilData?.isDeficient ?? false,
      sex: normalizedSex,
    },
    mode: "onSubmit",
  });

  const handleEditPerfil = useCallback(async (data: EditPerfilMap) => {
    try {
      notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.EDITPERFILLOADING"),
      });
      const isDeficientValue =
        data.isDeficient === true || String(data.isDeficient) === "true";
      const payload = {
        ...data,
        isDeficient: isDeficientValue,
      };
      await http.patch<EditPerfilMap>(`/user/${id}`, payload);

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.EDITPERFILSUCCESS"),
      });
    } catch (error) {
      const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
      if (message) {
        notify({ status: "error", message });
      }
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
