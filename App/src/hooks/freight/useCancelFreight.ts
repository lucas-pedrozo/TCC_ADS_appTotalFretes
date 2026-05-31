import { useCallback, useState } from "react";
import i18n from "@/src/i18n";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import http from "@/src/services/http";
import { getApiErrorMessage } from "@/src/utils/apiError";
import { useFreightUserContext } from "@/src/context/FreightUserContext";

export function useCancelFreight() {
	const { notify } = useAlertDefault();
	const { invalidateFreightUser } = useFreightUserContext();
	const [isLoading, setIsLoading] = useState(false);

	const handleCancelFreight = useCallback(
		async (freightId: number) => {
			try {
				setIsLoading(true);

				await notify({
					status: "loading",
					message: i18n.t("NOTIFICATIONS.CANCELFREIGHTLOADING"),
				});

				await http.patch(`freight/${freightId}/cancel`);

				await notify({
					status: "success",
					message: i18n.t("NOTIFICATIONS.CANCELFREIGHTSUCCESS"),
				});
				await invalidateFreightUser();
			} catch (error) {
				await notify({
					status: "error",
					message: getApiErrorMessage(error, i18n.t("NOTIFICATIONS.ERROR")),
				});
			} finally {
				setIsLoading(false);
			}
		},
		[notify, invalidateFreightUser],
	);

	return {
		handleCancelFreight,
		isLoading,
	};
}
