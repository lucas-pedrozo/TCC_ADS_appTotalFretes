import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";

import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { useAuth } from "@/src/context/AuthContext";
import http from "@/src/services/http";
import { useFreightTelemetryPublisher } from "@/src/hooks/freight/useFreightTelemetryPublisher";
import { getApiErrorMessage } from "@/src/utils/apiError";

export interface CompanyMap {
	id: number;
	name: string;
	city?: string | null;
}

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
	Company?: CompanyMap | null;
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

interface FreightUserContextType {
	freightUser: FreightMap | null;
	isLoading: boolean;
	handleGetFreightUser: () => Promise<void>;
	invalidateFreightUser: () => Promise<void>;
}

const FreightUserContext = createContext<FreightUserContextType | null>(null);

export function FreightUserProvider({ children }: { children: ReactNode }) {
	const { id, isAuthenticated } = useAuth();
	const { notify } = useAlertDefault();
	const [isLoading, setIsLoading] = useState(false);
	const [freightUser, setFreightUser] = useState<FreightMap | null>(null);

	const handleGetFreightUser = useCallback(async () => {
		if (!id) {
			setFreightUser(null);
			return;
		}

		try {
			setIsLoading(true);
			const { data } = await http.get<FreightMap>(`freight/user/${id}`);
			setFreightUser(data);
		} catch (error) {
			notify({
				status: "error",
				message: getApiErrorMessage(error),
			});
		} finally {
			setIsLoading(false);
		}
	}, [id, notify]);

	const invalidateFreightUser = useCallback(async () => {
		await handleGetFreightUser();
	}, [handleGetFreightUser]);

	useEffect(() => {
		if (isAuthenticated !== true) {
			setFreightUser(null);
			return;
		}
		if (id) {
			void handleGetFreightUser();
		}
	}, [isAuthenticated, id, handleGetFreightUser]);

	useFreightTelemetryPublisher({ freightUser, isAuthenticated: isAuthenticated === true });

	const value = useMemo(
		() => ({
			freightUser,
			isLoading,
			handleGetFreightUser,
			invalidateFreightUser,
		}),
		[freightUser, isLoading, handleGetFreightUser, invalidateFreightUser],
	);

	return (
		<FreightUserContext.Provider value={value}>{children}</FreightUserContext.Provider>
	);
}

export function useFreightUserContext() {
	const context = useContext(FreightUserContext);
	if (!context) {
		throw new Error("useFreightUserContext must be used within FreightUserProvider");
	}
	return context;
}
