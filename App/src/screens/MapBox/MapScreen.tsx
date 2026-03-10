import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";

import Mapbox from "@rnmapbox/maps";
import { Ionicons } from "@expo/vector-icons";

import { useThemeMode, useThemeColors, useIconColor } from "@/src/context/ThemeContext";
import { getMapStyleURL, CAMERA_ANIMATION_MS, THEME_COLORS } from "@/src/config/mapbox";
import {
	getCurrentCoordinates,
	requestLocationPermission,
	type Coordinates,
} from "@/src/services/location";
import { useGetFreightUser } from "@/src/hooks/freight/useGetFreightUser";
import { CardFreight } from "@/src/components/cards/CardFreight";
import { IconBox } from "@/src/components/ui/IconBox";

const DEFAULT_CENTER: [number, number] = [-47.9292, -15.7801]; // Brasília
const DEFAULT_ZOOM = 12;
const USER_ZOOM = 15;

type CameraRef = React.ComponentRef<typeof Mapbox.Camera>;

export default function MapScreen() {
	const { mode } = useThemeMode();
	const colors = useThemeColors();	
	const iconColor = useIconColor();
	const headerHeight = useHeaderHeight();
	const [coords, setCoords] = useState<Coordinates | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [cardFreightVisible, setCardFreightVisible] = useState(true);
	const [currentZoom, setCurrentZoom] = useState(USER_ZOOM);
	const cameraRef = useRef<CameraRef>(null);

	const { freightUser, handleGetFreightUser } = useGetFreightUser();
	const themeColor = mode === "dark" ? THEME_COLORS.dark : THEME_COLORS.light;

	const styleURL = getMapStyleURL(mode === "dark");
	const center: [number, number] = coords
		? [coords.longitude, coords.latitude]
		: DEFAULT_CENTER;
	const zoom = coords ? USER_ZOOM : DEFAULT_ZOOM;

	const loadLocation = useCallback(async () => {
		setLoading(true);
		setError(false);
		try {
			const granted = await requestLocationPermission();
			if (granted !== "granted") {
				setError(true);
				setCoords(null);
				return;
			}
			const position = await getCurrentCoordinates();
			setCoords(position ?? null);
			if (!position) setError(true);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadLocation();
		handleGetFreightUser();
	}, [loadLocation, handleGetFreightUser]);

	useEffect(() => {
		if (!loading) setCurrentZoom(zoom);
	}, [loading]);

	const handleCentralizarMinhaLocalizacao = useCallback(() => {
		if (!coords) return;
		setCurrentZoom(USER_ZOOM);
		cameraRef.current?.setCamera({
			centerCoordinate: [coords.longitude, coords.latitude],
			zoomLevel: USER_ZOOM,
			animationDuration: CAMERA_ANIMATION_MS,
		});
	}, [coords]);

	const handleZoomIn = useCallback(() => {
		const next = Math.min((currentZoom ?? zoom) + 1, 20);
		setCurrentZoom(next);
		cameraRef.current?.setCamera({
			zoomLevel: next,
			animationDuration: CAMERA_ANIMATION_MS,
		});
	}, [currentZoom, zoom]);

	const handleZoomOut = useCallback(() => {
		const next = Math.max((currentZoom ?? zoom) - 1, 2);
		setCurrentZoom(next);
		cameraRef.current?.setCamera({
			zoomLevel: next,
			animationDuration: CAMERA_ANIMATION_MS,
		});
	}, [currentZoom, zoom]);

	const buttonClass = "p-2.5 rounded-xl border flex-row items-center gap-2";
	const buttonStyle = { backgroundColor: colors.bgTertiary, borderColor: colors.bgNonary };

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<View className="flex-1">
			<Mapbox.MapView style={{ flex: 1 }} styleURL={styleURL}>
				<Mapbox.Camera
					ref={cameraRef}
					centerCoordinate={center}
					zoomLevel={zoom}
					animationDuration={CAMERA_ANIMATION_MS}
				/>
				<Mapbox.UserLocation visible={!error} />
			</Mapbox.MapView>

			<SafeAreaView
				className="absolute top-0 left-0 right-0 flex-row items-center justify-end gap-2 px-4 z-10 pt-4"
				edges={[]}
				pointerEvents="box-none"
			>
				<TouchableOpacity
					onPress={handleZoomIn}
					accessibilityRole="button"
					accessibilityLabel="Aumentar zoom"
					className="w-11 h-11 rounded-xl border items-center justify-center"
					style={{ backgroundColor: colors.bg, borderColor: colors.bgNonary, borderWidth: 1 }}
				>
					<Ionicons name="add" size={24} color={iconColor} />
				</TouchableOpacity>
				<TouchableOpacity
					className="w-11 h-11 rounded-xl border items-center justify-center"
					style={{ backgroundColor: colors.bg, borderColor: colors.bgNonary, borderWidth: 1 }}
					onPress={handleZoomOut}
					accessibilityRole="button"
					accessibilityLabel="Diminuir zoom"
				>
					<Ionicons name="remove" size={24} color={iconColor} />
				</TouchableOpacity>
				<TouchableOpacity
					className="w-11 h-11 rounded-xl border items-center justify-center"
					style={{ backgroundColor: colors.bg, borderColor: colors.bgNonary, borderWidth: 1 }}
					onPress={handleCentralizarMinhaLocalizacao}
					accessibilityRole="button"
					accessibilityLabel="Centralizar na minha localização"
				>
					<Ionicons name="locate" size={22} color={iconColor} />
				</TouchableOpacity>
			</SafeAreaView>

			{/* Card do frete — toggle mostrar/esconder */}
			<SafeAreaView
				className="absolute bottom-0 left-0 right-0 px-4 pb-2 z-10"
				edges={["bottom"]}
				pointerEvents="box-none"
			>
				<TouchableOpacity
					className="flex-row items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl border mb-2"
					style={{ backgroundColor: colors.bg, borderColor: colors.bgNonary, borderWidth: 1 }}
					onPress={() => setCardFreightVisible((v) => !v)}
					accessibilityRole="button"
					accessibilityLabel={cardFreightVisible ? "Esconder card do frete" : "Mostrar card do frete"}
				>
					<Ionicons
						name={cardFreightVisible ? "chevron-down" : "chevron-up"}
						size={20}
						color={iconColor}
					/>
				</TouchableOpacity>
				{cardFreightVisible && (
					<View className="w-full rounded-2xl overflow-hidden" style={{ backgroundColor: colors.bg, borderColor: colors.bgNonary, borderWidth: 1 }}>
						<CardFreight freight={freightUser} />
					</View>
				)}
			</SafeAreaView>
		</View>
	);
}
