export function normalizePhoneDigits(value?: string | null): string {
	return (value ?? "").replace(/\D/g, "");
}

export function formatPhoneDisplay(value?: string | null): string {
	const digits = normalizePhoneDigits(value);
	if (!digits) return "";

	if (digits.length === 13 && digits.startsWith("55")) {
		return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
	}

	if (digits.length === 11) {
		return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
	}

	if (digits.length === 10) {
		return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
	}

	return value?.trim() ?? digits;
}

export function buildTelUrl(value?: string | null): string | null {
	const digits = normalizePhoneDigits(value);
	if (!digits) return null;
	return `tel:+${digits}`;
}
