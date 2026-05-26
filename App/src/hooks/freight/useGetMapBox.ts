import { useCallback, useRef, useState } from "react";
import * as turf from "@turf/turf";
import http from "@/src/services/http";
import axios, { AxiosError } from "axios";
import { getCurrentCoordinates, type Coordinates } from "@/src/services/location";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { MapRotaResponse } from "@/src/interfaces/mapbox";

export type GetMapBoxOptions = {
  rotaSimples?: boolean;
  coordenadasOrigem?: string;
  coordenadasMotorista?: string;
};

export type RecalculateFromDriverParams = {
  moradaDestino: string;
  coordsMotorista: Coordinates;
};

const ROTA_HTTP_TIMEOUT_MS = 30_000;
const PERF_TAG = "[MapPerf]";

/** Geometria com mais de ~3 000 pontos é simplificada para manter performance. */
const GEOMETRY_MAX_POINTS = 3_000;
/** Tolerância Douglas-Peucker em graus (~5,5 m no equador). */
const SIMPLIFY_TOLERANCE = 0.00005;

function logRoutePerf(event: string, meta?: Record<string, unknown>) {
  if (!__DEV__) return;
  const payload = meta ? ` ${JSON.stringify(meta)}` : "";
  console.log(`${PERF_TAG} ${event}${payload}`);
}

function isUsableGps(c: Coordinates): boolean {
  if (!Number.isFinite(c.latitude) || !Number.isFinite(c.longitude)) return false;
  if (Math.abs(c.latitude) > 90 || Math.abs(c.longitude) > 180) return false;
  if (Math.abs(c.latitude) < 1e-4 && Math.abs(c.longitude) < 1e-4) return false;
  return true;
}

function normalizeAddress(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function simplifyGeometry(data: MapRotaResponse): MapRotaResponse {
  const coords = data.geometria?.coordinates;
  if (!Array.isArray(coords) || coords.length <= GEOMETRY_MAX_POINTS) return data;

  try {
    const line = turf.lineString(coords as [number, number][]);
    const simplified = turf.simplify(line, {
      tolerance: SIMPLIFY_TOLERANCE,
      highQuality: false,
      mutate: false,
    });
    logRoutePerf("route_geometry_simplified", {
      before: coords.length,
      after: simplified.geometry.coordinates.length,
    });
    return {
      ...data,
      geometria: {
        ...data.geometria,
        coordinates: simplified.geometry.coordinates as [number, number][],
      },
    };
  } catch {
    return data;
  }
}

function getRouteErrorMessage(
  err: AxiosError<{ error?: string; erro?: string; message?: string } | string>,
): string {
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
    return "Tempo esgotado ao buscar a rota. Verifique a conexão ou tente de novo.";
  }
  if (err.code === "ERR_NETWORK" || !err.response) {
    return "Sem conexão com o servidor. Confira o Wi‑Fi/dados e se a API está acessível.";
  }

  return msg;
}

