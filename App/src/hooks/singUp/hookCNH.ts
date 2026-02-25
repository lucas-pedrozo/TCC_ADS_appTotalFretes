import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { SingUpCnhData, useSingUpContext } from "../../context/SingUpContext";
import { validationRules } from "../../utils/formValidations";

type UseHookSingUpCnhOptions = {
  onNext?: () => void;
};

/**
 * @description Hook para usar o formulario de cadastro de CNH
 * @param options Opcoes do hook
 * @returns Hook para usar o formulario de cadastro de CNH
 */
export function useHookCnh(options?: UseHookSingUpCnhOptions) {
  const { cnh, setCnh } = useSingUpContext();

  const { control, handleSubmit, formState: { errors } } = useForm<SingUpCnhData>({
    defaultValues: cnh,
    mode: "onSubmit",
  });

  const handleNext = useCallback(() => {
    try {
      handleSubmit((data) => {
        setCnh(data);
        options?.onNext?.();
      },)();
    } catch (error) {
      console.log(error)
    }
  }, [handleSubmit, options, setCnh]);

  const rules = {
    cnhNumber: validationRules.cnhNumber,
    issuingAgencyCnh: validationRules.issuingAgencyCnh,
    cnhType_id: validationRules.cnhType_id,
    useGlasses: validationRules.useGlasses,
  };

  return {
    control,
    errors,
    rules,
    handleNext,
  };
}
