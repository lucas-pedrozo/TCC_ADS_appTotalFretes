import { useCallback, useState } from "react";

import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import http from "@/src/services/http";
import i18n from "@/src/i18n";
import { getApiErrorMessage } from "@/src/utils/apiError";
import { useFreightUserContext } from "@/src/context/FreightUserContext";

export function useConfirmProposal() {
	const { notify } = useAlertDefault();
	const { invalidateFreightUser } = useFreightUserContext();
	const [isLoading, setIsLoading] = useState(false);

	const handleConfirmProposal = useCallback(
		async (proposalId: number): Promise<boolean> => {
			try {
				setIsLoading(true);
				await notify({
					status: "loading",
					message: i18n.t("NOTIFICATIONS.CONFIRMPROPOSALLOADING"),
				});

				const { data } = await http.patch<{ message?: string }>(
					`proposal/${proposalId}/confirm-driver`,
					{},
				);

				await notify({
					status: "success",
					message: data.message ?? i18n.t("NOTIFICATIONS.CONFIRMPROPOSALSUCCESS"),
				});
				await invalidateFreightUser();
				return true;
			} catch (error) {
				await notify({
					status: "error",
					message: getApiErrorMessage(error),
				});
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[notify, invalidateFreightUser],
	);

	const handleDeclineProposal = useCallback(
		async (proposalId: number): Promise<boolean> => {
			try {
				setIsLoading(true);
				await notify({
					status: "loading",
					message: i18n.t("NOTIFICATIONS.DECLINEPROPOSALLOADING"),
				});

				const { data } = await http.patch<{ message?: string }>(
					`proposal/${proposalId}/decline-driver`,
					{},
				);

				await notify({
					status: "success",
					message: data.message ?? i18n.t("NOTIFICATIONS.DECLINEPROPOSALSUCCESS"),
				});
				return true;
			} catch (error) {
				await notify({
					status: "error",
					message: getApiErrorMessage(error),
				});
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[notify],
	);

	return {
		handleConfirmProposal,
		handleDeclineProposal,
		isLoading,
	};
}
