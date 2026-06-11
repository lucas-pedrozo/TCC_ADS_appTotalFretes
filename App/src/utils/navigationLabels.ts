const STREET_PREFIX_REPLACEMENTS: Array<[RegExp, string]> = [
	[/^Avenida\s+/i, "Av. "],
	[/^Rua\s+/i, "R. "],
	[/^Rodovia\s+/i, "Rod. "],
	[/^Travessa\s+/i, "Tv. "],
	[/^Alameda\s+/i, "Al. "],
	[/^Estrada\s+/i, "Est. "],
];

/**
 * Encurta o nome da rua para exibição no mapa (estilo Google Maps).
 */
export function formatStreetCalloutLabel(
	streetName?: string | null,
	instruction?: string | null,
): string | null {
	const trimmedStreet = streetName?.trim();
	if (trimmedStreet) {
		let label = trimmedStreet;
		for (const [pattern, replacement] of STREET_PREFIX_REPLACEMENTS) {
			label = label.replace(pattern, replacement);
		}
		return label;
	}

	const trimmedInstruction = instruction?.trim();
	if (!trimmedInstruction) return null;

	const ontoMatch = trimmedInstruction.match(/\b(?:em|na|no|para|onto)\s+(.+)$/i);
	if (ontoMatch?.[1]) {
		return formatStreetCalloutLabel(ontoMatch[1].trim(), null);
	}

	return null;
}
