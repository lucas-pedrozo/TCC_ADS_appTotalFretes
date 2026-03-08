import { FreightUserMap } from "@/src/interfaces";
import { useThemeColors } from "@/src/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";

/** Item simples de lista (ex.: tela de busca) com campos em camelCase */
export type FreightListItem = {
  id: string;
  name?: string;
  origin?: string;
  destination?: string;
  cargoType?: string;
  cargoWeight?: string;
  freightValue?: string;
};

type CardFreightProps = {
  navigateTo?: () => void;
  freight: FreightUserMap | FreightListItem | null;
};

function getFreightDisplay(freight: FreightUserMap | FreightListItem | null) {
  if (!freight) return { title: "", origin: "", destination: "", cargoName: "", cargoWeight: "", value: "" };
  const isApi = "title" in freight && "origin_label" in freight;
  return {
    title: isApi ? (freight as FreightUserMap).title : (freight as FreightListItem).name ?? "",
    origin: isApi ? (freight as FreightUserMap).origin_label : (freight as FreightListItem).origin ?? "",
    destination: isApi ? (freight as FreightUserMap).destination_label : (freight as FreightListItem).destination ?? "",
    cargoName: isApi ? (freight as FreightUserMap).cargo?.name : (freight as FreightListItem).cargoType ?? "",
    cargoWeight: isApi ? String((freight as FreightUserMap).cargo?.weight ?? "") : (freight as FreightListItem).cargoWeight ?? "",
    value: isApi ? (freight as FreightUserMap).value : (freight as FreightListItem).freightValue ?? "",
  };
}

export const CardFreight = ({ navigateTo, freight }: CardFreightProps) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const d = getFreightDisplay(freight);

  return (
    <TouchableOpacity
      onPress={navigateTo}
      className="w-full p-2.5 rounded-2xl"
      style={{ backgroundColor: colors.bgNonary, borderColor: colors.bgTertiary, borderWidth: 1 }}
    >
      <View className="flex-row justify-between">
        <Text className="text-base font-semibold" style={{ color: colors.text }}>{d.title || t("CARD.ACTIVITY.NONE")}</Text>
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          {d.cargoName || t("CARD.ACTIVITY.NONE")} / {d.cargoWeight || t("CARD.ACTIVITY.N_A")}
        </Text>
      </View>

      <View className="flex-row justify-between pt-1 w-full gap-2">
        <View className="flex-col flex-1 gap-1.5">
          <Text className="text-sm" style={{ color: colors.textSecondary }} numberOfLines={1}>
            {t("CARD.FREIGHT.ORIGIN")}: {d.origin || t("CARD.ACTIVITY.NONE")}
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }} numberOfLines={1}>
            {t("CARD.FREIGHT.DESTINATION")}: {d.destination || t("CARD.ACTIVITY.NONE")}
          </Text>
          <Image source={require("@/src/assets/Logos.png")} className="max-w-auto h-auto pb-1" resizeMode="contain" />
          <Text className="font-semibold text-sm" style={{ color: colors.text }}>
            {t("CARD.FREIGHT.FREIGHT")}: R$ {d.value || t("CARD.ACTIVITY.N_A")}
          </Text>
        </View>

        <View className="flex-1 justify-end items-end">
          <Image source={require("@/src/assets/carga.png")} className="w-full" resizeMode="contain" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
