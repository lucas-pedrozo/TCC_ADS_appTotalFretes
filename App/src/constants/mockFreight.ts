import type { FreightUserMap } from "@/src/interfaces/freight";

/**
 * Frete mock para testar a projeção no carro (Android Auto).
 * Usado pelo botão "Iniciar frete de teste" em Opções avançadas.
 */
export const MOCK_FREIGHT: FreightUserMap = {
  id: 0,
  assigned_driver_id: 0,
  origin_label: "São Paulo, SP - Armazém Centro",
  origin_lat: -23.5505,
  origin_lng: -46.6333,
  destination_label: "Curitiba, PR - Centro de Distribuição",
  destination_lat: -25.4284,
  destination_lng: -49.2733,
  time_limit: "31/12/2025",
  original_value: "5000,00",
  final_value: "4.750,00",
  departure_date: "01/12/2025",
  arrival_date: "02/12/2025",
  vehicle_group_id: 1,
  vehicle_group: { id: 1, name: "Caminhão" },
  company_id: 1,
  company: { name: "Transportes Teste Ltda" },
  status_id: 1,
  status: { id: 1, name: "Em andamento" },
  cargo_type_id: 1,
  cargo: {
    id: 1,
    name: "Carga geral",
    weight: 15000,
    vehicle_type_id: 1,
    vehicle_type: { id: 1, name: "Caminhão" },
    image_id: 0,
    image: null,
  },
};
