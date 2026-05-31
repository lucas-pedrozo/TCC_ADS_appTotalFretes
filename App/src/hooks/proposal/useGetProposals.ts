import { useCallback, useState } from "react";

import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { FreightAllMap } from "@/src/hooks/freight/useGetAllFreigth";
import http from "@/src/services/http";
import i18n from "@/src/i18n";
import { getApiErrorMessage } from "@/src/utils/apiError";

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

export function useGetProposals() {
	const { notify } = useAlertDefault();
	const [isLoading, setIsLoading] = useState(false);
	const [proposals, setProposals] = useState<ProposalMap[]>([]);

	const handleGetProposals = useCallback(async () => {
		try {
			setIsLoading(true);
			const { data } = await http.get<ProposalMap[]>("proposal", {
				params: { proposal_status: "todas" },
			});
			const proposalList = Array.isArray(data) ? data : [];

			const normalizeStatus = (name?: string | null) =>
				(name ?? "")
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
					.trim()
					.toLowerCase();

			const activeProposals = proposalList.filter((proposal) => {
				const status = normalizeStatus(proposal.ProposalStatusType?.name);
				if (status.includes("cancel")) return false;
				return status === "enviada" || status === "esperando caminhoneiro";
			});

			const hydratedProposals = await Promise.all(
				activeProposals.map(async (proposal) => {
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

			const sortPriority = (name?: string | null) => {
				const s = normalizeStatus(name);
				if (s === "esperando caminhoneiro") return 0;
				if (s === "enviada") return 1;
				return 2;
			};

			hydratedProposals.sort(
				(a, b) =>
					sortPriority(a.ProposalStatusType?.name) - sortPriority(b.ProposalStatusType?.name),
			);

			setProposals(hydratedProposals);
		} catch (error) {
			notify({
				status: "error",
				message: getApiErrorMessage(error),
			});
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
