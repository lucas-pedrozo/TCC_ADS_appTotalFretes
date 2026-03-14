import { useCallback } from "react";
import { useForm } from "react-hook-form";

import i18n from "@/src/i18n";
import http from "@/src/services/http";
import { uploadUserImage } from "@/src/services/userImageUpload";
import { useAuth } from "@/src/context/AuthContext";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { EditPerfilMap } from "@/src/interfaces/profile";

import { RootStackParamList } from "@/src/routes/Routes";
import { RouteProp, useRoute } from "@react-navigation/native";
import { getValidationRules } from "@/src/utils/formValidations";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export interface UseEditPerfilOptions {
  pendingImageUri?: string | null;
}

export function useEditPerfil(options: UseEditPerfilOptions = {}) {
  const { pendingImageUri } = options;
  const { id } = useAuth();
  const { notify } = useAlertDefault();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
    let uploadSucceeded = false;
    try {
      notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.EDITPERFILLOADING"),
      });

      let payload: EditPerfilMap & { userImage_id?: number } = { ...data };

      if (pendingImageUri) {
        const userImage = await uploadUserImage(pendingImageUri);
        uploadSucceeded = true;
        payload.userImage_id = userImage.id;
      }

      await http.patch<EditPerfilMap>(`/user/${id}`, payload);

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.EDITPERFILSUCCESS"),
      });

      navigation.navigate("Home" as never);
    } catch {
      notify({ status: "error", message: "Erro ao editar perfil." });
    }
  }, [notify, id, pendingImageUri]);

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
