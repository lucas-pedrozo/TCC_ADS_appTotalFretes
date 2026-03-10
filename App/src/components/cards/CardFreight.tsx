import { FreightUserMap } from "@/src/interfaces";
import { useThemeColors } from "@/src/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";

type CardFreightProps = {
  navigateTo?: () => void;
  freight: FreightUserMap | null;
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
        <Text className="text-base font-semibold" style={{ color: colors.text }}>{freight?.vehicle_group?.name ?? t("CARD.ACTIVITY.NONE")}</Text>
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          {freight?.cargo?.name ?? t("CARD.ACTIVITY.NONE")} / {freight?.cargo?.weight ?? t("CARD.ACTIVITY.N_A")}
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
          <Image source={require("@/src/assets/Logos.png")} className="max-w-auto h-auto pb-1" resizeMode="contain" />
          <Text className="font-semibold text-sm" style={{ color: colors.text }}>
            {t("CARD.FREIGHT.FREIGHT")}: R$ {freight?.final_value ?? t("CARD.ACTIVITY.N_A")}
          </Text>
        </View>

        <View className="flex-1 justify-end items-end">
          <Image source={require("@/src/assets/carga.png")} className="w-full" resizeMode="contain" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
