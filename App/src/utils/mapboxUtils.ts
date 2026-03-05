/**
 * Utilitários para cálculo de câmera e geometria no Mapbox.
 */

export type GeometriaRota = { coordinates?: [number, number][] };

export interface CameraBounds {
  center: [number, number];
  zoom: number;
}

const FALLBACK_CENTER: [number, number] = [-52.3833, -24.0458];
const FALLBACK_ZOOM = 8;

/**
 * Calcula o centro e o zoom ideais para enquadrar a rota (bbox da geometria).
 * @param geometria Geometria da rota (coordinates)
 * @returns center e zoom para Mapbox.Camera
 */
export function getCameraFromGeometry(
  geometria: GeometriaRota | undefined
): CameraBounds {
  if (!geometria?.coordinates?.length) {
    return { center: FALLBACK_CENTER, zoom: FALLBACK_ZOOM };
  }

  const coords = geometria.coordinates;
  let minLng = coords[0][0];
  let maxLng = coords[0][0];
  let minLat = coords[0][1];
  let maxLat = coords[0][1];

  for (let i = 1; i < coords.length; i++) {
    minLng = Math.min(minLng, coords[i][0]);
    maxLng = Math.max(maxLng, coords[i][0]);
    minLat = Math.min(minLat, coords[i][1]);
    maxLat = Math.max(maxLat, coords[i][1]);
  }

  const center: [number, number] = [
    (minLng + maxLng) / 2,
    (minLat + maxLat) / 2,
  ];
  const span = Math.max(maxLng - minLng, maxLat - minLat);
  const zoom =
    span > 2 ? 4 : span > 0.5 ? 6 : span > 0.1 ? 8 : 10;

  return { center, zoom };
}
