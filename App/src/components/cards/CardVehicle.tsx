import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useIconColor } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { IconBox } from "@/src/components/ui/IconBox";
import type { MapVehicle } from "@/src/interfaces/vehicle";

type CardVehicleProps = {
  vehicle: MapVehicle | null;
  loading?: boolean;
  onPress?: () => void;
};

function formatWeight(weight: number | undefined | null): string {
  if (weight == null) return "N/A";
  return `${weight}T`;
}

export const CardVehicle = ({ vehicle, loading, onPress }: CardVehicleProps) => {
  const { t } = useTranslation();
  const iconColor = useIconColor();

  return (
    <View>
      <View className="flex-row justify-between items-center pb-2.5 px-0.5">
        <Text className="text-lightText dark:text-darkText font-semibold text-lg">
          {t("CARD.VEHICLE.MY_VEHICLE")}
        </Text>

        <TouchableOpacity
          onPress={onPress}
          className="w-10 h-10 rounded-lg bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center"
        >
          <Ionicons name="chevron-forward-outline" size={22} color={iconColor} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onPress}
        className="p-4 bg-lightBgNonary dark:bg-darkBgNonary rounded-2xl w-full border border-lightBgTertiary dark:border-darkBgTertiary"
      >
        <IconBox name="car-outline" />

        <View className="flex-row justify-between mt-3">
          <View className="flex-col flex-1">
            <Text className="text-lightText dark:text-darkText text-sm">
              {t("CARD.VEHICLE.MODEL")}: {vehicle?.model || "N/A"}
            </Text>
            <Text className="text-lightText dark:text-darkText text-sm">
              {t("CARD.VEHICLE.PLATE")}: {vehicle?.plate || "N/A"}
            </Text>
            <Text className="text-lightText dark:text-darkText text-sm">
              {t("CARD.VEHICLE.BRAND")}: {vehicle?.brand || "N/A"}
            </Text>
          </View>
          <View className="flex-col items-end flex-1">
            <Text className="text-lightText dark:text-darkText text-sm text-end">
              {t("CARD.VEHICLE.AXLES")}: {vehicle?.axle || "N/A"}
            </Text>
            <Text className="text-lightText dark:text-darkText text-sm text-end">
              {t("CARD.VEHICLE.LENGTH")}: {vehicle?.size || "N/A"}
            </Text>
            <Text className="text-lightText dark:text-darkText text-sm text-end">
              {t("CARD.VEHICLE.WEIGHT")}: {formatWeight(vehicle?.weight)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
