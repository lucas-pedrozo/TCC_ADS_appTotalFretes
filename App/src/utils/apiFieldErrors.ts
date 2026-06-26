import { isAxiosError } from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export type ApiFieldIssue = {
	field: string;
	message: string;
};

type ApiErrorPayload = {
	message?: string;
	type?: string;
	conflicts?: Array<{ field?: string; message?: string }>;
	issues?: Array<{ field?: string; message?: string }>;
};

function trimMessage(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeFieldIssues(
	items: Array<{ field?: string; message?: string }> | undefined,
): ApiFieldIssue[] {
	if (!items?.length) return [];

	return items
		.map((item) => {
			const field = typeof item.field === "string" ? item.field.trim() : "";
			const message = trimMessage(item.message);
			if (!field || !message) return null;
			return { field, message };
		})
		.filter((item): item is ApiFieldIssue => item !== null);
}

function buildSummary(
	payload: ApiErrorPayload | undefined,
	fieldErrors: ApiFieldIssue[],
): string | undefined {
	const message = trimMessage(payload?.message);
	if (message) return message;

	if (fieldErrors.length > 0) {
		return fieldErrors.map((item) => item.message).join("\n");
	}

	return undefined;
}

export function parseApiFieldErrors(error: unknown): {
	summary: string;
	fieldErrors: ApiFieldIssue[];
} | null {
	if (!isAxiosError(error)) return null;

	const payload = error.response?.data as ApiErrorPayload | string | undefined;
	if (!payload || typeof payload === "string") return null;

	const fieldErrors = [
		...normalizeFieldIssues(payload.conflicts),
		...normalizeFieldIssues(payload.issues),
	];

	const summary = buildSummary(payload, fieldErrors);
	if (!summary && fieldErrors.length === 0) return null;

	return {
		summary: summary ?? fieldErrors[0]?.message ?? "",
		fieldErrors,
	};
}

export function applyRhfFieldErrors<TFieldValues extends FieldValues>(
	setError: UseFormSetError<TFieldValues>,
	fieldErrors: ApiFieldIssue[],
	fieldMap?: Record<string, Path<TFieldValues>>,
): void {
	for (const issue of fieldErrors) {
		const fieldName = (fieldMap?.[issue.field] ?? issue.field) as Path<TFieldValues>;
		setError(fieldName, { type: "server", message: issue.message });
	}
}

const CNH_SIGNUP_FIELDS = new Set([
	"cnhNumber",
	"issuingAgencyCnh",
	"cnhType_id",
	"useGlasses",
]);

export function getSignupScreenForField(
	field: string,
): "SingUp" | "SingUpCNH" {
	return CNH_SIGNUP_FIELDS.has(field) ? "SingUpCNH" : "SingUp";
}

export function getSignupScreenForFieldErrors(
	fieldErrors: ApiFieldIssue[],
): "SingUp" | "SingUpCNH" {
	for (const issue of fieldErrors) {
		if (CNH_SIGNUP_FIELDS.has(issue.field)) {
			return "SingUpCNH";
		}
	}
	return "SingUp";
}
