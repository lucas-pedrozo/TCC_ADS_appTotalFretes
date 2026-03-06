import { useCallback, useRef, useState } from "react";
import http from "@/src/service/http";
import { AxiosError } from "axios";
import { getCurrentCoordinates } from "@/src/service/location";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";

export interface mapRotaResponse {
  distancia_total_km: number;
  tempo_total_min?: number;
  geometria: { coordinates?: [number, number][] };
  coords_carga?: [number, number];
  coords_destino?: [number, number];
  trecho_ate_carga?: { distancia_km: number; tempo_min: number } | null;
  trecho_carga_ao_destino?: { distancia_km: number; tempo_min: number };
}

const ROTA_CACHE_TTL_MS = 2 * 60 * 1000;
const routeCache = new Map<string, { data: mapRotaResponse; expiresAt: number }>();



const routeCacheKey = (moradaCarga: string, moradaDestino: string, rotaSimples: boolean): string => {
  return `${moradaCarga}|${moradaDestino}|${rotaSimples}`;
}

export function useHookGetMapBox() {
  const { notify } = useAlertDefault();
  const [rotaData, setRotaData] = useState<mapRotaResponse | null>(null);
  const [loadingRota, setLoadingRota] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleGetMapBox = useCallback(async (
    moradaCarga: string,
    moradaDestino: string,
    options?: { rotaSimples?: boolean }
  ) => {
    const rotaSimples = options?.rotaSimples === true;

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    const key = routeCacheKey(moradaCarga, moradaDestino, rotaSimples);
    const cached = routeCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      setRotaData(cached.data);
      return;
    }

    setLoadingRota(true);
    const params: Record<string, string> = {
      moradaCarga,
      moradaDestino,
    };

    if (!rotaSimples) {
      const coords = await getCurrentCoordinates();
      if (signal.aborted) return;
      if (!coords) {
        notify({
          status: "error",
          message:
            "Permissão de localização negada. O aplicativo precisa do GPS para traçar a rota.",
        });
        setLoadingRota(false);
        return;
      }
      params.coordenadasMotorista = `${coords.longitude},${coords.latitude}`;
    }

    try {
      const response = await http.get<mapRotaResponse>(`mapbox/rota-frete`, {
        params,
        signal,
      });
      if (signal.aborted) return;

      const data = response.data;
      setRotaData(data);
      routeCache.set(key, {
        data,
        expiresAt: Date.now() + ROTA_CACHE_TTL_MS,
      });
    } catch (error) {
      if (signal.aborted) return;
      const err = error as AxiosError<{ error?: string; erro?: string }>;
      const msg = err.response?.data?.error ?? err.response?.data?.erro ?? "Erro ao buscar a rota no servidor.";
      notify({ status: "error", message: msg });

    } finally {
      if (!signal.aborted) {
        setLoadingRota(false);
      }
    }
  },
    [notify]
  );

  return {
    rotaData,
    loadingRota,
    handleGetMapBox,
  };
}
