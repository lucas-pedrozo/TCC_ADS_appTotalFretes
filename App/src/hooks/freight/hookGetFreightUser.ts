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

  const handleGetFreightUser = useCallback(async (idUser: string) => {
    try {

      const response = await http.get<FreightUserMap>(`/freight/${idUser}`);
      setFreightUser(response.data);
    } catch (error) {
      notify({
        status: "error",
        message: (error as AxiosError<{ message: string }>).response?.data.message ?? "Erro ao buscar fretes do usuário",
      });
    }
  }, [notify]);

  return {
    handleGetFreightUser,
    freightUser,
  }
}