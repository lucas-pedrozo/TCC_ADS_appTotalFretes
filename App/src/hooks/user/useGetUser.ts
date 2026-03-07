import { useCallback, useState } from "react";
import http from "@/src/services/http";
import { AxiosError } from "axios";
import { useAuth } from "@/src/context/AuthContext";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { MapUser } from "@/src/interfaces/user";

export function useGetUser() {
	const { id } = useAuth();
	const { notify } = useAlertDefault();
	const [userData, setUserData] = useState<MapUser | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleGetUser = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await http.get<MapUser>(`/user/${id}`);
			setUserData(response.data);
		} catch (error) {
			notify({
				status: "error",
				message: (error as AxiosError<{ message: string }>).response?.data?.message,
			});
		} finally {
			setIsLoading(false);
		}
	}, [id, notify]);

	return {
		userData,
		isLoading,
		handleGetUser,
	};
}
