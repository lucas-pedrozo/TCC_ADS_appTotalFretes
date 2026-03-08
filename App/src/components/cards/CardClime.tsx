import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";
import { getWeatherIcon } from "@/src/utils/weatherCodes";
import { Text, View } from "react-native";
import { IconBox } from "@/src/components/ui/IconBox";

type CardClimeProps = {
  clima?: string;
  cidade?: string;
  temp?: number;
  loading?: boolean;
  weatherCode?: number;
};

export const CardClime = ({ clima, cidade, temp, loading, weatherCode }: CardClimeProps) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const iconColor = useIconColor();
  const iconName = getWeatherIcon(weatherCode);

  return (
    <View className="flex-1 w-[220px] min-h-[140px] rounded-2xl p-4" style={{ backgroundColor: colors.bgNonary, borderColor: colors.bgTertiary, borderWidth: 1 }}>
      <View className="flex-row justify-between">
        <IconBox name={iconName} />
        <Feather name="arrow-up-right" size={24} color={iconColor} />
      </View>

      <Text className="text-sm mt-4" style={{ color: colors.text }} numberOfLines={1}>
        {t("CARD.CLIME.WEATHER")}: {loading ? t("CARD.CLIME.LOADING") : clima ?? "--"}
      </Text>
      <Text className="text-sm mt-1" style={{ color: colors.text }} numberOfLines={1}>
        {t("CARD.CLIME.TEMP")}: {loading ? t("CARD.CLIME.LOADING") : temp != null ? `${temp}ºC` : "--"}
      </Text>
      <Text className="text-sm mt-1" style={{ color: colors.text }} numberOfLines={1}>
        {t("CARD.CLIME.CITY")}: {loading ? t("CARD.CLIME.LOADING") : cidade ?? "--"}
      </Text>
    </View>
  );
};
