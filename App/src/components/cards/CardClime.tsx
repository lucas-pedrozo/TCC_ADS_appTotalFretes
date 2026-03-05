import { Feather, Ionicons } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"
import { useThemeMode } from "@/src/context/ThemeContext"
import { Text, View } from "react-native"

type CardClimeProps = {
  clima?: string;
  cidade?: string;
  temp?: number;
  loading?: boolean;
  weatherCode?: number;
}

const ICON_BY_WEATHER_CODE: Record<number, keyof typeof Ionicons.glyphMap> = {
  0: "sunny",
  1: "partly-sunny",
  2: "partly-sunny",
  3: "cloudy",
  45: "cloudy",
  48: "cloudy",
  51: "rainy",
  53: "rainy",
  55: "rainy",
  61: "rainy",
  63: "rainy",
  65: "rainy",
  71: "snow",
  73: "snow",
  75: "snow",
  77: "snow",
  80: "rainy",
  81: "rainy",
  82: "rainy",
  85: "snow",
  86: "snow",
  95: "thunderstorm",
  96: "thunderstorm",
  99: "thunderstorm",
};

export const getWeatherIcon = (weatherCode: number | undefined): keyof typeof Ionicons.glyphMap => {
  if (weatherCode != null && weatherCode in ICON_BY_WEATHER_CODE) {
    return ICON_BY_WEATHER_CODE[weatherCode];
  }
  return "partly-sunny-outline";
}

export const CardClime = ({ clima, cidade, temp, loading, weatherCode }: CardClimeProps) => {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const iconName = getWeatherIcon(weatherCode);

  return (
    <View className="flex-1 min-h-[140px] rounded-2xl bg-lightBgNonary dark:bg-darkBgNonary p-4 border border-lightBgTertiary dark:border-darkBgTertiary">
      <View className="flex-row  justify-between">
        <View className="w-12 h-12 rounded-xl bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
          <Ionicons name={iconName} size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
        </View>
        <Feather name="arrow-up-right" size={24} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
      </View>

      <Text className="text-lightText dark:text-darkText text-sm mt-4" numberOfLines={1}>{t("CARD.CLIME.WEATHER")}: {loading ? t("CARD.CLIME.LOADING") : clima ?? "--"}</Text>
      <Text className="text-lightText dark:text-darkText text-sm mt-1" numberOfLines={1}>{t("CARD.CLIME.TEMP")}: {loading ? t("CARD.CLIME.LOADING") : temp != null ? `${temp}ºC` : "--"}</Text>
      <Text className="text-lightText dark:text-darkText text-sm mt-1" numberOfLines={1}>{t("CARD.CLIME.CITY")}: {loading ? t("CARD.CLIME.LOADING") : cidade ?? "--"}</Text>
    </View>
  )
}