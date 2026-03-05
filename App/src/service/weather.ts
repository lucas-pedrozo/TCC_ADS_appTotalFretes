import { getCityFromCoordinates } from '@/src/service/location';

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';

export interface OpenMeteoCurrent {
  time: string;
  temperature_2m: number;
  weather_code: number;
  relative_humidity_2m?: number;
}

export interface OpenMeteoResponse {
  current: OpenMeteoCurrent;
}

export interface WeatherResult {
  temperatura: number;
  weatherCode: number;
  descricao: string;
  cidade?: string;
}

/**
 * Mapeamento resumido dos weather_code do Open-Meteo (WMO) para descrição em PT-BR.
 * Documentação: https://open-meteo.com/en/docs#api-documentation
 */
const WEATHER_CODE_LABELS: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Parc. limpo',
  2: 'Parc. nublado',
  3: 'Parc. nublado',
  45: 'Neblina',
  48: 'Neblina gelada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa densa',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Grãos de neve',
  80: 'Pancadas de chuva leve',
  81: 'Pancadas de chuva moderada',
  82: 'Pancadas de chuva forte',
  85: 'Pancadas de neve leve',
  86: 'Pancadas de neve forte',
  95: 'Trovoada',
  96: 'Trovoada com granizo leve',
  99: 'Trovoada com granizo forte',
};

function getWeatherDescription(code: number): string {
  return WEATHER_CODE_LABELS[code] ?? 'Condição desconhecida';
}


/**
 * 
 * @description Busca dados de clima atual via Open-Meteo (latitude/longitude).
 * @param latitude Latitude da localização
 * @param longitude Longitude da localização
 * @returns 
 */
export async function fetchWeatherByCoordinates(
  latitude: number,
  longitude: number
): Promise<WeatherResult | null> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,weather_code,relative_humidity_2m',
  });

  try {
    const res = await fetch(`${OPEN_METEO_BASE}?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as OpenMeteoResponse;
    const current = data?.current;
    if (!current) return null;

    const cidade = await getCityFromCoordinates(latitude, longitude);
 
    return {
      temperatura: Math.round(current.temperature_2m),
      weatherCode: current.weather_code,
      descricao: getWeatherDescription(current.weather_code),
      cidade: cidade ?? undefined,
    };
  } catch {
    return null;
  }
}
