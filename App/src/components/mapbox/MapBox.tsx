import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {View, Text, Modal, TouchableOpacity, ActivityIndicator} from 'react-native';

import Mapbox from '@rnmapbox/maps';
import { MAPBOX_PUBLIC_TOKEN } from '@env';
import { Ionicons } from '@expo/vector-icons';

import animation from '@/src/utils/animation';
import { primeiraParte } from '@/src/utils/funcoes';
import { useThemeMode } from '@/src/context/ThemeContext';
import { getCameraFromGeometry } from '@/src/utils/mapboxUtils';
import { useHookGetMapBox } from '@/src/hooks/mapBox/hookGetMapBox';

type CameraRef = React.ComponentRef<typeof Mapbox.Camera>;

Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN);

const CAMERA_ANIMATION_MS = 500;
const ROTA_LINE_STYLE = {
  lineColor: '#2ECC71',
  lineWidth: 5,
  lineCap: 'round' as const,
  lineJoin: 'round' as const,
};

interface DetalhesFreteModalProps {
  visible: boolean;
  onClose: () => void;
  enderecoCarga?: string;
  enderecoDestino?: string;
  nomeEmpresa?: string;
  rotaSimples?: boolean;
  prazo?: string;
}

function DetailRow({
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
}

export default function DetalhesFreteModal({
  visible,
  onClose,
  enderecoCarga = 'Rua São Paulo 4512, Campo Mourão',
  enderecoDestino = 'Juranda',
  nomeEmpresa = 'Coamo',
  rotaSimples = false,
  prazo = '10/09/2025',
}: DetalhesFreteModalProps) {
  const { mode } = useThemeMode();
  const { rotaData, loadingRota, handleGetMapBox } = useHookGetMapBox();
  const cameraRef = useRef<CameraRef>(null);

  const { center: cameraCenter, zoom: cameraZoom } = useMemo(
    () => getCameraFromGeometry(rotaData?.geometria),
    [rotaData?.geometria]
  );

  const handleCentralizar = useCallback(() => {
    cameraRef.current?.setCamera({
      centerCoordinate: cameraCenter,
      zoomLevel: cameraZoom,
      animationDuration: CAMERA_ANIMATION_MS,
    });
  }, [cameraCenter, cameraZoom]);

  useEffect(() => {
    if (!visible) return;
    const destino = rotaSimples
      ? enderecoDestino
      : `${nomeEmpresa}, ${enderecoDestino}`;
    handleGetMapBox(enderecoCarga, destino, { rotaSimples });
  }, [visible, enderecoCarga, enderecoDestino, nomeEmpresa, rotaSimples, handleGetMapBox]);

  const corTema = mode === 'dark' ? '#74AEF1' : '#3498db';

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

          <View className="h-[250px] w-full relative">
            <Mapbox.MapView style={{ flex: 1 }} styleURL={Mapbox.StyleURL.SatelliteStreet}>
              <Mapbox.Camera
                ref={cameraRef}
                zoomLevel={cameraZoom}
                centerCoordinate={cameraCenter}
                animationDuration={CAMERA_ANIMATION_MS}
              />

              {rotaData?.geometria?.coordinates?.length ? (
                <Mapbox.ShapeSource
                  id="rotaSource"
                  shape={{
                    type: 'LineString',
                    coordinates: rotaData.geometria.coordinates,
                  }}
                >
                  <Mapbox.LineLayer id="rotaLinha" style={ROTA_LINE_STYLE} />
                </Mapbox.ShapeSource>
              ) : null}

              {rotaData?.trecho_ate_carga != null &&
                rotaData?.geometria?.coordinates?.[0] && (
                  <Mapbox.PointAnnotation
                    id="marker-voce"
                    coordinate={rotaData.geometria.coordinates[0]}
                    title="Você está aqui"
                  >
                    <View className="w-6 h-6 rounded-full border-[3px] border-white bg-lightBgOctonary" />
                  </Mapbox.PointAnnotation>
                )}

              {rotaData?.coords_carga && (
                <Mapbox.PointAnnotation
                  id="marker-carga"
                  coordinate={rotaData.coords_carga}
                  title="Carga"
                >
                  <View className="w-6 h-6 rounded-full border-[3px] border-white bg-amber-500" />
                </Mapbox.PointAnnotation>
              )}

              {rotaData?.coords_destino && (
                <Mapbox.PointAnnotation
                  id="marker-destino"
                  coordinate={rotaData.coords_destino}
                  title="Destino"
                >
                  <View className="w-6 h-6 rounded-full border-[3px] border-white bg-red-500" />
                </Mapbox.PointAnnotation>
              )}
            </Mapbox.MapView>

            <TouchableOpacity
              className="absolute top-2.5 right-2.5 flex-row items-center gap-1.5 bg-white dark:bg-darkBgTertiary py-2 px-3 rounded-xl border border-gray-200 dark:border-darkBgNonary shadow shadow-black/20"
              onPress={handleCentralizar}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Centralizar mapa na rota"
            >
              <Ionicons name="locate" size={24} color={corTema} />
              <Text className="text-sm font-semibold text-lightText dark:text-darkText">
                Centralizar
              </Text>
            </TouchableOpacity>
          </View>

          <View className="p-5">
            <Text className="text-base font-bold mb-4 text-lightText dark:text-darkText">
              Mais Detalhes
            </Text>

            {loadingRota ? (
              <View className="my-5">
                <ActivityIndicator size="large" color={corTema} />
              </View>
            ) : (
              <>
                <DetailRow
                  label="Distância total"
                  value={
                    rotaData?.distancia_total_km != null
                      ? `${rotaData.distancia_total_km.toFixed(1)} km`
                      : '—'
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
              </>
            )}
          </View>
        </View>
      </animation.FadeDown>
    </Modal>
  );
}
