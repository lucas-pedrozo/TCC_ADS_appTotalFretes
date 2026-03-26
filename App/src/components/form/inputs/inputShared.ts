import type { Control, FieldValues, Path } from "react-hook-form";

export type InputBaseProps<T extends FieldValues = FieldValues> = {
	label?: string;
	placeholder?: string;
	type?: "default" | "email-address" | "numeric" | "phone-pad";
	secureTextEntry?: boolean;
	autoFocus?: boolean;
	maxLength?: number;
	disabled?: boolean;
	id?: string;
	control: Control<T>;
	name: Path<T>;
	/** object evita conflito com Validate<> em campos boolean | string */
	rules?: object;
};

export const INPUT_STYLES = {
	default: {
		label: "font-semibold text-base pl-2.5",
		input: "rounded-xl px-2.5 py-3 font-semibold text-base",
	},
	error: {
		label: "text-red-500 font-semibold text-base pl-2.5",
		input: "rounded-xl px-2.5 py-3 font-semibold text-base",
	},
	disabled: {
		label: "font-semibold text-base pl-2.5 opacity-70",
		input: "rounded-xl px-2.5 py-3 font-semibold text-base opacity-70",
	},
} as const;

export const onlyDigits = (text: string) => text.replace(/\D/g, "");
export const onlyAlphanumeric = (text: string) =>
	text.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 7);
