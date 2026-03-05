import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import http from "@/src/service/http";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";


interface FreightUserMap {
  id: number;
  title: string;
  description: string;
  cargo_type_id: number;
  vehicleType_id: number;

  origin_label: string;
  origin_lat: number;
  origin_lng: number;
  destination_label: string;
  destination_lat: number;
  destination_lng: number;

  time_limit: string;
  status: string;
}

export function useHookGetFreightUser() {
  const { notify } = useAlertDefault();
  const [freightUser, setFreightUser] = useState<FreightUserMap | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetFreightUser = useCallback(async (idUser: string) => {
    try {
      setIsLoading(true);
      // const response = await http.get<FreightUserMap>(`/freight/${idUser}`);
      await new Promise(resolve => setTimeout(resolve, 1200));
    } catch (error) {
      const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
      if (message) {
        notify({ status: "error", message });
      }
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  return {
    handleGetFreightUser,
    freightUser,
    isLoading,
  }
}