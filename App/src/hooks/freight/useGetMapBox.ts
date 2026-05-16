import { useCallback, useRef, useState } from "react";
import http from "@/src/services/http";
import axios, { AxiosError } from "axios";
import { getCurrentCoordinates, type Coordinates } from "@/src/services/location";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { MapRotaResponse } from "@/src/interfaces/mapbox";

export type GetMapBoxOptions = {
  rotaSimples?: boolean;
  coordenadasOrigem?: string;
};

export type RecalculateFromDriverParams = {
  moradaDestino: string;
  coordsMotorista: Coordinates;
};

const ROTA_HTTP_TIMEOUT_MS = 30_000;

function isUsableGps(c: Coordinates): boolean {
  if (!Number.isFinite(c.latitude) || !Number.isFinite(c.longitude)) return false;
  if (Math.abs(c.latitude) > 90 || Math.abs(c.longitude) > 180) return false;
  if (Math.abs(c.latitude) < 1e-4 && Math.abs(c.longitude) < 1e-4) return false;
  return true;
}

function normalizeAddress(value: string): string {
  return value.trim().replace(/\s+/g, " ");
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

  const clearRota = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    lastRequestKeyRef.current = null;
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

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setLoadingRota(true);
    setRotaErro(null);
    const params: Record<string, string> = {
      moradaDestino: destinoNormalizado,
    };

    if (coordenadasOrigem) {
      params.coordenadasOrigem = coordenadasOrigem;
      // Compatível com backends que só aceitam moradaCarga + moradaDestino (geocoding aceita "lon,lat").
      if (!origemNormalizada) {
        params.moradaCarga = coordenadasOrigem;
      } else {
        params.moradaCarga = origemNormalizada;
      }
    } else {
      params.moradaCarga = origemNormalizada;
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

    const requestKey = [
      params.moradaCarga ?? "",
      params.moradaDestino ?? "",
      params.coordenadasOrigem ?? "",
      params.coordenadasMotorista ?? "",
      rotaSimples ? "simples" : "completa",
    ].join("|");
    if (requestKey === lastRequestKeyRef.current && rotaData) {
      setLoadingRota(false);
      return;
    }
    lastRequestKeyRef.current = requestKey;

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
    } catch (error) {
      if (signal.aborted) return;
      if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") return;

      const err = error as AxiosError<{ error?: string; erro?: string; message?: string } | string>;
      const msg = getRouteErrorMessage(err);

      setRotaErro(msg);
      lastRequestKeyRef.current = null;
      notify({ status: "error", message: msg });
    } finally {
      if (!signal.aborted) {
        setLoadingRota(false);
      }
    }
  }, [notify, rotaData]);

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
