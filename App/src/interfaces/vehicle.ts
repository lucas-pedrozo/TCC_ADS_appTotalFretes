export interface MapVehicle {
  id: number;
  plateNumber: string;
  chassisNumber: string;
  model: string;
  mark: string;
  city: string;
  stateUF: string;
  country: string;
  vehicleType_id: number;
  vehicleType?: MapVehicleType | null;
}

export interface MapVehicleType {
  id?: number;
  nome?: string;
  axes?: number;
  weight?: number;
  capacityWeight?: number;
  length?: number;
  imageVehicle_id?: number;
  groupVehicleType_id?: number;
  GroupVehicleType?: {
    id?: number;
    nome?: string;
  } | null;
}