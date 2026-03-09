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
