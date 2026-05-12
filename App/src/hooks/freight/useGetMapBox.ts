import { useCallback, useRef, useState } from "react";
import http from "@/src/services/http";
import axios, { AxiosError } from "axios";
import { getCurrentCoordinates } from "@/src/services/location";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { MapRotaResponse } from "@/src/interfaces/mapbox";

const ROTA_CACHE_TTL_MS = 2 * 60 * 1000;
const routeCache = new Map<string, { data: MapRotaResponse; expiresAt: number }>();

export type GetMapBoxOptions = {
  rotaSimples?: boolean;
  /** Rota direta: lon,lat → destino (geocoding). Não envia moradaCarga ao backend. */
  coordenadasOrigem?: string;
};

const routeCacheKey = (
  moradaCarga: string,
  moradaDestino: string,
  rotaSimples: boolean,
  coordenadasOrigem?: string
): string => {
  if (coordenadasOrigem) {
    return `orig|${coordenadasOrigem}|${moradaDestino}`;
  }
  return `${moradaCarga}|${moradaDestino}|${rotaSimples}`;
};

const ROTA_HTTP_TIMEOUT_MS = 30_000;

export function useGetMapBox() {
  const { notify } = useAlertDefault();
  const [rotaData, setRotaData] = useState<MapRotaResponse | null>(null);
  const [loadingRota, setLoadingRota] = useState<boolean>(false);
  const [rotaErro, setRotaErro] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const clearRota = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setRotaData(null);
    setRotaErro(null);
  }, []);

  const handleGetMapBox = useCallback(async (
    moradaCarga: string,
    moradaDestino: string,
    options?: GetMapBoxOptions
  ) => {
    const rotaSimples = options?.rotaSimples === true;
    const coordenadasOrigem = options?.coordenadasOrigem?.trim();

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    const key = routeCacheKey(moradaCarga, moradaDestino, rotaSimples, coordenadasOrigem);
    const cached = routeCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      setRotaData(cached.data);
      setRotaErro(null);
      return;
    }

    setLoadingRota(true);
    setRotaErro(null);
    const params: Record<string, string> = {
      moradaDestino,
    };

    if (coordenadasOrigem) {
      params.coordenadasOrigem = coordenadasOrigem;
      // Compatível com backends que só aceitam moradaCarga + moradaDestino (geocoding aceita "lon,lat").
      if (!moradaCarga?.trim()) {
        params.moradaCarga = coordenadasOrigem;
      } else {
        params.moradaCarga = moradaCarga;
      }
    } else {
      params.moradaCarga = moradaCarga;
      if (!rotaSimples) {
        const coords = await getCurrentCoordinates();
        if (signal.aborted) {
          setLoadingRota(false);
          return;
        }
        if (!coords) {
          const m =
            "Permissão de localização negada. O aplicativo precisa do GPS para traçar a rota.";
          notify({
            status: "error",
            message: m,
          });
          setRotaErro(m);
          setLoadingRota(false);
          return;
        }
        params.coordenadasMotorista = `${coords.longitude},${coords.latitude}`;
      }
    }

    try {
      const response = await http.get<MapRotaResponse>(`mapbox/rota-frete`, {
        params,
        signal,
        timeout: ROTA_HTTP_TIMEOUT_MS,
      });
      if (signal.aborted) return;

      const data = response.data;
      setRotaData(data);
      setRotaErro(null);
      routeCache.set(key, {
        data,
        expiresAt: Date.now() + ROTA_CACHE_TTL_MS,
      });
    } catch (error) {
      if (signal.aborted) return;
      if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") return;

      const err = error as AxiosError<{ error?: string; erro?: string }>;
      let msg =
        err.response?.data?.error ??
        err.response?.data?.erro ??
        "Não foi possível carregar a rota.";

      if (err.code === "ECONNABORTED" || err.message?.toLowerCase().includes("timeout")) {
        msg = "Tempo esgotado ao buscar a rota. Verifique a conexão ou tente de novo.";
      } else if (err.code === "ERR_NETWORK" || !err.response) {
        msg = "Sem conexão com o servidor. Confira o Wi‑Fi/dados e se a API está acessível.";
      }

      setRotaErro(msg);
      notify({ status: "error", message: msg });
    } finally {
      if (!signal.aborted) {
        setLoadingRota(false);
      }
    }
  }, [notify]);

  return {
    rotaData,
    loadingRota,
    rotaErro,
    handleGetMapBox,
    clearRota,
  };
}