export function useGetMapBox() {
  const { notify } = useAlertDefault();
  const [rotaData, setRotaData] = useState<MapRotaResponse | null>(null);
  const [loadingRota, setLoadingRota] = useState<boolean>(false);
  const [rotaErro, setRotaErro] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastRequestKeyRef = useRef<string | null>(null);
  const hasDataRef = useRef(false);

  const clearRota = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    lastRequestKeyRef.current = null;
    hasDataRef.current = false;
    setRotaData(null);
    setRotaErro(null);
    setLoadingRota(false);
  }, []);

  const handleGetMapBox = useCallback(async (
    moradaCarga: string,
    moradaDestino: string,
    options?: GetMapBoxOptions
  ) => {
    const startedAt = Date.now();
    const origemNormalizada = normalizeAddress(moradaCarga);
    const destinoNormalizado = normalizeAddress(moradaDestino);

    if (!destinoNormalizado) {
      const m = "Destino inválido para cálculo de rota.";
      setRotaErro(m);
      notify({ status: "error", message: m });
      return;
    }

    const rotaSimples = options?.rotaSimples === true;
    const coordenadasOrigem = options?.coordenadasOrigem?.trim();
    const coordenadasMotorista = options?.coordenadasMotorista?.trim();

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    const params: Record<string, string> = {
      moradaDestino: destinoNormalizado,
    };

    if (coordenadasOrigem) {
      params.coordenadasOrigem = coordenadasOrigem;
      if (!origemNormalizada) {
        params.moradaCarga = coordenadasOrigem;
      } else {
        params.moradaCarga = origemNormalizada;
      }
    } else {
      params.moradaCarga = origemNormalizada;
      if (coordenadasMotorista) {
        params.coordenadasMotorista = coordenadasMotorista;
      } else if (!rotaSimples) {
        const gpsStartedAt = Date.now();
        const coords = await getCurrentCoordinates();
        logRoutePerf("route_request_gps_lookup_done", {
          elapsedMs: Date.now() - gpsStartedAt,
          hasCoords: Boolean(coords),
        });
        if (signal.aborted) {
          setLoadingRota(false);
          return;
        }
        if (!coords) {
          const m =
            "Permissão de localização negada. O aplicativo precisa do GPS para traçar a rota.";
          notify({ status: "error", message: m });
          setRotaErro(m);
          setLoadingRota(false);
          return;
        }
        if (isUsableGps(coords)) {
          params.coordenadasMotorista = `${coords.longitude},${coords.latitude}`;
        }
      }
    }

    const requestKey = [
      params.moradaCarga ?? "",
      params.moradaDestino ?? "",
      params.coordenadasOrigem ?? "",
      params.coordenadasMotorista ?? "",
      rotaSimples ? "simples" : "completa",
    ].join("|");

    if (requestKey === lastRequestKeyRef.current && hasDataRef.current) {
      return;
    }
    lastRequestKeyRef.current = requestKey;

    logRoutePerf("route_request_start", {
      rotaSimples,
      hasCoordenadasOrigem: Boolean(coordenadasOrigem),
      hasCoordenadasMotorista: Boolean(coordenadasMotorista),
    });

    setLoadingRota(true);
    setRotaErro(null);

    try {
      const apiStartedAt = Date.now();
      const response = await http.get<MapRotaResponse>(`mapbox/rota-frete`, {
        params,
        signal,
        timeout: ROTA_HTTP_TIMEOUT_MS,
      });
      if (signal.aborted) return;
      logRoutePerf("route_request_api_done", {
        elapsedMs: Date.now() - apiStartedAt,
        rawPoints: response.data?.geometria?.coordinates?.length ?? 0,
      });

      const simplified = simplifyGeometry(response.data);
      hasDataRef.current = true;
      setRotaData(simplified);
      setRotaErro(null);
    } catch (error) {
      if (signal.aborted) return;
      if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") return;

      const err = error as AxiosError<{ error?: string; erro?: string; message?: string } | string>;
      const msg = getRouteErrorMessage(err);

      hasDataRef.current = false;
      lastRequestKeyRef.current = null;
      setRotaErro(msg);
      notify({ status: "error", message: msg });
    } finally {
      if (!signal.aborted) {
        setLoadingRota(false);
        logRoutePerf("route_request_total_done", {
          elapsedMs: Date.now() - startedAt,
        });
      }
    }
  }, [notify]);

  const recalculateFromDriverLocation = useCallback(
    async ({ moradaDestino, coordsMotorista }: RecalculateFromDriverParams) => {
      if (!isUsableGps(coordsMotorista)) {
        const m = "Localização atual inválida para recalcular a rota.";
        setRotaErro(m);
        notify({ status: "error", message: m });
        return;
      }
      await handleGetMapBox("", moradaDestino, {
        coordenadasOrigem: `${coordsMotorista.longitude},${coordsMotorista.latitude}`,
        rotaSimples: false,
      });
    },
    [handleGetMapBox, notify],
  );

  return {
    rotaData,
    loadingRota,
    rotaErro,
    handleGetMapBox,
    recalculateFromDriverLocation,
    clearRota,
  };
}
