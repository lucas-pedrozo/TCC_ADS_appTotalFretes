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

  /**
   * @description Funcao para navegar para o proximo passo
   * @returns Funcao para navegar para o proximo passo
   */
  const handleNext = useCallback(() => {
    handleSubmit(
      (data) => {
        setCnh(data);
        options?.onNext?.();
      },
    )();
  }, [handleSubmit, options, setCnh]);

  const rules = {
    orgaoEmissor: validationRules.orgaoEmissor,
    deficiencia: validationRules.deficiencia,
    tipoCnh: validationRules.tipoCnh,
    oculos: validationRules.oculos,
    cnh: validationRules.cnh,
  };

  return {
    control,
    errors,
    rules,
    handleNext,
  };
}
