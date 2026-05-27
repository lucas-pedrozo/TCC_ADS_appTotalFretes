import { AxiosError } from "axios";
import { useCallback, useState } from "react";

import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import http from "@/src/services/http";
import i18n from "@/src/i18n";

export function useConfirmProposal() {
	const { notify } = useAlertDefault();
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
				return true;
			} catch (error) {
				const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
				await notify({
					status: "error",
					message: message || i18n.t("NOTIFICATIONS.ERROR"),
				});
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[notify],
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
				const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
				await notify({
					status: "error",
					message: message || i18n.t("NOTIFICATIONS.ERROR"),
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
