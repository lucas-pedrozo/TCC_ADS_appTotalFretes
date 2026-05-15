import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import http from "@/src/services/http";


export interface FreightAllMap {
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

interface CargoMap {
	id: number;
	name: string;
	imageCargo_id?: number | null;
	vehicleType?: string;
	createdAt?: string;
	updatedAt?: string;
}

interface StatusFreightMap {
	id: number;
	name: string;
}

interface ProposalMap {
	id: number;
	freight_id: number;
	driver_id: number;
	status_id: number | null;
	value: number;
	createdAt?: string;
	updatedAt?: string;
}

export function useGetAllFreigth() {
	const { notify } = useAlertDefault();
	const [isLoading, setIsLoading] = useState(false);
	const [allFreigth, setAllFreigth] = useState<FreightAllMap[]>([]);

	const handleGetAllFreigth = useCallback(async () => {
		try {
			setIsLoading(true);

			const { data } = await http.get<FreightAllMap[]>(`freight`);

			setAllFreigth(data);
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
			if (message) {
				notify({ status: "error", message });
			}
		} finally {
			setIsLoading(false);
		}
	}, [notify]);

	return {
		allFreigth,
		handleGetAllFreigth,
		isLoading,
	};
}
