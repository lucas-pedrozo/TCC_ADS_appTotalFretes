import { useCallback, useEffect, useState } from "react";
import { getCurrentCoordinates } from "@/src/service/location";
import { fetchWeatherByCoordinates, WeatherResult } from "@/src/service/weather";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";

export function useWeather() {
  
  const { notify } = useAlertDefault();
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherResult | null>(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    try {
      const coords = await getCurrentCoordinates();
      if (!coords) {
        notify({
          status: "error",
          message: "Permissão de localização negada. Ative o GPS para ver o clima.",
        });
        setWeatherData(null);
        return;
      }
      const result = await fetchWeatherByCoordinates(coords.latitude, coords.longitude);
      setWeatherData(result ?? null);
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
