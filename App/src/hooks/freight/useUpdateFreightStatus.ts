import { AxiosError } from "axios";
import { useCallback, useState } from "react";

import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import http from "@/src/services/http";
import i18n from "@/src/i18n";

/**
 * Slugs (campo `name` no backend) que o motorista pode acionar.
 * Mantidos sincronizados com `freight-service/src/config/statusTypes.constants.ts`.
 */
export type DriverFreightStatusSlug =
	| "Em Transito"
	| "Em Rota de Entrega"
	| "Entregue";

interface FreightStatusType {
	id: number;
	name: string;
}

let statusTypesCache: FreightStatusType[] | null = null;

/** Busca a lista de status (uma vez por sessão) e resolve `slug → id`. */
async function resolveStatusIdBySlug(slug: DriverFreightStatusSlug): Promise<number | null> {
	if (!statusTypesCache) {
		const { data } = await http.get<FreightStatusType[]>("freight-status-type");
		statusTypesCache = Array.isArray(data) ? data : [];
	}
	const match = statusTypesCache.find((s) => s.name === slug);
	return match?.id ?? null;
}

export function useUpdateFreightStatus() {
	const { notify } = useAlertDefault();
	const [isLoading, setIsLoading] = useState(false);

	const handleUpdateFreightStatus = useCallback(
		async (freightId: number, nextSlug: DriverFreightStatusSlug): Promise<boolean> => {
			try {
				setIsLoading(true);

				await notify({
					status: "loading",
					message: i18n.t("NOTIFICATIONS.UPDATEFREIGHTSTATUSLOADING"),
				});

				const statusId = await resolveStatusIdBySlug(nextSlug);
				if (statusId == null) {
					await notify({
						status: "error",
						message: i18n.t("NOTIFICATIONS.UPDATEFREIGHTSTATUSFAILED"),
					});
					return false;
				}

				await http.put(`freight/${freightId}`, { status_id: statusId });

				await notify({
					status: "success",
					message: i18n.t("NOTIFICATIONS.UPDATEFREIGHTSTATUSSUCCESS"),
				});
				return true;
			} catch (error) {
				const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
				await notify({
					status: "error",
					message: message || i18n.t("NOTIFICATIONS.UPDATEFREIGHTSTATUSFAILED"),
				});
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[notify],
	);

	return {
		handleUpdateFreightStatus,
		isLoading,
	};
}
