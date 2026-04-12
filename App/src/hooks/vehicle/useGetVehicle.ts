import { useCallback, useState } from "react";
import http from "@/src/services/http";
import { AxiosError } from "axios";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { MapVehicle } from "@/src/interfaces";



export function useGetVehicle() {
  const { notify } = useAlertDefault();
  const [vehicleData, setVehicleData] = useState<MapVehicle | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetVehicle = useCallback(async (id: number | null) => {
    if (id == null) {
      setVehicleData(null);
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await http.get<MapVehicle & { VehicleType?: MapVehicle["vehicleType"] }>(`vehicle/${id}`);
      setVehicleData({
        ...data,
        vehicleType: data.vehicleType ?? data.VehicleType ?? null,
      });

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
