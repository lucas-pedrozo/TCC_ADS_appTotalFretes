import { useCallback, useRef, useState } from "react";
import * as turf from "@turf/turf";
import http from "@/src/services/http";
import axios from "axios";
import { getCurrentCoordinates, type Coordinates } from "@/src/services/location";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { getApiErrorMessage } from "@/src/utils/apiError";
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

const GEOMETRY_MAX_POINTS = 8_000;
const SIMPLIFY_TOLERANCE = 0.000015;

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

const ROUTE_ERROR_FALLBACK = "Não foi possível carregar a rota.";

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
        const coords = await getCurrentCoordinates();
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

    setLoadingRota(true);
    setRotaErro(null);

    try {
      const response = await http.get<MapRotaResponse>(`mapbox/rota-frete`, {
        params,
        signal,
        timeout: ROTA_HTTP_TIMEOUT_MS,
      });
      if (signal.aborted) return;

      const simplified = simplifyGeometry(response.data);
      hasDataRef.current = true;
      setRotaData(simplified);
      setRotaErro(null);
    } catch (error) {
      if (signal.aborted) return;
      if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") return;

      const msg = getApiErrorMessage(error, ROUTE_ERROR_FALLBACK, {
        timeoutMessage:
          "Tempo esgotado ao buscar a rota. Verifique a conexão ou tente de novo.",
        networkMessage:
          "Sem conexão com o servidor. Confira o Wi‑Fi/dados e se a API está acessível.",
      });

      hasDataRef.current = false;
      lastRequestKeyRef.current = null;
      setRotaErro(msg);
      notify({ status: "error", message: msg });
    } finally {
      if (!signal.aborted) {
        setLoadingRota(false);
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
