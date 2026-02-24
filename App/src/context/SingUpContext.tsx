import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * @description Interface de dados de pessoa
 * @returns Interface de dados de pessoa
 */
export type SingUpPersonaData = {
  name: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  cpf: string;
  isDeficient?: boolean;
  sex?: string;
};

/**
 * @description Interface de dados de CNH
 * @returns Interface de dados de CNH
 */
export type SingUpCnhData = {
  cnhNumber: string;
  useGlasses?: boolean;
  issuingAgencyCnh: string;
  cnhType_id?: number;  
};

/**
 * @description Interface de dados de senha
 * @returns Interface de dados de senha
 */
export type SingUpPasswordData = {
  password: string;
  confirmPassword: string;
};

/**
 * @description Interface de dados de draft
 * @returns Interface de dados de draft
 */
export type SingUpDraftData = SingUpPersonaData &
  SingUpCnhData &
  SingUpPasswordData & {
    sex?: string;
  };

/**
 * @description Interface de contexto de cadastro
 * @returns Interface de contexto de cadastro
 */
type SingUpContextValue = {
  persona: SingUpPersonaData;
  cnh: SingUpCnhData;
  password: SingUpPasswordData;
  setPersona: (data: SingUpPersonaData) => void;
  setCnh: (data: SingUpCnhData) => void;
  setPassword: (data: SingUpPasswordData) => void;
  getPayload: () => SingUpDraftData;
};

/**
 * @description Dados de pessoa default
 * @returns Dados de pessoa default
 */
const defaultPersona: SingUpPersonaData = {
  name: "",
  email: "",
  birthDate: "",
  phoneNumber: "",
  cpf: "",
  isDeficient: undefined,
  sex: "",
};

/**
 * @description Dados de CNH default
 * @returns Dados de CNH default
 */
const defaultCnh: SingUpCnhData = {
  cnhNumber: "",
  useGlasses: undefined,
  issuingAgencyCnh: "",
  cnhType_id: undefined,
};

/**
 * @description Dados de senha default
 * @returns Dados de senha default
 */
const defaultPassword: SingUpPasswordData = {
  password: "",
  confirmPassword: "",
};

const SingUpContext = createContext<SingUpContextValue | undefined>(undefined);

/**
 * @description Provider de cadastro
 * @param children Filhos do provider
 * @returns Provider de cadastro
 */
export function SingUpProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersonaState] = useState<SingUpPersonaData>(defaultPersona);
  const [cnh, setCnhState] = useState<SingUpCnhData>(defaultCnh);
  const [password, setPasswordState] = useState<SingUpPasswordData>(defaultPassword);
  
  const setPersona = useCallback((data: SingUpPersonaData) => setPersonaState(data), []);
  const setCnh = useCallback((data: SingUpCnhData) => setCnhState(data), []);
  const setPassword = useCallback((data: SingUpPasswordData) => setPasswordState(data), []);

  const getPayload = useCallback(
    () => ({
      ...persona,
      ...cnh,
      ...password,
    }),
    [persona, cnh, password]
  );

  const value = useMemo(
    () => ({
      persona,
      cnh,
      password,
      setPersona,
      setCnh,
      setPassword,
      getPayload,
    }),
    [persona, cnh, password, setPersona, setCnh, setPassword, getPayload]
  );

  return <SingUpContext.Provider value={value}>{children}</SingUpContext.Provider>;
}

/**
 * @description Hook para usar o contexto de cadastro
 * @returns Hook para usar o contexto de cadastro
 */
export function useSingUpContext() {
  const context = useContext(SingUpContext);

  if (!context) {
    throw new Error("useSingUpContext must be used within SingUpProvider");
  }

  return context;
}
