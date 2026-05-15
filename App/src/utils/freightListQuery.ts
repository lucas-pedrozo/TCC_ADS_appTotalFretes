import type { FreightAllMap } from "@/src/hooks/freight/useGetAllFreigth";
import type { Coordinates } from "@/src/services/location";
import type { FreightFilterState } from "@/src/types/freightFilter";
import { haversineMeters, type LngLat } from "@/src/utils/routeProgress";

export function freightEffectiveValue(f: FreightAllMap): number {
	const v = f.finalValue ?? f.originalValue;
	return Number.isFinite(v) && v != null ? v : 0;
}

function distanceToOriginM(f: FreightAllMap, user: Coordinates): number {
	return haversineMeters(
		[user.longitude, user.latitude] as LngLat,
		[f.origin_lng, f.origin_lat] as LngLat,
	);
}

/**
 * Busca textual + ordenação por distância (origem do frete) e/ou valor.
 */
export function filterAndSortFreights(
	items: FreightAllMap[],
	searchQuery: string,
	filters: FreightFilterState,
	user: Coordinates | null,
): FreightAllMap[] {
	const q = searchQuery.trim().toLowerCase();
	let list = q
		? items.filter((f) => {
				const haystack = `${f.name} ${f.origin_label} ${f.destination_label} ${f.cargo?.name ?? ""}`.toLowerCase();
				return haystack.includes(q);
			})
		: [...items];

	const byDistance = (a: FreightAllMap, b: FreightAllMap): number => {
		if (!user) return a.name.localeCompare(b.name, "pt-BR");
		const da = distanceToOriginM(a, user);
		const db = distanceToOriginM(b, user);
		return filters.order === "proximo" ? da - db : db - da;
	};

	const byPriceAsc = (a: FreightAllMap, b: FreightAllMap) => freightEffectiveValue(a) - freightEffectiveValue(b);
	const byPriceDesc = (a: FreightAllMap, b: FreightAllMap) => freightEffectiveValue(b) - freightEffectiveValue(a);

	list.sort((a, b) => {
		if (filters.value === "menores") {
			const p = byPriceAsc(a, b);
			if (p !== 0) return p;
			return byDistance(a, b);
		}
		if (filters.value === "maiores") {
			const p = byPriceDesc(a, b);
			if (p !== 0) return p;
			return byDistance(a, b);
		}
		return byDistance(a, b);
	});

	return list;
}
