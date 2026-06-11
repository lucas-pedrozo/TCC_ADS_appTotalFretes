export type FreightHistoryStatusFilter = "concluido" | "cancelado" | "todos";

export const DEFAULT_FREIGHT_HISTORY_STATUS_FILTER: FreightHistoryStatusFilter = "todos";

export const FREIGHT_HISTORY_STATUS_FILTER_OPTIONS: FreightHistoryStatusFilter[] = [
	"concluido",
	"cancelado",
	DEFAULT_FREIGHT_HISTORY_STATUS_FILTER,
];
