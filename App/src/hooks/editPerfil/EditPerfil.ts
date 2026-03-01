import { useCallback } from "react";

import { AxiosError } from "axios";
import http from "@/src/service/http";
import { useForm } from "react-hook-form";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";

import { RootStackParamList } from "@/src/routes/Routes";
import { validationRules } from "@/src/utils/formValidations";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useAuth } from "@/src/context/AuthContext";

export interface EditPerfilMap {
  name: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  cpf: string;
  isDeficient?: boolean;
  sex?: string;
}

export function useHookEditPerfil() {
  const { notify } = useAlertDefault();
  const { id } = useAuth();
  const route = useRoute<RouteProp<RootStackParamList, "EditPerfil">>();
  const editPerfilData = route.params?.editPerfilData;

  const { control, handleSubmit, formState: { errors } } = useForm<EditPerfilMap>({
    defaultValues: {
      name: editPerfilData?.name ?? "",
      email: editPerfilData?.email ?? "",
      birthDate: editPerfilData?.birthDate ?? "",
      phoneNumber: editPerfilData?.phoneNumber ?? "",
      cpf: editPerfilData?.cpf ?? "",
      isDeficient: editPerfilData?.isDeficient ?? false,
      sex: editPerfilData?.sex ?? ""
    },
    mode: "onSubmit",
  });

  if(!id) {
    notify({
      status: "alert",
      message: "Erro ao tentar editar perfil. tente mais tarde!",
    });
    throw new Error("User ID is required to edit profile");
  }

  const handleEditPerfil = useCallback(async (data: EditPerfilMap) => {
    try {
      notify({
        status: "loading",
        message: "Editando perfil...",
      });

      await http.patch<EditPerfilMap>(`/user/${id}`, data);

      await notify({
        status: "success",
        message: "Perfil editado com sucesso!",
      });
    } catch (error) {
      notify({
        status: "error",
        message: (error as AxiosError<{ message: string }>).response?.data.message ?? "Erro ao editar perfil",
      });
    }
  }, [notify, id]);


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
  }
}