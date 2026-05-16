import { AxiosError } from "axios";
import { useCallback, useRef, useState } from "react";
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

export type FreightListPageResponse = {
	items: FreightAllMap[];
	total: number;
	page: number;
	limit: number;
	hasMore: boolean;
};

const PAGE_SIZE = 20;

function mergeUniqueById(prev: FreightAllMap[], incoming: FreightAllMap[]): FreightAllMap[] {
	const seen = new Set(prev.map((x) => x.id));
	const out = [...prev];
	for (const row of incoming) {
		if (!seen.has(row.id)) {
			seen.add(row.id);
			out.push(row);
		}
	}
	return out;
}

export function useGetAllFreigth() {
	const { notify } = useAlertDefault();
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [allFreigth, setAllFreigth] = useState<FreightAllMap[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [nextPage, setNextPage] = useState(1);
	const inFlightRef = useRef(false);

	const fetchPage = useCallback(
		async (page: number, mode: "replace" | "append") => {
			if (inFlightRef.current) return;
			inFlightRef.current = true;
			if (page === 1) setIsLoading(true);
			else setIsLoadingMore(true);
			try {
				const { data } = await http.get<FreightListPageResponse | FreightAllMap[]>("freight", {
					params: { page, limit: PAGE_SIZE },
				});

				if (Array.isArray(data)) {
					if (mode === "replace") setAllFreigth(data);
					else setAllFreigth((prev) => mergeUniqueById(prev, data));
					setHasMore(false);
					setNextPage(1);
					return;
				}

				setHasMore(data.hasMore);
				setNextPage(data.page + 1);
				if (mode === "replace") {
					setAllFreigth(data.items);
				} else {
					setAllFreigth((prev) => mergeUniqueById(prev, data.items));
				}
			} catch (error) {
				const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
				if (message) {
					notify({ status: "error", message });
				}
			} finally {
				inFlightRef.current = false;
				setIsLoading(false);
				setIsLoadingMore(false);
			}
		},
		[notify],
	);

	const handleGetAllFreigth = useCallback(async () => {
		setHasMore(true);
		await fetchPage(1, "replace");
	}, [fetchPage]);

	const loadMore = useCallback(async () => {
		if (!hasMore || isLoading || isLoadingMore) return;
		await fetchPage(nextPage, "append");
	}, [fetchPage, hasMore, isLoading, isLoadingMore, nextPage]);

	return {
		allFreigth,
		handleGetAllFreigth,
		loadMore,
		isLoading,
		isLoadingMore,
		hasMore,
	};
}
