import { useCallback, useState } from "react";
import { AxiosError } from "axios";
import http from "@/src/services/http";
import { useAuth } from "@/src/context/AuthContext";
import type { MapUser } from "@/src/interfaces/user";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";

export function useGetUser() {
	const { id } = useAuth();
	const { notify } = useAlertDefault();
	const [userData, setUserData] = useState<MapUser | null>(null);

	const handleGetUser = useCallback(async () => {
		try {
			const response = await http.get<MapUser>(`/user/${id}`);
			setUserData(response.data);
		} catch (error) {
			notify({
				status: "error",
				message: (error as AxiosError<{ message: string }>).response?.data?.message,
			});
		}
	}, [id, notify]);

	return {
		userData,
		handleGetUser,
	};
}
