import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import i18n from "@/src/i18n";
import type { PickedUserImage } from "@/src/services/userImageUpload";

export function useImagePicker() {
  const { notify } = useAlertDefault();
  const [pickedImage, setPickedImage] = useState<PickedUserImage | null>(null);

  const handlePickFromGallery = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      await notify({
        status: "alert",
        message: i18n.t("NOTIFICATIONS.GALLERYPERMISSIONDENIED"),
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPickedImage({
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName,
      });
    }
  }, [notify]);

  const handleTakePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      await notify({
        status: "alert",
        message: i18n.t("NOTIFICATIONS.CAMERAPERMISSIONDENIED"),
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPickedImage({
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName,
      });
    }
  }, [notify]);

  return {
    pickedImage,
    imageUri: pickedImage?.uri ?? null,
    handlePickFromGallery,
    handleTakePhoto,
  };
}
