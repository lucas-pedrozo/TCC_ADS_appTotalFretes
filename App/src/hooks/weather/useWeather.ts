import { useCallback, useEffect, useState } from "react";
import {
  getCurrentCoordinates,
  getCityFromCoordinates,
} from "@/src/service/location";
import { fetchWeatherByCoordinates, WeatherData } from "@/src/service/weather";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";

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
        message: "Não foi possível obter o clima.",
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
