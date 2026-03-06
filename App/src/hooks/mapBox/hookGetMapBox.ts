import { useCallback, useState } from "react";
import http from "@/src/service/http";
import { AxiosError } from "axios";
import { getCurrentCoordinates } from "@/src/service/location";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";

// Tipagem exata do que o nosso backend Node.js (Mapbox) vai devolver
export interface mapRotaResponse {
  distancia_total_km: number;
  tempo_total_min?: number;
  geometria: { coordinates?: [number, number][] };
  coords_carga?: [number, number];
  coords_destino?: [number, number];
  trecho_ate_carga?: { distancia_km: number; tempo_min: number } | null;
  trecho_carga_ao_destino?: { distancia_km: number; tempo_min: number };
}

export function useHookGetMapBox() {
  const { notify } = useAlertDefault();
  const [rotaData, setRotaData] = useState<mapRotaResponse | null>(null);
  const [loadingRota, setLoadingRota] = useState<boolean>(false);

  const handleGetMapBox = useCallback(
    async (
      moradaCarga: string,
      moradaDestino: string,
      options?: { rotaSimples?: boolean }
    ) => {
      try {
        setLoadingRota(true);

        const rotaSimples = options?.rotaSimples === true;
        const params: Record<string, string> = {
          moradaCarga,
          moradaDestino,
        };

        const coords = await getCurrentCoordinates();
        if (!coords) {
          notify({
            status: "error",
            message:
              "Permissão de localização negada. O aplicativo precisa do GPS para traçar a rota.",
          });
          return;
        }
        params.coordenadasMotorista = `${coords.longitude},${coords.latitude}`;

        const response = await http.get<mapRotaResponse>(`mapbox/rota-frete`, {
          params,
        });

        setRotaData(response.data);
      } catch (error) {
        console.log(error);
        const err = error as AxiosError<{ error?: string; erro?: string }>;
        const msg =
          err.response?.data?.error ??
          err.response?.data?.erro ??
          "Erro ao buscar a rota no servidor.";
        notify({ status: "error", message: msg });
      } finally {
        setLoadingRota(false);
      }
    },
    [notify]
  );

  return {
    rotaData,
    loadingRota,
    handleGetMapBox
  };
}