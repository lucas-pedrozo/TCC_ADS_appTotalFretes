import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useThemeMode } from "@/src/context/ThemeContext";
import { useGetVehicle } from "@/src/hooks/vehicle/useGetVehicle";

type CardVehicleProps = {
  vehicleId?: number | null;
}

export const CardVehicle = ({ vehicleId }: CardVehicleProps) => {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const { handleGetVehicle, vehicleData } = useGetVehicle();

  useEffect(() => {
    if (vehicleId) {
      handleGetVehicle(vehicleId);
    }
  }, [vehicleId, handleGetVehicle]);

  return (
    <>
      <View className="flex-row justify-between items-center pt-6 pb-2.5 px-0.5">
        <Text className="text-lightText dark:text-darkText font-semibold text-lg">{t("CARD.VEHICLE.MY_VEHICLE")}</Text>

        <TouchableOpacity className="w-10 h-10 rounded-lg bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
          <Ionicons name="chevron-forward-outline" size={22} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="p-4 bg-lightBgNonary dark:bg-darkBgNonary rounded-2xl w-full border border-lightBgTertiary dark:border-darkBgTertiary">

        <View className="w-12 h-12 rounded-xl bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center mb-3">
          <Ionicons name="car-outline" size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
        </View>

        <View className="flex-row justify-between">
          <View className="flex-col flex-1">
            <Text className="text-lightText dark:text-darkText text-sm">{t("CARD.VEHICLE.MODEL")}: {vehicleData?.model || "N/A"}</Text>
            <Text className="text-lightText dark:text-darkText text-sm">{t("CARD.VEHICLE.PLATE")}: {vehicleData?.plate || "N/A"}</Text>
            <Text className="text-lightText dark:text-darkText text-sm">{t("CARD.VEHICLE.BRAND")}: {vehicleData?.brand || "N/A"}</Text>
          </View>
          <View className="flex-col items-end flex-1">
            <Text className="text-lightText dark:text-darkText text-sm text-end">{t("CARD.VEHICLE.AXLES")}: {vehicleData?.axle || "N/A"}</Text>
            <Text className="text-lightText dark:text-darkText text-sm text-end">{t("CARD.VEHICLE.LENGTH")}: {vehicleData?.size || "N/A"}</Text>
            <Text className="text-lightText dark:text-darkText text-sm text-end">{t("CARD.VEHICLE.WEIGHT")}: {vehicleData?.weight != null ? `${vehicleData.weight}${typeof vehicleData.weight === "number" ? "T" : ""}` : "N/A"}</Text>
          </View>
        </View>

      </TouchableOpacity>
    </>
  )
};