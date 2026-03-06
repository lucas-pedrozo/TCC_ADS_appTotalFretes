import { useCallback, useState } from "react";
import { AxiosError } from "axios";
import http from "@/src/service/http";
import { useAuth } from "@/src/context/AuthContext";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";

export function useHookDeleteUser() {
	const { id, logout } = useAuth();
	const { notify } = useAlertDefault();
	const [isdisabled, setIsdisabled] = useState(true);

	const handleDeleteUser = useCallback(async () => {
		try {
			await notify({
				status: "loading",
				message: "Deletando usuário...",
			}); 
			setIsdisabled(true);
			
			await http.delete(`/user/${id}`);

		} catch (error) {

			const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
			if (message) {
				await notify({ status: "error", message });
			}
		} finally {
			setIsdisabled(false);
		}
	}, [id, logout, notify]);

	return {
		handleDeleteUser,
		isdisabled,
	}
} 