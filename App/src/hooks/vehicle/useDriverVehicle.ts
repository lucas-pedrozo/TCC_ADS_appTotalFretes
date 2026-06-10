import { useCallback, useEffect, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";

import type { MapVehicle } from "@/src/interfaces/vehicle";
import { useGetUser } from "@/src/hooks/user/useGetUser";
import { useGetVehicle } from "@/src/hooks/vehicle/useGetVehicle";

function normalizeVehicle(raw: MapVehicle & { VehicleType?: MapVehicle["vehicleType"] }): MapVehicle {
	return {
		...raw,
		vehicleType: raw.vehicleType ?? raw.VehicleType ?? null,
	};
}

export function useDriverVehicle() {
	const { userData, handleGetUser } = useGetUser();
	const { vehicleData, handleGetVehicle, isLoading: isLoadingVehicle } = useGetVehicle();

	const vehicleId = userData?.vehicle_id ?? null;

	const refresh = useCallback(async () => {
		const user = await handleGetUser();
		await handleGetVehicle(user?.vehicle_id ?? null);
	}, [handleGetUser, handleGetVehicle]);

	useFocusEffect(
		useCallback(() => {
			void refresh();
		}, [refresh]),
	);

	useEffect(() => {
		if (vehicleId == null) {
			void handleGetVehicle(null);
			return;
		}
		void handleGetVehicle(vehicleId);
	}, [handleGetVehicle, vehicleId]);

	const driverVehicle = useMemo((): MapVehicle | null => {
		if (vehicleData?.vehicleType?.id != null) {
			return normalizeVehicle(vehicleData as MapVehicle & { VehicleType?: MapVehicle["vehicleType"] });
		}
		if (userData?.Vehicle) {
			return normalizeVehicle(userData.Vehicle as MapVehicle & { VehicleType?: MapVehicle["vehicleType"] });
		}
		return null;
	}, [userData?.Vehicle, vehicleData]);

	const hasRegisteredVehicle = vehicleId != null;
	const isVehicleFilterReady =
		!hasRegisteredVehicle || driverVehicle?.vehicleType?.id != null;

	return {
		userData,
		driverVehicle,
		hasRegisteredVehicle,
		isVehicleFilterReady,
		isLoadingVehicle,
		refresh,
	};
}
