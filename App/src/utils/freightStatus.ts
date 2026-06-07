/** Normaliza nome de status do backend para comparação. */
export function normalizeFreightStatusName(value: string | null | undefined): string {
	return (value ?? "")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim()
		.toLowerCase();
}

const IN_TRANSIT_STATUS_KEYS = new Set(["em transito", "em rota de entrega"]);

/** True quando o motorista deve transmitir GPS ao painel da empresa. */
export function isFreightInTransitStatus(statusName: string | null | undefined): boolean {
	const key = normalizeFreightStatusName(statusName);
	return IN_TRANSIT_STATUS_KEYS.has(key);
}
