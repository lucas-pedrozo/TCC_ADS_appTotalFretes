import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "@/src/context/ThemeContext";
import { useHookGetVehicle } from "@/src/hooks/vehicle/hookGetVehicle";


type CardVehicleProps = {
  vehicleId?: number | null;
}

export const CardVehicle = ({ vehicleId }: CardVehicleProps) => {
  const { mode } = useThemeMode();

  const { handleGetVehicle, vehicleData } = useHookGetVehicle();

  useEffect(() => {
    if (vehicleId) {
      handleGetVehicle(vehicleId);
    }
  }, [vehicleId, handleGetVehicle]);

  return (
    <>
      <View className="flex-row justify-between items-center pt-6 pb-2.5 px-0.5">
        <Text className="text-lightText dark:text-darkText font-semibold text-lg">Meu Veículo</Text>

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
            <Text className="text-lightText dark:text-darkText text-sm">Modelo: {vehicleData?.model || "N/A"}</Text>
            <Text className="text-lightText dark:text-darkText text-sm">Placa: {vehicleData?.plate || "N/A"}</Text>
            <Text className="text-lightText dark:text-darkText text-sm">Marca: {vehicleData?.brand || "N/A"}</Text>
          </View>
          <View className="flex-col items-end flex-1">
            <Text className="text-lightText dark:text-darkText text-sm text-end">Eixos: {vehicleData?.axle || "N/A"}</Text>
            <Text className="text-lightText dark:text-darkText text-sm text-end">Comprimento: {vehicleData?.size || "N/A"}</Text>
            <Text className="text-lightText dark:text-darkText text-sm text-end">Peso: {vehicleData?.weight != null ? `${vehicleData.weight}${typeof vehicleData.weight === "number" ? "T" : ""}` : "N/A"}</Text>
          </View>
        </View>

      </TouchableOpacity>
    </>
  )
};