import { useCallback, useState } from "react";
import http from "@/src/services/http";
import { AxiosError } from "axios";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { MapVehicle } from "@/src/interfaces/vehicle";

export function useGetVehicle() {
  const { notify } = useAlertDefault();
  const [vehicleData, setVehicleData] = useState<MapVehicle | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetVehicle = useCallback(async (vehicleId: number | null) => {
    try {
      setIsLoading(true);
      const response = await http.get(`/vehicle/${vehicleId}`);
      setVehicleData(response.data);
    } catch (error) {
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
