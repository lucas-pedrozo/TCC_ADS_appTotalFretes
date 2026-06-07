import { useEffect } from "react";

import type { FreightMap } from "@/src/context/FreightUserContext";
import {
	publishDriverLocation,
	startFreightTelemetryWatch,
} from "@/src/services/telemetry";
import { getCurrentCoordinates } from "@/src/services/location";
import { isFreightInTransitStatus } from "@/src/utils/freightStatus";

type Params = {
	freightUser: FreightMap | null;
	isAuthenticated: boolean;
};

/**
 * Publica GPS enquanto o frete ativo estiver em trânsito ou em rota de entrega.
 * Não depende de abrir o mapa nem iniciar navegação.
 */
export function useFreightTelemetryPublisher({ freightUser, isAuthenticated }: Params) {
	const freightId = freightUser?.id;
	const statusName = freightUser?.status?.name;
	const shouldPublish =
		isAuthenticated === true &&
		freightId != null &&
		isFreightInTransitStatus(statusName);

	useEffect(() => {
		if (!shouldPublish || freightId == null) return;

		let cancelled = false;
		let watcher: { remove: () => void } | null = null;

		void (async () => {
			const coords = await getCurrentCoordinates();
			if (!cancelled && coords) {
				await publishDriverLocation({
					freightId,
					latitude: coords.latitude,
					longitude: coords.longitude,
				});
			}

			const w = await startFreightTelemetryWatch(freightId);
			if (!cancelled) watcher = w;
		})();

		return () => {
			cancelled = true;
			watcher?.remove();
		};
	}, [shouldPublish, freightId, statusName]);
}
