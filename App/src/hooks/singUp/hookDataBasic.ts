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
    try {
      handleSubmit(async (data) => {
        await setPersona(data);
        await options?.onNext?.();
      },)();
    } catch (error) {
      console.log(error)
    }
  },
    [handleSubmit, options, setPersona]
  );


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
