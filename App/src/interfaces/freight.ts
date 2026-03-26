/**
 * Tipos alinhados às respostas do backend (Sequelize + includes).
 * Muitos aninhados são opcionais/null quando o include não veio ou falhou.
 * Campos de lista principal (FreightUserMap) tendem a vir preenchidos no GET de fretes do motorista.
 */

export interface FreightUserMap {
  id: number;
  assigned_driver_id: number;

  origin_label: string;
  origin_lat: number;
  origin_lng: number;

  destination_label: string;
  destination_lat: number;
  destination_lng: number;

  time_limit: string;
  original_value: string;
  final_value: string;

  departure_date: string;
  arrival_date: string;

  vehicle_group_id: number;
  vehicle_group: VehicleGroupMap | null;

  company_id: number;
  company: CompanyUserMap | null;

  status_id: number;
  status: StatusFreightMap | null;

  cargo_type_id: number;
  cargo: CargoUserMap | null;
}

/** Carga + tipo de veículo e imagem (includes opcionais). */
export interface CargoUserMap {
  id: number;
  name: string;
  weight: number;
  vehicle_type_id: number;
  vehicle_type: VehicleTypeMap | null;
  image_id: number;
  image: CargoImageUserMap | null;
}

export interface IntentionFreightMap {
  id: number;
  freight_id: number;
  driver_id: number;
  proposed_value: string;
  status_id: number;
  status: StatusIntentionFreightMap | null;
}

export interface VehicleTypeMap {
  id: number;
  name: string;
}

export interface VehicleGroupMap {
  id: number;
  name: string;
}

export interface StatusFreightMap {
  id: number;
  name: string;
}

export interface StatusIntentionFreightMap {
  id: number;
  name: string;
}

/** Empresa: API costuma enviar strings ISO em datas, não instâncias Date. */
export interface CompanyUserMap {
  id?: number;
  name?: string;
  email?: string;
  /** ISO string quando vem de JSON */
  birth_date?: string;
  phone_number?: string;
  cnpj?: string;
  company_image_id?: number;
  company_image?: CompanyImageUserMap | null;
  company_address_id?: number;
  company_address?: CompanyAddressUserMap | null;
}

export interface CompanyAddressUserMap {
  id?: number;
  cep?: string;
  street?: string;
  district?: string;
  number?: string;
  city?: string;
  state?: string;
}

export interface CompanyImageUserMap {
  id?: number;
  image_url?: string;
}

export interface CargoImageUserMap {
  id?: number;
  image_url?: string;
}
