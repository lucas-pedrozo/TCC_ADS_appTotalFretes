export interface FreightUserMap {
  id: number;
  title: string;
  description: string;
  cargo_Id: number;
  vehicleType_id: number;
  origin_label: string;
  origin_lat: number;
  origin_lng: number;
  destination_label: string;
  destination_lat: number;
  destination_lng: number;
  time_limit: string;
  status: string;
  value: string;

  cargo: CargoUserMap;
}

export interface CargoUserMap {
  id: number;
  name: string;
  description: string;
  weight: number;
  volume: number;
  type: string;
  unit: string;
  quantity: number;
}