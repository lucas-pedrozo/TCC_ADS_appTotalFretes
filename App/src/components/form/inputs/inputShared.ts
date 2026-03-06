export type InputBaseProps = {
  label?: string;
  placeholder?: string;
  type?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  maxLength?: number;
  desabled?: boolean;
  id?: string;
  control: any;
  name: string;
  rules?: object;
};

export const INPUT_STYLES = {
  default: {
    label: "text-lightText dark:text-darkText font-semibold text-base pl-2.5",
    input:
      "bg-lightBgSecondary dark:bg-darkBgSecondary rounded-lg px-2.5 py-3 font-semibold text-base placeholder:text-lightTextSecondary dark:placeholder:text-darkTextSecondary text-lightText dark:text-darkText",
  },
  error: {
    label: "text-red-500 font-semibold text-base pl-2.5",
    input:
      "bg-lightBgSecondary dark:bg-darkBgSecondary rounded-lg px-2.5 py-3 font-semibold text-base placeholder:text-red-500 dark:placeholder:text-red-500 text-red-500",
  },
  desabled: {
    label: "text-lightText dark:text-darkText font-semibold text-base pl-2.5 opacity-70",
    input:
      "bg-lightBgSecondary dark:bg-darkBgSecondary rounded-lg px-2.5 py-3 font-semibold text-base placeholder:text-lightTextSecondary dark:placeholder:text-darkTextSecondary text-lightText dark:text-darkText opacity-70",
  },
} as const;

export const onlyDigits = (text: string) => text.replace(/\D/g, "");
