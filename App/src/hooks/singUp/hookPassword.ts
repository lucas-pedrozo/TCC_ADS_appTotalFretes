import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { useHookSingUp } from "./hookSingUp";
import { SingUpPasswordData, useSingUpContext } from "../../context/SingUpContext";
import { validationRules, validatePasswordConfirmationMatch } from "../../utils/formValidations";

type UseHookSingUpPasswordOptions = {
  onSuccess?: () => void;
};

/**
 * @description Hook para usar o formulario de cadastro de senha
 * @param options Opcoes do hook
 * @returns Hook para usar o formulario de cadastro de senha
 */
export function useHookPassword(options?: UseHookSingUpPasswordOptions) {
  const { password, setPassword, getPayload } = useSingUpContext();
  const { handleSingUp } = useHookSingUp();

  const { control, handleSubmit, formState: { errors }, watch } = useForm<SingUpPasswordData>({
    defaultValues: password,
    mode: "onSubmit",
  });

  /**
   * @description Funcao para finalizar o formulario de cadastro de senha
   * @returns Funcao para finalizar o formulario de cadastro de senha
   */
  const handleFinish = useCallback(() => {
    handleSubmit(async (data) => {
      setPassword(data);
      const payload = { ...getPayload(), ...data };
      await handleSingUp(payload);
      options?.onSuccess?.();
    })();
  }, [getPayload, handleSingUp, handleSubmit, options, setPassword]);

  const rules = {
    password: validationRules.password,
    confirmPassword: {
      ...validationRules.confirmPassword,
      validate: (value: string) => validatePasswordConfirmationMatch(value, watch("password")),
    },
  };

  return {
    control,
    errors,
    rules,
    handleFinish,
  };
}
