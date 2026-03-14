import { useCallback, useState } from "react";
import http from "@/src/services/http";
import { AxiosError } from "axios";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { MapVehicle } from "@/src/interfaces/vehicle";

type VehicleApiResponse = {
  id: number;
  plateNumber: string;
  model?: string | null;
  mark?: string | null;
  VehicleType?: {
    id: number;
    nome: string;
    axes?: number;
    weight?: number;
    length?: number;
  } | null;
};

function mapVehicleResponseToMapVehicle(data: VehicleApiResponse): MapVehicle {
  const type = data.VehicleType;
  return {
    id: data.id,
    plate: data.plateNumber ?? "",
    model: data.model ?? type?.nome ?? "–",
    mark: data.mark ?? "–",
    axle: type?.axes ?? 0,
    weight: type?.weight ?? 0,
    size: type?.length != null ? String(type.length) : "–",
  };
}

export function useGetVehicle() {
  const { notify } = useAlertDefault();
  const [vehicleData, setVehicleData] = useState<MapVehicle | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetVehicle = useCallback(async (vehicleId: number | null) => {
    if (vehicleId == null) {
      setVehicleData(null);
      return;
    }
    try {
      setIsLoading(true);
      const response = await http.get<VehicleApiResponse>(`/vehicle/${vehicleId}`);
      setVehicleData(mapVehicleResponseToMapVehicle(response.data));
    } catch (error) {
      setVehicleData(null);
      const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
      if (message) {
        notify({
          status: "alert",
          message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  return {
    handleGetVehicle,
    vehicleData,
    isLoading,
  };
}
