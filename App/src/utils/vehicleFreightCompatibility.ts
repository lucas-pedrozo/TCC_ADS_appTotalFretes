import type { FreightAllMap } from "@/src/hooks/freight/useGetAllFreigth";
import type { MapVehicle } from "@/src/interfaces/vehicle";

/** Motorista atende o frete se capacityWeight do veículo >= peso da carga. */
export function isVehicleCompatibleWithFreight(
	vehicle: MapVehicle | null | undefined,
	freight: Pick<FreightAllMap, "weight">,
): boolean {
	if (!vehicle?.vehicleType?.id) return false;

	const freightWeight = Number(freight.weight ?? 0);
	if (freightWeight <= 0) return true;

	const driverCapacity = Number(vehicle.vehicleType.capacityWeight ?? 0);
	if (driverCapacity <= 0) return false;

	return driverCapacity >= freightWeight;
}
