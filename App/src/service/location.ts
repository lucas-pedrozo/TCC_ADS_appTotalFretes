import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  state?: string;
  county?: string;
  country?: string;
}

interface NominatimResponse {
  address?: NominatimAddress;
}

/**
 * Solicita permissão de localização em primeiro plano.
 * @returns status da permissão: "granted" | "denied"
 */
export async function requestLocationPermission(): Promise<
  'granted' | 'denied'
> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted' ? 'granted' : 'denied';
}

/**
 * Obtém as coordenadas atuais do dispositivo.
 * Solicita permissão se ainda não foi concedida.
 * @returns Coordenadas ou null se permissão negada ou erro ao obter posição
 */
export async function getCurrentCoordinates(): Promise<Coordinates | null> {
  const permission = await requestLocationPermission();
  if (permission !== 'granted') {
    return null;
  }

  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch {
    return null;
  }
}

const NOMINATIM_USER_AGENT = 'TCC_CursoTADS_App/1.0';


export async function getCityFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': NOMINATIM_USER_AGENT,
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as NominatimResponse;
    const addr = data?.address;
    if (!addr) return null;
    return (
      addr.city ??
      addr.town ??
      addr.village ??
      addr.municipality ??
      addr.county ??
      addr.state ??
      null
    );
  } catch {
    return null;
  }
}
