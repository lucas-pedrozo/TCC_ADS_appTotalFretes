import type { ProposalMap } from "@/src/hooks/proposal/useGetProposals";
import type { ProposalStatusFilter } from "@/src/types/proposalFilter";

function normalizeProposalStatus(name?: string | null): string {
	return (name ?? "")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim()
		.toLowerCase();
}

export function resolveProposalStatusApiParam(
	filter: ProposalStatusFilter,
): "enviada" | "esperando_caminhoneiro" | "aceita" | "recusada" | "nao_selecionada" | "todas" {
	if (filter === "em_andamento") return "todas";
	return filter;
}

export function filterProposalsByStatus(
	proposals: ProposalMap[],
	filter: ProposalStatusFilter,
): ProposalMap[] {
	return proposals.filter((proposal) => {
		const status = normalizeProposalStatus(proposal.ProposalStatusType?.name);
		if (status.includes("cancel")) return false;

		switch (filter) {
			case "em_andamento":
				return status === "enviada" || status === "esperando caminhoneiro";
			case "enviada":
				return status === "enviada";
			case "esperando_caminhoneiro":
				return status === "esperando caminhoneiro";
			case "aceita":
				return status === "aceita" || status === "esperando caminhoneiro";
			case "recusada":
				return status === "recusada";
			case "nao_selecionada":
				return status === "nao selecionada";
			case "todas":
			default:
				return true;
		}
	});
}

export function sortProposalsByPriority(proposals: ProposalMap[]): ProposalMap[] {
	const sortPriority = (name?: string | null) => {
		const status = normalizeProposalStatus(name);
		if (status === "esperando caminhoneiro") return 0;
		if (status === "enviada") return 1;
		return 2;
	};

	return [...proposals].sort(
		(left, right) =>
			sortPriority(left.ProposalStatusType?.name) - sortPriority(right.ProposalStatusType?.name),
	);
}
