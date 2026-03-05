import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";

type CardFreightProps = {
  name: string;
  origin: string;
  destination: string;
  cargoType: string;
  cargoWeight: string;
  freightValue: string;
}

export const CardFreight = (props: CardFreightProps) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity className="w-full p-2.5 rounded-2xl bg-lightBgNonary dark:bg-darkBgNonary border border-lightBgTertiary dark:border-darkBgTertiary">
      <View className="flex-row justify-between">
        <Text className="text-lightText dark:text-darkText text-base font-semibold">{props.name}</Text>
        <Text className="text-lightTextSecondary dark:text-darkTextSecondary text-sm">{props.cargoType} / {props.cargoWeight}</Text>
      </View>

      <View className="flex-row justify-between pt-1 w-full gap-2">
        <View className="flex-col flex-1 gap-1.5">
          <Text className="text-lightTextSecondary dark:text-darkTextSecondary text-sm" numberOfLines={1}>{t("CARD.FREIGHT.ORIGIN")}: {props.origin}</Text>
          <Text className="text-lightTextSecondary dark:text-darkTextSecondary text-sm" numberOfLines={1}>{t("CARD.FREIGHT.DESTINATION")}: {props.destination}</Text>
          <Image source={require('../../assets/Logos.png')} className="max-w-auto h-auto pb-1" resizeMode="contain" />
          <Text className="text-lightText dark:text-darkText font-semibold text-sm">{t("CARD.FREIGHT.FREIGHT")}: R$ {props.freightValue}</Text>
        </View>

        <View className="flex-1 justify-end items-end">
          <Image source={require('../../assets/carga.png')} className="w-full" resizeMode="contain" />
        </View>
      </View>
    </TouchableOpacity>
  );
}