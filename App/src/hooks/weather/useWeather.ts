import { useCallback, useEffect, useState } from "react";
import {
  getCurrentCoordinates,
  getCityFromCoordinates,
} from "@/src/services/location";
import { fetchWeatherByCoordinates, WeatherData } from "@/src/services/weather";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import i18n from "@/src/i18n";

export interface WeatherDisplayData extends WeatherData {
  cidade?: string;
}

export function useWeather() {
  const { notify } = useAlertDefault();
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherDisplayData | null>(
    null
  );

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    try {
      const coords = await getCurrentCoordinates();
      if (!coords) {
        notify({
          status: "error",
          message:
            "Permissão de localização negada. Ative o GPS para ver o clima.",
        });
        setWeatherData(null);
        return;
      }

      const [weather, city] = await Promise.all([
        fetchWeatherByCoordinates(coords.latitude, coords.longitude),
        getCityFromCoordinates(coords.latitude, coords.longitude),
      ]);

      setWeatherData(
        weather ? { ...weather, cidade: city ?? undefined } : null
      );
    } catch {
      notify({
        status: "error",
        message: i18n.t("NOTIFICATIONS.WEATHERFETCHFAILED"),
      });
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    weatherData,
    loading,
    refetch: fetchWeather,
  };
}
