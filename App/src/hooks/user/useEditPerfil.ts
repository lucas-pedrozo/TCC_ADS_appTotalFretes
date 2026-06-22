import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";

import i18n from "@/src/i18n";
import http from "@/src/services/http";
import { useAuth } from "@/src/context/AuthContext";
import { maskEmailForDisplay } from "@/src/utils/formMask";
import type { EditPerfilMap } from "@/src/interfaces/profile";
import { uploadUserImage, type PickedUserImage } from "@/src/services/userImageUpload";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { getApiErrorMessage } from "@/src/utils/apiError";
import { applyRhfFieldErrors, parseApiFieldErrors } from "@/src/utils/apiFieldErrors";

import { RootStackParamList } from "@/src/routes/Routes";
import { getValidationRules } from "@/src/utils/formValidations";
import { fetchUserAvatarUrl } from "@/src/services/userAvatarUrl";
import { RouteProp, useRoute, NavigationProp, useNavigation } from "@react-navigation/native";

export interface UseEditPerfilOptions {
  pendingImage?: PickedUserImage | null;
}

export function useEditPerfil(options: UseEditPerfilOptions = {}) {
  const { pendingImage } = options;
  const { id, token, addSavedAccount } = useAuth();
  const { notify } = useAlertDefault();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "EditPerfil">>();
  const editPerfilData = route.params?.editPerfilData;
  const isSubmittingRef = useRef(false);

  const { control, handleSubmit, setError, formState: { errors } } = useForm<EditPerfilMap>({
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
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.EDITPERFILLOADING"),
      });

      const { cpf: _cpf, ...editableData } = data;
      let payload: Omit<EditPerfilMap, "cpf"> & { userImage_id?: number } = editableData;

      if (pendingImage) {
        if (id == null) {
          throw new Error(i18n.t("NOTIFICATIONS.ERROR"));
        }
        if (__DEV__) {
          console.log("[useEditPerfil] upload.start", {
            userId: id,
            hasToken: Boolean(token),
            tokenLength: token?.length ?? 0,
            imageUri: pendingImage.uri,
          });
        }
        const userImage = await uploadUserImage(pendingImage, Number(id), token);
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
      const parsed = parseApiFieldErrors(error);
      if (parsed?.fieldErrors.length) {
        applyRhfFieldErrors(setError, parsed.fieldErrors);
      }
      notify({
        status: "error",
        message: getApiErrorMessage(error, i18n.t("NOTIFICATIONS.ERROR"), {
          timeoutMessage: i18n.t("NOTIFICATIONS.IMAGEUPLOADTIMEOUT"),
        }),
      });
    } finally {
      isSubmittingRef.current = false;
    }
  }, [notify, id, token, pendingImage, navigation, addSavedAccount, setError]);

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
