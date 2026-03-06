import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";

export function useImagePicker() {
  const { notify } = useAlertDefault();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePickFromGallery = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      await notify({
        status: "alert",
        message: "Permissão para acessar a galeria foi negada.",
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
      setImageUri(result.assets[0].uri);
    }
  }, [notify]);

  const handleTakePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      await notify({
        status: "alert",
        message: "Permissão para usar a câmera foi negada.",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }, [notify]);

  return {
    imageUri,
    handlePickFromGallery,
    handleTakePhoto,
  };
}
