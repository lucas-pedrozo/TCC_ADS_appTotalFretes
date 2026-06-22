import { isAxiosError, type AxiosError } from "axios";
import i18n from "@/src/i18n";
import { parseApiFieldErrors } from "@/src/utils/apiFieldErrors";

type ApiErrorBody = {
	message?: string;
	error?: string;
	erro?: string;
};

type ApiErrorOptions = {
	timeoutMessage?: string;
	networkMessage?: string;
};

const DEFAULT_TIMEOUT_MESSAGE =
	"Tempo esgotado. Verifique a conexão e tente novamente.";
const DEFAULT_NETWORK_MESSAGE =
	"Sem conexão com o servidor. Verifique sua internet e tente novamente.";

const RESPONSE_MESSAGE_KEYS = ["message", "error", "erro"] as const;

function trimMessage(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
}

function extractResponseMessage(data: unknown): string | undefined {
	const direct = trimMessage(data);
	if (direct) return direct;

	if (!data || typeof data !== "object") return undefined;

	const body = data as ApiErrorBody;
	for (const key of RESPONSE_MESSAGE_KEYS) {
		const message = trimMessage(body[key]);
		if (message) return message;
	}

	return undefined;
}

function isTimeoutError(error: AxiosError): boolean {
	return (
		error.code === "ECONNABORTED" ||
		error.message.toLowerCase().includes("timeout")
	);
}

function isNetworkError(error: AxiosError): boolean {
	return error.code === "ERR_NETWORK" || error.response == null;
}

export function getApiErrorMessage(
	error: unknown,
	fallback = i18n.t("NOTIFICATIONS.ERROR"),
	options?: ApiErrorOptions,
): string {
	if (!isAxiosError(error)) {
		return trimMessage((error as Error)?.message) ?? fallback;
	}

	if (isTimeoutError(error)) {
		return options?.timeoutMessage ?? DEFAULT_TIMEOUT_MESSAGE;
	}

	if (isNetworkError(error)) {
		return options?.networkMessage ?? DEFAULT_NETWORK_MESSAGE;
	}

	const parsed = parseApiFieldErrors(error);
	if (parsed?.fieldErrors.length) {
		return parsed.summary;
	}

	return (
		extractResponseMessage(error.response?.data) ??
		trimMessage(error.message) ??
		fallback
	);
}
