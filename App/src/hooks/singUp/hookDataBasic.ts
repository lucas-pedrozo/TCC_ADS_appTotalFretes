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
    handleSubmit((data) => {
      setPersona(data);
      options?.onNext?.();
    })();
  },
    [handleSubmit, options, setPersona]
  );


  const rules = {
    nome: validationRules.nome,
    email: validationRules.email,
    dataNascimento: validationRules.dataNascimento,
    numeroTelefone: validationRules.numeroTelefone,
    cpf: validationRules.cpf,
    deficiencia: validationRules.deficiencia,
    sexo: validationRules.sexo,
  };

  return {
    control,
    errors,
    rules,
    handleNext,
  };
}
