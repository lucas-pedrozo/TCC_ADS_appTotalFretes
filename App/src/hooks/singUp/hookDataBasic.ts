import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { SingUpPersonaData, useSingUpContext } from "../../context/SingUpContext";
import { validationRules } from "../../utils/formValidations";

type UseHookSingUpPersonaOptions = {
  onNext?: () => void;
};

export function useHookDataBasic(options?: UseHookSingUpPersonaOptions) {
  const { persona, setPersona } = useSingUpContext();

  const { control, handleSubmit, formState: { errors } } = useForm<SingUpPersonaData>({
    defaultValues: persona,
    mode: "onSubmit",
  });

  const handleNext = useCallback(() => {
      handleSubmit(async (data) => {
      await setPersona(data);
      await options?.onNext?.();
    },
    )();
  },
    [handleSubmit, options, setPersona]
  );


  const rules = {
    fullName: validationRules.fullName,
    email: validationRules.email,
    cpf: validationRules.cpf,
    phoneNumber: validationRules.phoneNumber,
    gender: validationRules.gender,
    birthDate: validationRules.birthDate,
    disability: validationRules.disability,
  };

  return {
    control,
    errors,
    rules,
    handleNext,
  };
}
