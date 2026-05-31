import { useCallback, useState } from "react";
import http from "@/src/services/http";
import { useAuth } from "@/src/context/AuthContext";
import type { MapUser } from "@/src/interfaces";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import i18n from "@/src/i18n";
import { getApiErrorMessage } from "@/src/utils/apiError";

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
				message: getApiErrorMessage(error, i18n.t("NOTIFICATIONS.GETUSERFAILED")),
			});
		}
	}, [id, notify]);

	return {
		userData,
		handleGetUser,
	};
}
