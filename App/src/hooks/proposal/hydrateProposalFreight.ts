import type { FreightAllMap } from "@/src/hooks/freight/useGetAllFreigth";
import http from "@/src/services/http";
import type { ProposalMap } from "./useGetProposals";
import { getProposalFreight } from "./useGetProposals";

function needsFreightHydration(freight: FreightAllMap | null | undefined): boolean {
	if (!freight) return true;
	return freight.cargo == null || freight.Company == null;
}

export async function hydrateProposalFreight(proposal: ProposalMap): Promise<ProposalMap> {
	const currentFreight = getProposalFreight(proposal);
	if (!needsFreightHydration(currentFreight)) return proposal;

	try {
		const { data: freight } = await http.get<FreightAllMap>(`freight/${proposal.freight_id}`);
		return { ...proposal, Freight: freight };
	} catch {
		return proposal;
	}
}
