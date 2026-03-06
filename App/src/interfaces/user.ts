export interface MapCnh {
  id: number;
  name: string;
  description: string;
}

export interface MapUser {
  name: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  cpf: string;
  sex: string;
  useGlasses: boolean;
  issuingAgencyCnh: string;
  isDeficient: boolean;
  cnhNumber: string;
  cnhType_id: number;
  vehicleType_id: number | null;
  userImage_id: number | null;
  CnhType: MapCnh;
}
