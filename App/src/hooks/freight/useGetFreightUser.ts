import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { useAuth } from "@/src/context/AuthContext";
import http from "@/src/services/http";
import i18n from "@/src/i18n";

export interface FreightMap {
	id: number;
	company_id: number;
	cargoType_id: number;
	name: string;
	status_id: number;
	assignedDriver_id?: number | null;
	daysLimit?: number | null;
	originalValue?: number | null;
	finalValue?: number | null;
	weight?: number | null;
	createdAt?: string;
	updatedAt?: string;

	origin_label: string;
	origin_lat: number;
	origin_lng: number;

	destination_label: string;
	destination_lat: number;
	destination_lng: number;

	status: StatusFreightMap | null;
	cargo: CargoMap | null;
	proposals?: ProposalMap[];
}

export interface CargoMap {
	id: number;
	name: string;
	imageCargo_id?: number | null;
	vehicleType?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface StatusFreightMap {
	id: number;
	name: string;
}

export interface ProposalMap {
	id: number;
	freight_id: number;
	driver_id: number;
	status_id: number | null;
	value: number;
	createdAt?: string;
	updatedAt?: string;
}

export function useGetFreightUser() {
	const { id } = useAuth();
	const { notify } = useAlertDefault();
	const [isLoading, setIsLoading] = useState(false);
	const [freightUser, setFreightUser] = useState<FreightMap | null>(null);

	const handleGetFreightUser = useCallback(async () => {
		try {
			setIsLoading(true);

			if (!id) {
				notify({ status: "error", message: i18n.t("NOTIFICATIONS.USERNOTFOUND") });
				return;
			}

			const { data } = await http.get(`freight/user/${id}`);

			setFreightUser(data);
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
