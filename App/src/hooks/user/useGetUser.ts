import { useCallback, useState } from "react";
import http from "@/src/services/http";
import { useAuth } from "@/src/context/AuthContext";
import type { MapUser } from "@/src/interfaces";
import type { MapVehicle } from "@/src/interfaces/vehicle";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import i18n from "@/src/i18n";
import { getApiErrorMessage } from "@/src/utils/apiError";

export function useGetUser() {
	const { id } = useAuth();
	const { notify } = useAlertDefault();
	const [userData, setUserData] = useState<MapUser | null>(null);

	const handleGetUser = useCallback(async (): Promise<MapUser | null> => {
		if (id == null) {
			notify({
				status: "error",
				message: i18n.t("NOTIFICATIONS.GETUSERFAILED"),
			});
			return null;
		}

		try {
			const { data } = await http.get<MapUser & { Vehicle?: MapVehicle & { VehicleType?: MapVehicle["vehicleType"] } }>(`user/${id}`);
			const vehicle = data.Vehicle
				? {
						...data.Vehicle,
						vehicleType: data.Vehicle.vehicleType ?? data.Vehicle.VehicleType ?? null,
					}
				: null;
			const normalized = { ...data, Vehicle: vehicle };
			setUserData(normalized);
			return normalized;
		} catch (error) {
			notify({
				status: "error",
				message: getApiErrorMessage(error, i18n.t("NOTIFICATIONS.GETUSERFAILED")),
			});
			return null;
		}
	}, [id, notify]);

	return {
		userData,
		handleGetUser,
	};
}
