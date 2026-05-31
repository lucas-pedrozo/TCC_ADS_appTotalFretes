import { AxiosError } from "axios";
import i18n from "@/src/i18n";

export function getApiErrorMessage(
	error: unknown,
	fallback = i18n.t("NOTIFICATIONS.ERROR"),
): string {
	const axiosErr = error as AxiosError<{ message?: string }>;
	const msg = axiosErr.response?.data?.message?.trim();
	return msg || fallback;
}
