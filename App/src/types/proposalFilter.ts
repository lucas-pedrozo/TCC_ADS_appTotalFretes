export type ProposalStatusFilter =
	| "em_andamento"
	| "enviada"
	| "esperando_caminhoneiro"
	| "aceita"
	| "recusada"
	| "nao_selecionada"
	| "todas";

export const DEFAULT_PROPOSAL_STATUS_FILTER: ProposalStatusFilter = "em_andamento";

export const PROPOSAL_STATUS_FILTER_OPTIONS: ProposalStatusFilter[] = [
	"em_andamento",
	"enviada",
	"esperando_caminhoneiro",
	"aceita",
	"recusada",
	"nao_selecionada",
	"todas",
];
