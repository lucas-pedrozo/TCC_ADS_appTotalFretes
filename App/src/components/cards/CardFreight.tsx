import type { FreightAllMap } from "@/src/hooks/freight/useGetAllFreigth";
import type { FreightMap } from "@/src/hooks/freight/useGetFreightUser";
import { useThemeColors } from "@/src/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { maskMoney } from "@/src/utils/formMask";
import { CargoTypeImage } from "@/src/components/freight/CargoTypeImage";
import { Text, TouchableOpacity, View } from "react-native";

type CardFreightProps = {
	navigateTo?: () => void;
	freight: FreightMap | FreightAllMap | null;
};

export const CardFreight = ({ navigateTo, freight }: CardFreightProps) => {
  const colors = useThemeColors();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={navigateTo}
      className="w-full p-2.5 rounded-2xl"
      style={{ backgroundColor: colors.bgNonary, borderColor: colors.bgTertiary, borderWidth: 1 }}
    >
      <View className="flex-row justify-between">
        <Text className="text-base font-semibold" style={{ color: colors.text }}>{freight?.name ?? t("CARD.ACTIVITY.NONE")}</Text>
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          {freight?.cargo?.name ?? t("CARD.ACTIVITY.NONE")} / {`${freight?.weight ?? t("CARD.ACTIVITY.N_A")} kg`}
        </Text>
      </View>

      <View className="flex-row justify-between pt-1 w-full gap-2">
        <View className="flex-col flex-1 gap-1.5">
          <Text className="text-sm" style={{ color: colors.textSecondary }} numberOfLines={1}>
            {t("CARD.FREIGHT.ORIGIN")}: {freight?.origin_label ?? t("CARD.ACTIVITY.NONE")}
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }} numberOfLines={1}>
            {t("CARD.FREIGHT.DESTINATION")}: {freight?.destination_label ?? t("CARD.ACTIVITY.NONE")}
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }} numberOfLines={1}>
            {freight?.status?.name ?? t("CARD.ACTIVITY.NONE")}
          </Text>
          <Text className="font-semibold text-sm" style={{ color: colors.text }}>
            {t("CARD.FREIGHT.FREIGHT")}: {freight?.finalValue ? maskMoney(freight.finalValue) : freight?.originalValue ? maskMoney(freight.originalValue) : t("CARD.ACTIVITY.N_A")}
          </Text>
        </View>

        <View className="flex-1 justify-end items-end">
          <CargoTypeImage cargo={freight?.cargo} className="w-full h-20" resizeMode="contain" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
