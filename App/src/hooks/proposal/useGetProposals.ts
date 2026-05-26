import { useCallback, useState } from "react";
import { AxiosError } from "axios";

import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { FreightAllMap } from "@/src/hooks/freight/useGetAllFreigth";
import http from "@/src/services/http";

export type ProposalMap = {
	id: number;
	freight_id: number;
	driver_id: number;
	status_id: number | null;
	value: number;
	createdAt?: string;
	updatedAt?: string;
	ProposalStatusType?: {
		id: number;
		name: string;
	} | null;
	Freight?: FreightAllMap | null;
	freight?: FreightAllMap | null;
};

const getProposalFreight = (proposal: ProposalMap) => proposal.Freight ?? proposal.freight ?? null;
const isSentProposal = (proposal: ProposalMap) => proposal.ProposalStatusType?.name?.toLowerCase() === "enviada";

export function useGetProposals() {
	const { notify } = useAlertDefault();
	const [isLoading, setIsLoading] = useState(false);
	const [proposals, setProposals] = useState<ProposalMap[]>([]);

	const handleGetProposals = useCallback(async () => {
		try {
			setIsLoading(true);
			const { data } = await http.get<ProposalMap[]>("proposal", {
				params: { proposal_status: "enviada" },
			});
			const proposalList = Array.isArray(data) ? data : [];
			const sentProposals = proposalList.filter(isSentProposal);

			const hydratedProposals = await Promise.all(
				sentProposals.map(async (proposal) => {
					const currentFreight = getProposalFreight(proposal);
					if (currentFreight?.cargo != null) return proposal;

					try {
						const { data: freight } = await http.get<FreightAllMap>(`freight/${proposal.freight_id}`);
						return { ...proposal, Freight: freight };
					} catch {
						return proposal;
					}
				}),
			);

			setProposals(hydratedProposals);
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
			if (message) {
				notify({ status: "error", message });
			}
		} finally {
			setIsLoading(false);
		}
	}, [notify]);

	return {
		proposals,
		isLoading,
		handleGetProposals,
	};
}

export { getProposalFreight };
