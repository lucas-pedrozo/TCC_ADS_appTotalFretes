import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { FreightUserMap } from "@/src/interfaces/freight";
import { useAuth } from "@/src/context/AuthContext";

const USE_MOCK_FREIGHT =
	process.env.EXPO_PUBLIC_USE_MOCK_FREIGHT === "1" ||
	process.env.EXPO_PUBLIC_USE_MOCK_FREIGHT === "true";

/** Frete fictício para testar mapa: saída Juranda → Cascavel (geocoding no backend). */
function buildMockFreightUser(assignedDriverId: number): FreightUserMap {
	return {
		id: 999001,
		assigned_driver_id: assignedDriverId,
		origin_label: "Juranda, Paraná, Brasil",
		origin_lat: -24.4189,
		origin_lng: -52.5509,
		destination_label: "Cascavel, Paraná, Brasil",
		destination_lat: -24.955,
		destination_lng: -53.4552,
		time_limit: "7 dias",
		original_value: "1500.00",
		final_value: "1420.00",
		departure_date: new Date().toISOString(),
		arrival_date: new Date(Date.now() + 86400000 * 2).toISOString(),
		vehicle_group_id: 1,
		vehicle_group: { id: 1, name: "Caminhão (teste)" },
		company_id: 1,
		company: { name: "Empresa (teste)" },
		status_id: 1,
		status: { id: 1, name: "Em andamento" },
		cargo_type_id: 1,
		cargo: {
			id: 1,
			name: "Carga geral",
			weight: 12000,
			vehicle_type_id: 1,
			vehicle_type: { id: 1, name: "Truck" },
			image_id: 0,
			image: null,
		},
	};
}

export function useGetFreightUser() {
	const { id } = useAuth();
	const { notify } = useAlertDefault();
	const [isLoading, setIsLoading] = useState(false);
	const [freightUser, setFreightUser] = useState<FreightUserMap | null>(null);

	const handleGetFreightUser = useCallback(async () => {
		try {
			setIsLoading(true);
			if (USE_MOCK_FREIGHT) {
				setFreightUser(buildMockFreightUser(typeof id === "number" ? id : 1));
				return;
			}
			await new Promise((resolve) => setTimeout(resolve, 1200));
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
			if (message) {
				notify({ status: "error", message });
			}
		} finally {
			setIsLoading(false);
		}
	}, [id, notify]);

	return {
		freightUser,
		handleGetFreightUser,
		isLoading,
	};
}
