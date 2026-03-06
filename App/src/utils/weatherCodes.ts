import type { Ionicons } from "@expo/vector-icons";

/**
 * Mapeamento WMO weather_code → descrição em PT-BR.
 * Ref: https://open-meteo.com/en/docs#api-documentation
 */
const WEATHER_CODE_LABELS: Record<number, string> = {
  0: "Céu limpo",
  1: "Parc. limpo",
  2: "Parc. nublado",
  3: "Parc. nublado",
  45: "Neblina",
  48: "Neblina gelada",
  51: "Garoa leve",
  53: "Garoa moderada",
  55: "Garoa densa",
  61: "Chuva leve",
  63: "Chuva moderada",
  65: "Chuva forte",
  71: "Neve leve",
  73: "Neve moderada",
  75: "Neve forte",
  77: "Grãos de neve",
  80: "Pancadas de chuva leve",
  81: "Pancadas de chuva moderada",
  82: "Pancadas de chuva forte",
  85: "Pancadas de neve leve",
  86: "Pancadas de neve forte",
  95: "Trovoada",
  96: "Trovoada com granizo leve",
  99: "Trovoada com granizo forte",
};

const WEATHER_CODE_ICONS: Record<number, keyof typeof Ionicons.glyphMap> = {
  0: "sunny-outline",
  1: "partly-sunny-outline",
  2: "partly-sunny-outline",
  3: "cloudy-outline",
  45: "cloudy-outline",
  48: "cloudy-outline",
  51: "rainy-outline",
  53: "rainy-outline",
  55: "rainy-outline",
  61: "rainy-outline",
  63: "rainy-outline",
  65: "rainy-outline",
  71: "snow-outline",
  73: "snow-outline",
  75: "snow-outline",
  77: "snow-outline",
  80: "rainy-outline",
  81: "rainy-outline",
  82: "rainy-outline",
  85: "snow-outline",
  86: "snow-outline",
  95: "thunderstorm-outline",
  96: "thunderstorm-outline",
  99: "thunderstorm-outline",
};

const FALLBACK_ICON: keyof typeof Ionicons.glyphMap = "partly-sunny-outline";

export function getWeatherDescription(code: number): string {
  return WEATHER_CODE_LABELS[code] ?? "Condição desconhecida";
}

export function getWeatherIcon(
  code: number | undefined
): keyof typeof Ionicons.glyphMap {
  if (code != null && code in WEATHER_CODE_ICONS) {
    return WEATHER_CODE_ICONS[code];
  }
  return FALLBACK_ICON;
}
