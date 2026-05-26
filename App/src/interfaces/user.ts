export interface MapCnh {
  id: number;
  name: string;
  description?: string;
}

export interface MapUserImage {
  id: number;
  originalName?: string;
  fileName: string;
  path: string;
  mimeType: string;
  sizeBytes: number;
}

export interface MapUser {
  id: number;
  name: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  cpf: string;
  sex: string;
  useGlasses: boolean;
  issuingAgencyCnh?: string;
  isDeficient: boolean;
  cnhNumber: string;
  cnhType_id: number;
  vehicle_id: number | null;
  CnhType?: MapCnh | null;
  createdAt: string;
  updatedAt: string;
  userImage_id: number | null;
  UserImage?: MapUserImage | null;
}
