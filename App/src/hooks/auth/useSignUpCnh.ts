import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { SingUpCnhData, useSingUpContext } from "@/src/context/SingUpContext";
import { getValidationRules } from "@/src/utils/formValidations";

type UseSignUpCnhOptions = {
  onNext?: () => void;
};

export function useSignUpCnh(options?: UseSignUpCnhOptions) {
  const { cnh, setCnh } = useSingUpContext();

  const { control, handleSubmit, formState: { errors } } = useForm<SingUpCnhData>({
    defaultValues: cnh,
    mode: "onSubmit",
  });

  const handleNext = useCallback(() => {
    handleSubmit((data) => {
      setCnh(data);
      options?.onNext?.();
    })();
  }, [handleSubmit, options, setCnh]);

  const validationRules = getValidationRules();
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
