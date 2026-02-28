import { useCallback, useState } from "react";
import http from "@/src/service/http";
import { AxiosError } from "axios";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";

interface mapVehicle {
  id: number;
  model: string;
  brand: string;
  size: string;
  plate: string;
  axle: number;
  weight: number;
}

export function useHookGetVehicle() {
  const { notify } = useAlertDefault();
  const [vehicleData, setVehicleData] = useState<mapVehicle | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetVehicle = useCallback(async (vehicleId: number | null) => {
    try {
      setIsLoading(true);
      const response = await http.get(`/vehicle/${vehicleId}`);
      setVehicleData(response.data);

    } catch (error) {
      notify({
        status: "alert",
        message: (error as AxiosError<{ message: string }>).response?.data.message || "Erro ao obter dados do veículo",
      });
    } finally {
      setIsLoading(false);
    }
  }, [notify])

  return {
    handleGetVehicle,
    vehicleData,
    isLoading,
  };
}