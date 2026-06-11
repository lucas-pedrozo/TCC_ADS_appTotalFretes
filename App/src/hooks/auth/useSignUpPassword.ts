import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { useSignUp } from "./useSignUp";
import { SingUpPasswordData, useSingUpContext } from "@/src/context/SingUpContext";
import i18n from "@/src/i18n";
import { getValidationRules, validatePasswordConfirmationMatch } from "@/src/utils/formValidations";

type UseSignUpPasswordOptions = {
  onSuccess?: () => void;
};

export function useSignUpPassword(options?: UseSignUpPasswordOptions) {
  const { password, setPassword, getPayload } = useSingUpContext();
  const { handleSingUp } = useSignUp();

  const { control, handleSubmit, formState: { errors }, watch } = useForm<SingUpPasswordData>({
    defaultValues: password,
    mode: "onSubmit",
  });

  const handleFinish = useCallback(() => {
    handleSubmit(async (data) => {
      setPassword(data);
      const payload = { ...getPayload(), ...data };
      await handleSingUp(payload);
      options?.onSuccess?.();
    })();
  }, [getPayload, handleSingUp, handleSubmit, options, setPassword]);

  const validationRules = getValidationRules();
  const rules = {
    password: validationRules.password,
    confirmPassword: {
      required: validationRules.confirmPassword.required,
      validate: (value: string) =>
        validatePasswordConfirmationMatch(value, watch("password")) ||
        i18n.t("VALIDATION.INVALIDCONFIRMPASSWORD"),
    },
  };

  return {
    control,
    errors,
    rules,
    handleFinish,
  };
}
