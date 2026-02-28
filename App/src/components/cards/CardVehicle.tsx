import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "@/src/context/ThemeContext";
import { useHookGetVehicle } from "@/src/hooks/vehicle/hookGetVehicle";


interface CardVehicleProps {
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
      <View className="flex-row justify-between items-center pt-5 pb-2.5 px-2.5">
        <Text className="text-lightText dark:text-darkText font-semibold text-lg">Meu Veículo</Text>

        <TouchableOpacity className="w-12 h-12 rounded-xl bg-lightBgTertiary dark:bg-darkBgTertiary items-center justify-center">
          <Ionicons name="chevron-forward-outline" size={24} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="p-4 bg-lightBgSecondary dark:bg-darkBgSecondary rounded-2xl w-full">

        <View className="w-12 h-12 rounded-xl bg-lightBgTertiary dark:bg-darkBgTertiary items-center justify-center">
          <Ionicons name="car" size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
        </View>

        <View className="flex-row justify-between pt-2.5">
          <View className="flex-col">
            <Text className="text-lightText dark:text-darkText text-sm">Modelo: {vehicleData?.model || "N/A"}</Text>
            <Text className="text-lightText dark:text-darkText text-sm">Marca: {vehicleData?.brand || "N/A"}</Text>
            <Text className="text-lightText dark:text-darkText text-sm">Tamanho: {vehicleData?.size || "N/A"}</Text>
          </View>
          <View className="flex-col items-end">
            <Text className="text-lightText dark:text-darkText text-sm text-end">Placa: {vehicleData?.plate || "N/A"}</Text>
            <Text className="text-lightText dark:text-darkText text-sm text-end">Eixo: {vehicleData?.axle || "N/A"}</Text>
            <Text className="text-lightText dark:text-darkText text-sm text-end">Peso: {vehicleData?.weight || "N/A"} T</Text>
          </View>
        </View>

      </TouchableOpacity>
    </>
  )
};