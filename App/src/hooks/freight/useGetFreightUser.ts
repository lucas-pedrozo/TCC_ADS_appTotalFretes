import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import http from "@/src/services/http";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { FreightUserMap } from "@/src/interfaces/freight";

export function useGetFreightUser() {
  const { notify } = useAlertDefault();
  const [freightUser, setFreightUser] = useState<FreightUserMap | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetFreightUser = useCallback(async (idUser: string) => {
    try {
      setIsLoading(true);
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
  };
}
