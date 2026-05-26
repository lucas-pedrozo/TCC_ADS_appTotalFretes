import { useCallback, useState } from "react";
import { AxiosError } from "axios";
import http from "@/src/services/http";
import { useAuth } from "@/src/context/AuthContext";
import type { MapUser } from "@/src/interfaces";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import i18n from "@/src/i18n";

export function useGetUser() {
	const { id } = useAuth();
	const { notify } = useAlertDefault();
	const [userData, setUserData] = useState<MapUser | null>(null);

	const handleGetUser = useCallback(async () => {
		if (id == null) {
			notify({
				status: "error",
				message: i18n.t("NOTIFICATIONS.GETUSERFAILED"),
			});
			return;
		}

		try {
			const { data } = await http.get<MapUser>(`user/${id}`);
			setUserData(data);
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
