import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { SingUpCnhData, useSingUpContext } from "@/src/context/SingUpContext";
import { applyRhfFieldErrors } from "@/src/utils/apiFieldErrors";
import { getValidationRules } from "@/src/utils/formValidations";

type UseSignUpCnhOptions = {
  onNext?: () => void;
};

export function useSignUpCnh(options?: UseSignUpCnhOptions) {
  const { cnh, setCnh, fieldErrors, clearFieldErrors } = useSingUpContext();

  const { control, handleSubmit, setError, formState: { errors } } = useForm<SingUpCnhData>({
    defaultValues: cnh,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (fieldErrors.length === 0) return;

    const cnhFields = fieldErrors.filter((issue) =>
      ["cnhNumber", "issuingAgencyCnh", "cnhType_id", "useGlasses"].includes(issue.field),
    );
    if (cnhFields.length === 0) return;

    applyRhfFieldErrors(setError, cnhFields, {
      cnhType_id: "cnhType_id",
    });
    clearFieldErrors();
  }, [clearFieldErrors, fieldErrors, setError]);

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
