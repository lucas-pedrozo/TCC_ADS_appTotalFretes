import type { FreightAllMap } from "@/src/hooks/freight/useGetAllFreigth";
import type { MapVehicle } from "@/src/interfaces/vehicle";

/** Grupo exigido por tipo de carga (espelha seed do freight-service). */
const CARGO_VEHICLE_GROUP_BY_NAME: Record<string, string> = {
	Minerais: "Carreta",
	"Grãos": "Carreta",
	Adubo: "Caminhão",
	Líquido: "Bitrem",
};

function normalizeGroupName(value?: string | null): string {
	return (value ?? "")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim()
		.toLowerCase();
}

function resolveDriverGroupName(vehicle: MapVehicle | null | undefined): string | null {
	const fromNested = vehicle?.vehicleType?.GroupVehicleType?.nome;
	if (fromNested?.trim()) return fromNested.trim();

	const typeName = vehicle?.vehicleType?.nome ?? "";
	const prefix = typeName.split(" ")[0]?.trim();
	return prefix || null;
}

function resolveRequiredGroupFromCargo(
	cargo: FreightAllMap["cargo"] | null | undefined,
): string | null {
	const fromApi = cargo?.vehicleGroupNome?.trim();
	if (fromApi) return fromApi;

	const cargoName = cargo?.name?.trim();
	if (!cargoName) return null;

	const normalizedCargo = normalizeGroupName(cargoName);
	for (const [name, group] of Object.entries(CARGO_VEHICLE_GROUP_BY_NAME)) {
		if (normalizeGroupName(name) === normalizedCargo) {
			return group;
		}
	}

	return null;
}

/** Motorista atende o frete se o grupo do veículo coincide e capacityWeight >= peso da carga. */
export function isVehicleCompatibleWithFreight(
	vehicle: MapVehicle | null | undefined,
	freight: Pick<FreightAllMap, "weight" | "cargo">,
): boolean {
	if (!vehicle?.vehicleType?.id) return false;

	const freightWeight = Number(freight.weight ?? 0);
	const driverCapacity = Number(vehicle.vehicleType.capacityWeight ?? 0);
	if (freightWeight > 0 && driverCapacity < freightWeight) {
		return false;
	}

	const requiredGroup = resolveRequiredGroupFromCargo(freight.cargo);
	if (!requiredGroup) return true;

	const driverGroup = resolveDriverGroupName(vehicle);
	if (!driverGroup) return false;

	return normalizeGroupName(driverGroup) === normalizeGroupName(requiredGroup);
}
