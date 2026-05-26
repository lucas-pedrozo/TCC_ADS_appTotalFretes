import { getWeatherDescription } from "@/src/utils/weatherCodes";
import http from "./http";

const OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast";

export interface OpenMeteoCurrent {
	time: string;
	temperature_2m: number;
	weather_code: number;
	relative_humidity_2m?: number;
}

export interface OpenMeteoResponse {
	current: OpenMeteoCurrent;
}

export interface WeatherData {
	temperatura: number;
	weatherCode: number;
	descricao: string;
}

export async function fetchWeatherByCoordinates(
	latitude: number,
	longitude: number
): Promise<WeatherData | null> {
	const params = new URLSearchParams({
		latitude: String(latitude),
		longitude: String(longitude),
		current: "temperature_2m,weather_code,relative_humidity_2m",
	});

	try {
		const res = await http.get<OpenMeteoResponse>(`${OPEN_METEO_BASE}?${params.toString()}`);

		const current = res.data?.current;
		if (!current) return null;

		return {
			temperatura: Math.round(current.temperature_2m),
			weatherCode: current.weather_code,
			descricao: getWeatherDescription(current.weather_code),
		};
	} catch {
		return null;
	}
}
