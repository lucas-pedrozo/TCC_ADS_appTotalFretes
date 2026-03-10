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
    status: statusFreightMap | null;

    cargo_type_id: number;
    cargo: CargoUserMap | null;
  }

  // ========Cargo======== //

  export interface CargoUserMap {
    id: number;
    name: string;
    weight: number;
    
    vehicle_type_id: number;
    vehicle_type: VehicleTypeMap | null;

    image_id: number;
    image: CargoImageUserMap | null;
  }

  // ========Intenção de Frete======== //

  export interface IntentionFreightMap {
    id: number;
    freight_id: number;
    driver_id: number;
    proposed_value: string;

    status_id: number;
    status: statusIntentionFreightMap | null;
  }

  // ========Veiculo======== //

  export interface VehicleTypeMap {
    id: number;
    name: string;
  }

  export interface VehicleGroupMap {
    id: number;
    name: string;
  }

  // ========Status======== //

  export interface statusFreightMap {
    id: number;
    name: string;
  }
  export interface statusIntentionFreightMap {
    id: number;
    name: string;
  }

  // ========Empresa======== //
  export interface CompanyUserMap {
    id?: number;
    name?: string;
    email?: string;
    birth_date?: Date;
    phone_number?: string;
    cnpj?: string;
    
    company_image_id?: number;
    company_image?: CompanyImageUserMap | null;

    company_address_id?: number;
    company_address?: CompanyAddressUserMap | null;
  }

  // ========Endereço da Empresa======== //
  export interface CompanyAddressUserMap {
    id?: number;
    cep?: string;
    street?: string;
    district?: string;
    number?: string;
    city?: string;
    state?: string;
  }

  // ========Imagem da empresa======== //
  export interface CompanyImageUserMap {
    id?: number;
    image_url?: string;
  }

  // ========Imagem do cargo======== //
  export interface CargoImageUserMap {
    id?: number;
    image_url?: string;
  }
