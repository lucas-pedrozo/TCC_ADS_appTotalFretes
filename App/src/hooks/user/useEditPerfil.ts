import { useCallback } from "react";
import { useForm } from "react-hook-form";

import i18n from "@/src/i18n";
import http from "@/src/services/http";
import { AxiosError } from "axios";
import { useAuth } from "@/src/context/AuthContext";
import { maskEmailForDisplay } from "@/src/utils/formMask";
import type { EditPerfilMap } from "@/src/interfaces/profile";
import { uploadUserImage } from "@/src/services/userImageUpload";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";

import { RootStackParamList } from "@/src/routes/Routes";
import { getValidationRules } from "@/src/utils/formValidations";
import { fetchUserAvatarUrl } from "@/src/services/userAvatarUrl";
import { RouteProp, useRoute, NavigationProp, useNavigation } from "@react-navigation/native";

export interface UseEditPerfilOptions {
  pendingImageUri?: string | null;
}

export function useEditPerfil(options: UseEditPerfilOptions = {}) {
  const { pendingImageUri } = options;
  const { id, addSavedAccount } = useAuth();
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
    try {
      notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.EDITPERFILLOADING"),
      });

      let payload: EditPerfilMap & { userImage_id?: number } = { ...data };

      if (pendingImageUri) {
        if (id == null) {
          throw new Error(i18n.t("NOTIFICATIONS.ERROR"));
        }
        const userImage = await uploadUserImage(pendingImageUri, Number(id));
        payload.userImage_id = userImage.id;
      }

      await http.patch<EditPerfilMap>(`user/${id}`, payload);

      if (id != null) {
        const newAvatarUrl = await fetchUserAvatarUrl(Number(id));
        const email = data.email.trim().toLowerCase();
        await addSavedAccount(email, maskEmailForDisplay(email), newAvatarUrl);
      }

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.EDITPERFILSUCCESS"),
      });

      navigation.navigate("Home" as never);
    } catch (error) {
      notify({ 
        status: "error",
        message: (error as AxiosError<{ message: string }>).response?.data?.message ?? i18n.t("NOTIFICATIONS.ERROR"),
      });
    }
  }, [notify, id, pendingImageUri, navigation, addSavedAccount]);

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
