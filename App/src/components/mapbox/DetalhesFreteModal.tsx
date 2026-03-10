import React, { useMemo } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";

import animation from "@/src/utils/animation";
import { primeiraParte } from "@/src/utils/format";
import { useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import { getCameraFromGeometry } from "@/src/utils/mapboxUtils";
import { useGetMapBox } from "@/src/hooks/freight/useGetMapBox";
import { MapRouteView } from "./MapRouteView";
import { DetailRow } from "../info/DetailRow";
import { Ionicons } from "@expo/vector-icons";

interface DetalhesFreteModalProps {
  visible: boolean;
  onClose: () => void;
  enderecoCarga?: string;
  enderecoDestino?: string;
  nomeEmpresa?: string;
  rotaSimples?: boolean;
  prazo?: string;
}

export default function DetalhesFreteModal({
  visible,
  onClose,
  enderecoCarga = "",
  enderecoDestino = "",
  nomeEmpresa = "",
  rotaSimples = false,
  prazo = "10/09/2025",
}: DetalhesFreteModalProps) {
  const colors = useThemeColors();
  const { mode } = useThemeMode();
  const { rotaData } = useGetMapBox();

  const { center: cameraCenter, zoom: cameraZoom } = useMemo(() => {
    return getCameraFromGeometry(rotaData?.geometria);
  }, [rotaData?.geometria]);

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <animation.FadeDown className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[90%] rounded-2xl overflow-hidden" style={{ borderColor: colors.bgTertiary, borderWidth: 1, backgroundColor: colors.bgSecondary }}>
          <View className="flex-row justify-between items-center border-b p-2.5" style={{ borderBottomColor: colors.bgNonary, borderBottomWidth: 1 }}>
            <Text className="text-lg font-bold" style={{ color: colors.text }}>
              Rota do Frete
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.bgTertiary }}
              accessibilityRole="button"
              accessibilityLabel="Fechar modal"
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <MapRouteView
            rotaData={rotaData}
            cameraCenter={cameraCenter}
            cameraZoom={cameraZoom}
            darkMode={mode === "dark"}
          />

          <View className="p-2.5">
            <Text className="text-base font-bold mb-4" style={{ color: colors.text }}>
              Mais Detalhes
            </Text>

            <DetailRow
              label="Distância total"
              value={
                rotaData?.distancia_total_km != null
                  ? `${rotaData.distancia_total_km.toFixed(1)} km`
                  : "—"
              }
            />

            {rotaData?.trecho_ate_carga != null && (
              <DetailRow
                label="Você → Carga"
                value={`${rotaData.trecho_ate_carga.distancia_km.toFixed(1)} km`}
              />
            )}

            {rotaData?.trecho_carga_ao_destino != null && (
              <DetailRow
                label="Carga → Destino"
                value={`${rotaData.trecho_carga_ao_destino.distancia_km.toFixed(1)} km`}
              />
            )}

            <DetailRow
              label="Saída (carga)"
              value={primeiraParte(enderecoCarga)}
            />
            <DetailRow label="Destino" value={enderecoDestino} />
            <DetailRow label="Empresa Dest" value={nomeEmpresa} />
            <DetailRow label="Prazo" value={prazo} />
          </View>
        </View>
      </animation.FadeDown>
    </Modal>
  );
}
