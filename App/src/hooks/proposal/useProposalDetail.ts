import { useCallback, useState } from "react";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { getApiErrorMessage } from "@/src/utils/apiError";
import type { FreightAllMap } from "@/src/hooks/freight/useGetAllFreigth";
import http from "@/src/services/http";
import i18n from "@/src/i18n";
import type { ProposalMap } from "./useGetProposals";
import { getProposalFreight } from "./useGetProposals";

export function useProposalDetail() {
	const { notify } = useAlertDefault();
	const [isLoading, setIsLoading] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const [proposal, setProposal] = useState<ProposalMap | null>(null);

	const handleGetProposal = useCallback(
		async (proposalId: number) => {
			try {
				setIsLoading(true);
				const { data } = await http.get<ProposalMap>(`proposal/${proposalId}`);
				const currentFreight = getProposalFreight(data);

				if (currentFreight?.cargo != null) {
					setProposal(data);
					return data;
				}

				try {
					const { data: freight } = await http.get<FreightAllMap>(`freight/${data.freight_id}`);
					const hydratedProposal = { ...data, Freight: freight };
					setProposal(hydratedProposal);
					return hydratedProposal;
				} catch {
					setProposal(data);
					return data;
				}
			} catch (error) {
				notify({
					status: "error",
					message: getApiErrorMessage(error),
				});
				setProposal(null);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[notify],
	);

	const handleCancelProposal = useCallback(
		async (proposalId: number) => {
			try {
				setIsCancelling(true);
				const { data } = await http.delete<{ message?: string }>(`proposal/${proposalId}`);
				await notify({
					status: "success",
					message: data.message ?? i18n.t("NOTIFICATIONS.CANCELPROPOSALSUCCESS"),
				});
				return true;
			} catch (error) {
				await notify({
					status: "error",
					message: getApiErrorMessage(error),
				});
				return false;
			} finally {
				setIsCancelling(false);
			}
		},
		[notify],
	);

	return {
		proposal,
		isLoading,
		isCancelling,
		handleGetProposal,
		handleCancelProposal,
	};
}
