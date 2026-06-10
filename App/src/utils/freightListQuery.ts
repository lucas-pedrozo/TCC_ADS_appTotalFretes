import type { FreightAllMap } from "@/src/hooks/freight/useGetAllFreigth";
import type { Coordinates } from "@/src/services/location";
import type { FreightFilterState } from "@/src/types/freightFilter";
import type { MapVehicle } from "@/src/interfaces/vehicle";
import { isVehicleCompatibleWithFreight } from "@/src/utils/vehicleFreightCompatibility";
import * as turf from "@turf/turf";

export function freightEffectiveValue(f: FreightAllMap): number {
	const v = f.finalValue ?? f.originalValue;
	return Number.isFinite(v) && v != null ? v : 0;
}

function normalizeStatusName(name?: string | null): string {
	return (name ?? "")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim()
		.toLowerCase();
}

/** Apenas fretes com status "Disponivel" (abertos para proposta). */
export function isAvailableFreight(f: FreightAllMap): boolean {
	return normalizeStatusName(f.status?.name) === "disponivel";
}

function distanceToOriginM(f: FreightAllMap, user: Coordinates): number {
	return turf.distance(
		turf.point([user.longitude, user.latitude]),
		turf.point([f.origin_lng, f.origin_lat]),
		{ units: "meters" },
	);
}

/**
 * Busca textual + filtro por CNH + compatibilidade de veículo + ordenação.
 */
export function filterAndSortFreights(
	items: FreightAllMap[],
	searchQuery: string,
	filters: FreightFilterState,
	user: Coordinates | null,
	userCnhTypeId: number | null = null,
	driverVehicle: MapVehicle | null = null,
	requireVehicleFilter = false,
): FreightAllMap[] {
	const q = searchQuery.trim().toLowerCase();
	let list = items.filter(isAvailableFreight);

	list = q
		? list.filter((f) => {
				const haystack = `${f.name} ${f.origin_label} ${f.destination_label} ${f.cargo?.name ?? ""}`.toLowerCase();
				return haystack.includes(q);
			})
		: list;

	if (userCnhTypeId != null) {
		list = list.filter((f) => f.cnhType_id == null || f.cnhType_id <= userCnhTypeId);
	}

	if (requireVehicleFilter && driverVehicle?.vehicleType?.id == null) {
		return [];
	}

	if (driverVehicle?.vehicleType?.id != null) {
		list = list.filter((f) => isVehicleCompatibleWithFreight(driverVehicle, f));
	}

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
