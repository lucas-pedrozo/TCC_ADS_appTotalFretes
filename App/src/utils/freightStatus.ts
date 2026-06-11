/** Normaliza nome de status do backend para comparação. */
export function normalizeFreightStatusName(value: string | null | undefined): string {
	return (value ?? "")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim()
		.toLowerCase();
}

const IN_TRANSIT_STATUS_KEYS = new Set(["em transito", "em rota de entrega"]);

const TELEMETRY_STATUS_KEYS = new Set([
	"vinculado",
	"em transito",
	"em rota de entrega",
]);

/** True quando o frete está em deslocamento operacional (sem incluir vinculado). */
export function isFreightInTransitStatus(statusName: string | null | undefined): boolean {
	const key = normalizeFreightStatusName(statusName);
	return IN_TRANSIT_STATUS_KEYS.has(key);
}

/** True quando o app deve transmitir GPS ao painel da empresa. */
export function isFreightTelemetryStatus(statusName: string | null | undefined): boolean {
	const key = normalizeFreightStatusName(statusName);
	return TELEMETRY_STATUS_KEYS.has(key);
}

const FINALIZED_STATUS_KEYS = new Set(["concluido", "cancelado"]);

/** True quando o frete já foi concluído ou cancelado (somente leitura no app). */
export function isFinalizedFreightStatus(statusName: string | null | undefined): boolean {
	const key = normalizeFreightStatusName(statusName);
	return FINALIZED_STATUS_KEYS.has(key);
}
