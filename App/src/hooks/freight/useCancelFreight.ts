import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import i18n from "@/src/i18n";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import http from "@/src/services/http";

export function useCancelFreight() {
	const { notify } = useAlertDefault();
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
			} catch (error) {
				const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
				if (message) {
					await notify({ status: "error", message });
				}
			} finally {
				setIsLoading(false);
			}
		},
		[notify],
	);

	return {
		handleCancelFreight,
		isLoading,
	};
}
