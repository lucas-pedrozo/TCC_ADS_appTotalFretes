import { Ionicons } from "@expo/vector-icons"
import { useThemeMode } from "@/src/context/ThemeContext"
import { ActivityIndicator, Text, View } from "react-native"

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

function getWeatherIcon(weatherCode: number | undefined): keyof typeof Ionicons.glyphMap {
  if (weatherCode != null && weatherCode in ICON_BY_WEATHER_CODE) {
    return ICON_BY_WEATHER_CODE[weatherCode];
  }
  return "partly-sunny-outline";
}

export const CardClime = ({ clima, cidade, temp, loading, weatherCode }: CardClimeProps) => {
  const { mode } = useThemeMode();
  const iconName = getWeatherIcon(weatherCode);

  return (
    <View className="flex-1 min-h-[140px] rounded-2xl bg-lightBgNonary dark:bg-darkBgNonary p-4 border border-lightBgTertiary dark:border-darkBgTertiary">
      <View className="w-12 h-12 rounded-xl bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
        <Ionicons name={iconName} size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
      </View>

      <Text className="text-lightText dark:text-darkText text-sm mt-4" numberOfLines={1}>Clima: {loading ? "buscando..." : clima ?? "--"}</Text>
      <Text className="text-lightText dark:text-darkText text-sm mt-1" numberOfLines={1}>Temp: {loading ? "buscando..." : temp != null ? `${temp}ºC` : "--"}</Text>
      {cidade ? <Text className="text-lightText dark:text-darkText text-sm mt-1" numberOfLines={1}>Cidade: {loading ? "buscando..." : cidade}</Text> : null}
    </View>
  )
}