export interface MapRotaResponse {
  distancia_total_km: number;
  tempo_total_min?: number;
  geometria: { coordinates?: [number, number][] };
  coords_carga?: [number, number];
  coords_destino?: [number, number];
  trecho_ate_carga?: { distancia_km: number; tempo_min: number } | null;
  trecho_carga_ao_destino?: { distancia_km: number; tempo_min: number };
}
