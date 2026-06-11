import { useCallback, useRef, useState } from "react";

import { useAuth } from "@/src/context/AuthContext";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { FreightAllMap, FreightListPageResponse } from "@/src/hooks/freight/useGetAllFreigth";
import http from "@/src/services/http";
import type { FreightHistoryStatusFilter } from "@/src/types/freightHistoryFilter";
import { getApiErrorMessage } from "@/src/utils/apiError";

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

export function useGetFreightHistory(statusFilter: FreightHistoryStatusFilter) {
	const { id } = useAuth();
	const { notify } = useAlertDefault();
	const [items, setItems] = useState<FreightAllMap[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [nextPage, setNextPage] = useState(1);
	const inFlightRef = useRef(false);
	const statusFilterRef = useRef(statusFilter);
	statusFilterRef.current = statusFilter;

	const fetchPage = useCallback(
		async (page: number, mode: "replace" | "append", filter: FreightHistoryStatusFilter) => {
			if (id == null) return;
			if (inFlightRef.current) return;
			inFlightRef.current = true;

			try {
				if (page === 1) setIsLoading(true);
				else setIsLoadingMore(true);

				const { data } = await http.get<FreightListPageResponse>(`freight/user/${id}/history`, {
					params: { page, limit: PAGE_SIZE, status: filter },
				});

				if (filter !== statusFilterRef.current) return;

				setHasMore(data.hasMore);
				setNextPage(data.page + 1);

				if (mode === "replace") {
					setItems(data.items);
				} else {
					setItems((prev) => mergeUniqueById(prev, data.items));
				}
			} catch (error) {
				notify({
					status: "error",
					message: getApiErrorMessage(error),
				});
			} finally {
				inFlightRef.current = false;
				setIsLoading(false);
				setIsLoadingMore(false);
			}
		},
		[id, notify],
	);

	const handleGetFreightHistory = useCallback(async () => {
		setHasMore(true);
		await fetchPage(1, "replace", statusFilter);
	}, [fetchPage, statusFilter]);

	const loadMore = useCallback(async () => {
		if (!hasMore || isLoading || isLoadingMore) return;
		await fetchPage(nextPage, "append", statusFilter);
	}, [fetchPage, hasMore, isLoading, isLoadingMore, nextPage, statusFilter]);

	return {
		items,
		handleGetFreightHistory,
		loadMore,
		isLoading,
		isLoadingMore,
		hasMore,
	};
}
