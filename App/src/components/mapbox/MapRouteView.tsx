import React, { useCallback, useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";

import Mapbox from "@rnmapbox/maps";
import { Ionicons } from "@expo/vector-icons";

import {
  CAMERA_ANIMATION_MS,
  ROTA_LINE_STYLE,
  THEME_COLORS,
  getMapStyleURL,
} from "@/src/config/mapbox";
import type { MapRotaResponse } from "@/src/interfaces/mapbox";

type CameraRef = React.ComponentRef<typeof Mapbox.Camera>;

interface MapRouteViewProps {
  rotaData: MapRotaResponse | null;
  cameraCenter: [number, number];
  cameraZoom: number;
  darkMode: boolean;
}

export const MapRouteView = React.memo(function MapRouteView({
  rotaData,
  cameraCenter,
  cameraZoom,
  darkMode,
}: MapRouteViewProps) {
  const cameraRef = useRef<CameraRef>(null);
  const themeColor = darkMode ? THEME_COLORS.dark : THEME_COLORS.light;
  const styleURL = getMapStyleURL(darkMode);

  const handleCentralizar = useCallback(() => {
    cameraRef.current?.setCamera({
      centerCoordinate: cameraCenter,
      zoomLevel: cameraZoom,
      animationDuration: CAMERA_ANIMATION_MS,
    });
  }, [cameraCenter, cameraZoom]);

  const coordinates = rotaData?.geometria?.coordinates;

  return (
    <View className="h-[250px] w-full relative bg-black">
      <Mapbox.MapView style={{ flex: 1 }} styleURL={styleURL}>
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={cameraZoom}
          centerCoordinate={cameraCenter}
          animationDuration={CAMERA_ANIMATION_MS}
        />

        {coordinates?.length ? (
          <Mapbox.ShapeSource
            id="rotaSource"
            shape={{ type: "LineString", coordinates }}
          >
            <Mapbox.LineLayer id="rotaLinha" style={ROTA_LINE_STYLE} />
          </Mapbox.ShapeSource>
        ) : null}

        {rotaData?.trecho_ate_carga != null && coordinates?.[0] && (
          <Mapbox.PointAnnotation
            id="marker-voce"
            coordinate={coordinates[0]}
            title="Você está aqui"
          >
            <Ionicons name="location-outline" size={24} color={themeColor} />
          </Mapbox.PointAnnotation>
        )}

        {rotaData?.coords_carga && (
          <Mapbox.PointAnnotation
            id="marker-carga"
            coordinate={rotaData.coords_carga}
            title="Carga"
          >
            <Ionicons name="location-outline" size={24} color={themeColor} />
          </Mapbox.PointAnnotation>
        )}

        {rotaData?.coords_destino && (
          <Mapbox.PointAnnotation
            id="marker-destino"
            coordinate={rotaData.coords_destino}
            title="Destino"
          >
            <Ionicons name="location-outline" size={24} color={themeColor} />
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
        <Ionicons name="locate" size={24} color={themeColor} />
        <Text className="text-sm font-semibold text-lightText dark:text-darkText">
          Centralizar
        </Text>
      </TouchableOpacity>
    </View>
  );
});
