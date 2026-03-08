export type InputBaseProps = {
  label?: string;
  placeholder?: string;
  type?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  disabled?: boolean;
  id?: string;
  control: any;
  name: string;
  rules?: object;
};

/** Apenas classes de layout/typografia; cores de tema via useThemeColors() + style/placeholderTextColor */
export const INPUT_STYLES = {
  default: {
    label: "font-semibold text-base pl-2.5",
    input: "rounded-lg px-2.5 py-3 font-semibold text-base",
  },
  error: {
    label: "text-red-500 font-semibold text-base pl-2.5",
    input: "rounded-lg px-2.5 py-3 font-semibold text-base",
  },
  disabled: {
    label: "font-semibold text-base pl-2.5 opacity-70",
    input: "rounded-lg px-2.5 py-3 font-semibold text-base opacity-70",
  },
} as const;

export const onlyDigits = (text: string) => text.replace(/\D/g, "");
