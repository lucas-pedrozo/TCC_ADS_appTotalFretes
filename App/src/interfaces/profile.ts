export interface EditPerfilMap {
  name: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  cpf: string;
  isDeficient?: boolean;
  sex?: string;
}

export interface EditCnhMap {
  cnhNumber: string;
  issuingAgencyCnh: string;
  cnhType_id: string;
  useGlasses: boolean;
}
