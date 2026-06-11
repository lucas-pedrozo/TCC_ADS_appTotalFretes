import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Ionicons } from "@expo/vector-icons";
import { IconBox } from "@/src/components/ui/IconBox";
import { MapVehicle } from "@/src/interfaces/vehicle";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";
import { maskPlate } from "@/src/utils/formMask";

type CardVehicleProps = {
  vehicle: MapVehicle | null;
  onPress?: () => void;
};

function formatWeight(weight: number | undefined | null): string | null {
  if (weight == null) return null;
  return `${weight}T`;
}

export const CardVehicle = ({ vehicle, onPress }: CardVehicleProps) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const iconColor = useIconColor();

  return (
    <View>
      <View className="flex-row justify-between items-center pb-2.5 px-2.5">
        <Text className="font-semibold text-lg" style={{ color: colors.text }}>
          {t("CARD.VEHICLE.MY_VEHICLE")}
        </Text>

        <TouchableOpacity
          onPress={onPress}
          className="w-10 h-10 rounded-lg items-center justify-center"
          style={{ backgroundColor: colors.bgNonary }}
        >
          <Ionicons name="chevron-forward-outline" size={22} color={iconColor} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onPress}
        className={`p-4 rounded-2xl flex-1`}
        style={{ backgroundColor: colors.bgNonary, borderColor: colors.bgTertiary, borderWidth: 1 }}
      >
        <IconBox name="car-outline" />

        <View className="flex-row justify-between mt-3">
          <View className="flex-col flex-1">
            <Text className="text-sm" style={{ color: colors.text }}>
              {t("CARD.VEHICLE.MODEL")}: {vehicle?.model || "---"}
            </Text>
            <Text className="text-sm" style={{ color: colors.text }}>
              {t("CARD.VEHICLE.PLATE")}: {maskPlate(vehicle?.plateNumber || '') || "---"}
            </Text>
            <Text className="text-sm" style={{ color: colors.text }}>
              {t("CARD.VEHICLE.BRAND")}: {vehicle?.mark || "---"}
            </Text>
          </View>
          <View className="flex-col items-end flex-1">
            <Text className="text-sm text-end" style={{ color: colors.text }}>
              {t("CARD.VEHICLE.AXLES")}: {vehicle?.vehicleType?.axes || "---"}
            </Text>
            <Text className="text-sm text-end" style={{ color: colors.text }}>
              {t("CARD.VEHICLE.LENGTH")}: {vehicle?.vehicleType?.length || "---"}
            </Text>
            <Text className="text-sm text-end" style={{ color: colors.text }}>
              {t("CARD.VEHICLE.WEIGHT")}: {formatWeight(vehicle?.vehicleType?.weight) ?? '---'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
