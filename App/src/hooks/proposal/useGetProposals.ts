import { useCallback, useState } from "react";

import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { FreightAllMap } from "@/src/hooks/freight/useGetAllFreigth";
import http from "@/src/services/http";
import {
	DEFAULT_PROPOSAL_STATUS_FILTER,
	type ProposalStatusFilter,
} from "@/src/types/proposalFilter";
import { getApiErrorMessage } from "@/src/utils/apiError";
import {
	filterProposalsByStatus,
	resolveProposalStatusApiParam,
	sortProposalsByPriority,
} from "@/src/utils/proposalListQuery";

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

export function useGetProposals(
	statusFilter: ProposalStatusFilter = DEFAULT_PROPOSAL_STATUS_FILTER,
) {
	const { notify } = useAlertDefault();
	const [isLoading, setIsLoading] = useState(false);
	const [proposals, setProposals] = useState<ProposalMap[]>([]);

	const handleGetProposals = useCallback(async () => {
		try {
			setIsLoading(true);
			const { data } = await http.get<ProposalMap[]>("proposal", {
				params: { proposal_status: resolveProposalStatusApiParam(statusFilter) },
			});
			const proposalList = Array.isArray(data) ? data : [];
			const filteredProposals = filterProposalsByStatus(proposalList, statusFilter);

			const hydratedProposals = await Promise.all(
				filteredProposals.map(async (proposal) => {
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

			setProposals(sortProposalsByPriority(hydratedProposals));
		} catch (error) {
			notify({
				status: "error",
				message: getApiErrorMessage(error),
			});
		} finally {
			setIsLoading(false);
		}
	}, [notify, statusFilter]);

	return {
		proposals,
		isLoading,
		handleGetProposals,
	};
}

export { getProposalFreight };
