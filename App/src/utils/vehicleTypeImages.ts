import { ImageSourcePropType } from "react-native";

/**
 * Mapeamento nome do tipo (API/seed) → imagem local.
 * Os nomes devem coincidir com `nome` em seedVehicleType.ts.
 */
export const VEHICLE_TYPE_IMAGES: Record<string, ImageSourcePropType> = {
  // Caminhão
  "Caminhão 2 eixos": require("@/src/assets/veiculos/caminhao/Caminhão 2 eixos.png"),
  "Caminhão 3 eixos": require("@/src/assets/veiculos/caminhao/Caminhão 3 eixos.png"),

  // Carreta
  "Carreta 3 eixos": require("@/src/assets/veiculos/carreta/Carreta 3 eixos.png"),
  "Carreta 4 eixos": require("@/src/assets/veiculos/carreta/Carreta 4 eixos.png"),
  "Carreta 5 eixos": require("@/src/assets/veiculos/carreta/Carreta 5 eixos.png"),
  "Carreta 6 eixos": require("@/src/assets/veiculos/carreta/Carreta 6 eixos.png"),
  "Carreta 7 eixos": require("@/src/assets/veiculos/carreta/Carreta 7 eixos.png"),

  // Bitrem
  "Bitrem 4 eixos": require("@/src/assets/veiculos/bitrem/Bitrem 4 eixos.png"),
  "Bitrem 5 eixos": require("@/src/assets/veiculos/bitrem/Bitrem 5 eixos.png"),
  "Bitrem 6 eixos": require("@/src/assets/veiculos/bitrem/Bitrem 6 eixos.png"),
  "Bitrem 7 eixos": require("@/src/assets/veiculos/bitrem/Bitrem 7 eixos.png"),
  "Bitrem 9 eixos": require("@/src/assets/veiculos/bitrem/Bitrem 9 eixos.png"),
};

const DEFAULT_VEHICLE_IMAGE = VEHICLE_TYPE_IMAGES["Caminhão 2 eixos"];

export function getVehicleTypeImage(nome: string): ImageSourcePropType {
  return VEHICLE_TYPE_IMAGES[nome] ?? DEFAULT_VEHICLE_IMAGE;
}
