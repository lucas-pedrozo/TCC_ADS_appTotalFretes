export interface EditPerfilMap {
  name: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  cpf: string;
  isDeficient?: boolean;
  sex?: string;
}

/** Payload de edição de CNH (cnhType_id numérico no PATCH). */
export interface EditCnhMap {
  cnhNumber: string;
  issuingAgencyCnh: string;
  cnhType_id: number;
  useGlasses: boolean;
}
