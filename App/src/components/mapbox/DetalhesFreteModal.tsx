import React, { useEffect, useMemo } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";

import animation from "@/src/utils/animation";
import { primeiraParte } from "@/src/utils/funcoes";
import { useThemeMode } from "@/src/context/ThemeContext";
import { getCameraFromGeometry } from "@/src/utils/mapboxUtils";
import { useHookGetMapBox } from "@/src/hooks/mapBox/hookGetMapBox";
import { MapRouteView } from "./MapRouteView";

interface DetalhesFreteModalProps {
  visible: boolean;
  onClose: () => void;
  enderecoCarga?: string;
  enderecoDestino?: string;
  nomeEmpresa?: string;
  rotaSimples?: boolean;
  prazo?: string;
}

const DetailRow = React.memo(function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row justify-between mb-2.5">
      <Text className="text-lightTextSecondary dark:text-darkTextSecondary">
        {label}
      </Text>
      <Text className="font-medium text-lightText dark:text-darkText">
        {value}
      </Text>
    </View>
  );
});

export default function DetalhesFreteModal({
  visible,
  onClose,
  enderecoCarga = "Rua São Paulo 4512, Campo Mourão, PR, Brasil",
  enderecoDestino = "Juranda, PR, Brasil",
  nomeEmpresa = "Coamo, PR, Brasil",
  rotaSimples = false,
  prazo = "10/09/2025",
}: DetalhesFreteModalProps) {
  const { mode } = useThemeMode();
  const { rotaData, handleGetMapBox } = useHookGetMapBox();

  const { center: cameraCenter, zoom: cameraZoom } = useMemo(
    () => getCameraFromGeometry(rotaData?.geometria),
    [rotaData?.geometria]
  );

  useEffect(() => {
    if (!visible) return;
    const destino = rotaSimples
      ? enderecoDestino
      : `${nomeEmpresa}, ${enderecoDestino}`;
    handleGetMapBox(enderecoCarga, destino, { rotaSimples });
  }, [
    visible,
    enderecoCarga,
    enderecoDestino,
    nomeEmpresa,
    rotaSimples,
    handleGetMapBox,
  ]);

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <animation.FadeDown className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[90%] rounded-2xl overflow-hidden border border-lightBgTertiary dark:border-darkBgTertiary bg-lightBgSecondary dark:bg-darkBgSecondary">
          <View className="flex-row justify-between items-center p-4 border-b border-lightBgNonary dark:border-darkBgNonary">
            <Text className="text-lg font-bold text-lightText dark:text-darkText">
              Rota
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-red-100 dark:bg-darkBgTertiary px-2.5 py-1.5 rounded-lg"
              accessibilityRole="button"
              accessibilityLabel="Fechar modal"
            >
              <Text className="text-red-600 dark:text-darkText font-bold">
                X
              </Text>
            </TouchableOpacity>
          </View>

          <MapRouteView
            rotaData={rotaData}
            cameraCenter={cameraCenter}
            cameraZoom={cameraZoom}
            darkMode={mode === "dark"}
          />

          <View className="p-5">
            <Text className="text-base font-bold mb-4 text-lightText dark:text-darkText">
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
