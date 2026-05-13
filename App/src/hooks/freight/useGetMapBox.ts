import { useCallback, useRef, useState } from "react";
import http from "@/src/services/http";
import axios, { AxiosError } from "axios";
import { getCurrentCoordinates, type Coordinates } from "@/src/services/location";
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
  coordenadasOrigem: string | undefined,
  coordenadasMotorista: string | undefined,
): string => {
  if (coordenadasOrigem) {
    return `orig|${coordenadasOrigem}|${moradaDestino}`;
  }
  const m = coordenadasMotorista ?? "no-motorista";
  return `${moradaCarga}|${moradaDestino}|rs:${rotaSimples}|${m}`;
};

const ROTA_HTTP_TIMEOUT_MS = 30_000;

/** Evita enviar GPS lixo (ex.: 0,0 no simulador) que faz o Mapbox Directions responder 422. */
function isUsableGps(c: Coordinates): boolean {
	if (!Number.isFinite(c.latitude) || !Number.isFinite(c.longitude)) return false;
	if (Math.abs(c.latitude) > 90 || Math.abs(c.longitude) > 180) return false;
	if (Math.abs(c.latitude) < 1e-4 && Math.abs(c.longitude) < 1e-4) return false;
	return true;
}

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

    if (rotaSimples || coordenadasOrigem) {
      const earlyKey = routeCacheKey(
        moradaCarga,
        moradaDestino,
        rotaSimples,
        coordenadasOrigem,
        undefined,
      );
      const early = routeCache.get(earlyKey);
      if (early && early.expiresAt > Date.now()) {
        setRotaData(early.data);
        setRotaErro(null);
        return;
      }
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
        if (isUsableGps(coords)) {
          params.coordenadasMotorista = `${coords.longitude},${coords.latitude}`;
        }
      }
    }

    const key = routeCacheKey(
      moradaCarga,
      moradaDestino,
      rotaSimples,
      coordenadasOrigem,
      params.coordenadasMotorista,
    );
    const cached = routeCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      setRotaData(cached.data);
      setRotaErro(null);
      setLoadingRota(false);
      return;
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

      const err = error as AxiosError<{ error?: string; erro?: string; message?: string } | string>;
      const raw = err.response?.data;
      let msg = "Não foi possível carregar a rota.";
      if (typeof raw === "string" && raw.trim()) {
        msg = raw.trim();
      } else if (raw && typeof raw === "object") {
        const o = raw as { message?: string; error?: string; erro?: string };
        if (typeof o.message === "string" && o.message.trim()) msg = o.message.trim();
        else if (typeof o.error === "string" && o.error.trim()) msg = o.error.trim();
        else if (typeof o.erro === "string" && o.erro.trim()) msg = o.erro.trim();
      }
      if (msg === "Não foi possível carregar a rota." && err.message?.trim()) {
        msg = err.message.trim();
      }

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
