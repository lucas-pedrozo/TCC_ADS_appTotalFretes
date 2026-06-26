import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { SingUpPersonaData, useSingUpContext } from "@/src/context/SingUpContext";
import { applyRhfFieldErrors } from "@/src/utils/apiFieldErrors";
import { getValidationRules } from "@/src/utils/formValidations";

type UseSignUpDataBasicOptions = {
  onNext?: () => void;
};

export function useSignUpDataBasic(options?: UseSignUpDataBasicOptions) {
  const { persona, setPersona, fieldErrors, clearFieldErrors } = useSingUpContext();

  const { control, handleSubmit, setError, formState: { errors } } = useForm<SingUpPersonaData>({
    defaultValues: persona,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (fieldErrors.length === 0) return;

    const personaFields = fieldErrors.filter((issue) =>
      ["email", "phoneNumber", "cpf", "name", "birthDate", "sex", "isDeficient"].includes(issue.field),
    );
    if (personaFields.length === 0) return;

    applyRhfFieldErrors(setError, personaFields);
    clearFieldErrors();
  }, [clearFieldErrors, fieldErrors, setError]);

  const handleNext = useCallback(() => {
    try {
      handleSubmit(async (data) => {
        await setPersona(data);
        await options?.onNext?.();
      })();
    } catch (error) {
      console.log(error);
    }
  }, [handleSubmit, options, setPersona]);

  const validationRules = getValidationRules();
  const rules = {
    name: validationRules.name,
    email: validationRules.email,
    cpf: validationRules.cpf,
    sex: validationRules.sex,
    birthDate: validationRules.birthDate,
    phoneNumber: validationRules.phoneNumber,
    isDeficient: validationRules.isDeficient,
  };

  return {
    control,
    errors,
    rules,
    handleNext,
  };
}
