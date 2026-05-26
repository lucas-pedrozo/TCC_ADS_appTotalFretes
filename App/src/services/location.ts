import axios from 'axios';
import * as Location from 'expo-location';

export interface Coordinates {
	latitude: number;
	longitude: number;
}

/**
 * @returns 'granted' se a permissão foi concedida, 'denied' caso contrário
 * @description Solicita permissão para usar o GPS do dispositivo
 */
export async function requestLocationPermission(): Promise<'granted' | 'denied'> {
	const { status } = await Location.requestForegroundPermissionsAsync();
	return status === 'granted' ? 'granted' : 'denied';
}

const COORDS_CACHE_TTL_MS = 45_000;
const GPS_TIMEOUT_MS = 15_000;
let coordsCache: { coords: Coordinates; expiresAt: number } | null = null;

const timeout = (ms: number) => new Promise<never>((_, reject) =>
	setTimeout(() => reject(new Error('GPS_TIMEOUT')), ms)
);

/**
 * @returns Coordinates se a permissão foi concedida, null caso contrário
 * @description Obtém as coordenadas atuais do dispositivo
 */
export async function getCurrentCoordinates(): Promise<Coordinates | null> {
	if ((await requestLocationPermission()) !== 'granted') return null;

	const now = Date.now();
	if (coordsCache && coordsCache.expiresAt > now) return coordsCache.coords;

	try {
		const location = await Promise.race([
			Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
				timeInterval: 10_000,
			}),
			timeout(GPS_TIMEOUT_MS),
		]);

		const coords: Coordinates = {
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
		};
		coordsCache = { coords, expiresAt: now + COORDS_CACHE_TTL_MS };
		return coords;
	} catch {
		return null;
	}
}

export function clearCoordinatesCache(): void {
	coordsCache = null;
}

export type NavigationLocationWatcher = {
	remove: () => void;
};

/**
 * Atualização contínua de GPS para navegação (alta frequência moderada).
 * Deve ser removido ao sair da navegação para economizar bateria.
 */
export async function startNavigationLocationWatch(
	onUpdate: (coords: Coordinates) => void,
): Promise<NavigationLocationWatcher | null> {
	if ((await requestLocationPermission()) !== 'granted') return null;

	const sub = await Location.watchPositionAsync(
		{
			accuracy: Location.Accuracy.High,
			timeInterval: 1000,
			distanceInterval: 5,
		},
		(loc) => {
			onUpdate({
				latitude: loc.coords.latitude,
				longitude: loc.coords.longitude,
			});
		},
	);

	return {
		remove: () => {
			sub.remove();
		},
	};
}

const NOMINATIM_USER_AGENT = 'TCC_CursoTADS_App/1.0';
const CITY_CACHE_TTL_MS = 5 * 60 * 1000;
const COORD_PRECISION = 2;

const cityCache = new Map<string, { city: string | null; expiresAt: number }>();

const cityCacheKey = (lat: number, lon: number) => {
	return `${Math.round(lat * 10 ** COORD_PRECISION) / 10 ** COORD_PRECISION}_${Math.round(lon * 10 ** COORD_PRECISION) / 10 ** COORD_PRECISION}`;
};

/**
 * @returns A cidade encontrada ou null se não foi possível obter a cidade
 * @description Obtém a cidade a partir das coordenadas
 */
export async function getCityFromCoordinates(latitude: number, longitude: number): Promise<string | null> {
	const key = cityCacheKey(latitude, longitude);
	const now = Date.now();
	const cached = cityCache.get(key) ?? null;
	if (cached && cached.expiresAt > now) return cached.city;

	try {
		const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

		const res = await axios.get(url, {
			headers: { Accept: 'application/json', 'User-Agent': NOMINATIM_USER_AGENT },
			timeout: 10000,
		});

		const addr = res.data?.address ?? {};
		const city =
			addr.city ??
			addr.town ??
			addr.village ??
			addr.municipality ??
			addr.county ??
			addr.state_district ??
			null as string | null;
		cityCache.set(key, { city, expiresAt: now + CITY_CACHE_TTL_MS });

		return city;
	} catch (error) {
		console.error('Error getting city from coordinates:', error);
		cityCache.set(key, { city: null, expiresAt: now + CITY_CACHE_TTL_MS });
		return null;
	}
}
