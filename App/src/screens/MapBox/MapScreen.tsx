import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Mapbox, { UserTrackingMode, type MapState } from "@rnmapbox/maps";
import { Ionicons } from "@expo/vector-icons";

import { useThemeMode, useThemeColors, useIconColor } from "@/src/context/ThemeContext";
import {
	getMapStyleURL,
	CAMERA_ANIMATION_MS,
	THEME_COLORS,
} from "@/src/config/mapbox";
import {
	NAV_OFF_ROUTE_CONSECUTIVE_UPDATES,
	NAV_OFF_ROUTE_THRESHOLD_M,
	NAV_REROUTE_COOLDOWN_MS,
	NAV_REROUTE_MIN_MOVE_M,
	NAV_SNAP_MAX_DISTANCE_M,
} from "@/src/config/navigation";
import {
	getCurrentCoordinates,
	requestLocationPermission,
	startNavigationLocationWatch,
	type Coordinates,
} from "@/src/services/location";
import { useGetFreightUser } from "@/src/hooks/freight/useGetFreightUser";
import { useGetMapBox } from "@/src/hooks/freight/useGetMapBox";
import { getCameraFromGeometry } from "@/src/utils/mapboxUtils";
import {
	clampMonotonicProgress,
	haversineMeters,
	polylineLengthMeters,
	projectUserOntoPolyline,
	splitRouteAtDistance,
	type LngLat,
} from "@/src/utils/routeProgress";
import { buildGoogleMapsDirectionsUrl, isUsableGps } from "@/src/utils/googleMapsDirections";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/routes/Routes";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";

const DEFAULT_CENTER: [number, number] = [-47.9292, -15.7801]; // Brasília
const DEFAULT_ZOOM = 12;
const USER_ZOOM = 15;
const NAV_ZOOM = 16;

/** Com follow ativo, o puck fica no centro da área útil (mapa menos os insets). Mais paddingTop / menos paddingBottom desce o puck na tela. */
const MAP_EDGE_PADDING_IDLE = {
	paddingTop: 120,
	paddingBottom: 100,
	paddingLeft: 20,
	paddingRight: 20,
} as const;

const MAP_EDGE_PADDING_NAV_FOLLOW = {
	paddingTop: 320,
	paddingBottom: 100,
	paddingLeft: 20,
	paddingRight: 20,
} as const;

function formatDriveDuration(totalMin: number): string {
	if (!Number.isFinite(totalMin) || totalMin < 0) return "—";
	if (totalMin < 60) return `${Math.max(1, Math.round(totalMin))} min`;
	const h = Math.floor(totalMin / 60);
	const m = Math.round(totalMin % 60);
	return `${h}h ${m.toString().padStart(2, "0")}min`;
}

function formatChegadaClock(totalMin: number): string {
	const d = new Date(Date.now() + totalMin * 60_000);
	return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function maneuverIconName(
	mod?: string | null,
	tipo?: string | null,
): React.ComponentProps<typeof Ionicons>["name"] {
	const raw = `${mod ?? ""} ${tipo ?? ""}`.toLowerCase();
	if (raw.includes("uturn") || raw.includes("u-turn")) return "return-up-back";
	if (raw.includes("sharp left") || raw.includes("hard left")) return "arrow-undo";
	if (raw.includes("slight left") || raw.includes("merge left")) return "arrow-back-outline";
	if (raw.includes("left")) return "arrow-back";
	if (raw.includes("sharp right") || raw.includes("hard right")) return "arrow-redo";
	if (raw.includes("slight right") || raw.includes("merge right")) return "arrow-forward-outline";
	if (raw.includes("right")) return "arrow-forward";
	if (raw.includes("roundabout") || raw.includes("rotat")) return "sync";
	if (raw.includes("arrive")) return "flag";
	return "arrow-up";
}

function boundsFromLineString(coords: [number, number][]): { ne: [number, number]; sw: [number, number] } {
	let minLng = coords[0][0];
	let maxLng = coords[0][0];
	let minLat = coords[0][1];
	let maxLat = coords[0][1];
	for (const [lng, lat] of coords) {
		minLng = Math.min(minLng, lng);
		maxLng = Math.max(maxLng, lng);
		minLat = Math.min(minLat, lat);
		maxLat = Math.max(maxLat, lat);
	}
	const p = 0.006;
	return { ne: [maxLng + p, maxLat + p], sw: [minLng - p, minLat - p] };
}

type CameraRef = React.ComponentRef<typeof Mapbox.Camera>;
type NavState = "idle" | "running" | "paused";

export default function MapScreen() {
	const { mode } = useThemeMode();
	const { t } = useTranslation();
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { notify } = useAlertDefault();
	const colors = useThemeColors();
	const iconColor = useIconColor();
	const [coords, setCoords] = useState<Coordinates | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [currentZoom, setCurrentZoom] = useState(USER_ZOOM);
	const [navState, setNavState] = useState<NavState>("idle");
	const [navFollowUser, setNavFollowUser] = useState(true);
	const [navigationCoords, setNavigationCoords] = useState<Coordinates | null>(null);
	const [routeProgressAlongM, setRouteProgressAlongM] = useState(0);
	const cameraRef = useRef<CameraRef>(null);
	const lastFittedGeometryRef = useRef<string | null>(null);
	const offRouteStreakRef = useRef(0);
	const lastRerouteAtRef = useRef(0);
	const lastRerouteCoordsRef = useRef<LngLat | null>(null);
	const rerouteInFlightRef = useRef(false);
	const prevGeometrySigRef = useRef<string | null>(null);
	/** Evita desligar o follow logo após animação programática da câmera (gesto “fantasma”). */
	const ignoreMapGestureUnfollowUntilRef = useRef(0);

	const { freightUser, handleGetFreightUser } = useGetFreightUser();
	const {
		rotaData,
		loadingRota,
		rotaErro,
		handleGetMapBox,
		recalculateFromDriverLocation,
		clearRota,
	} = useGetMapBox();
	const themeColor = mode === "dark" ? THEME_COLORS.dark : THEME_COLORS.light;

	const isNavActive = navState === "running" || navState === "paused";

	const activeCoords = useMemo((): Coordinates | null => {
		if (navState === "running" || navState === "paused") {
			return navigationCoords ?? coords;
		}
		return coords;
	}, [navState, navigationCoords, coords]);

	const followUserActive =
		navState === "running" && Boolean(activeCoords && !error && navFollowUser);

	const styleURL = useMemo(() => {
		if (isNavActive) return Mapbox.StyleURL.Dark;
		return getMapStyleURL(mode === "dark");
	}, [isNavActive, mode]);
	const center: [number, number] = activeCoords
		? [activeCoords.longitude, activeCoords.latitude]
		: coords
			? [coords.longitude, coords.latitude]
			: DEFAULT_CENTER;
	const zoom = coords ? USER_ZOOM : DEFAULT_ZOOM;

	const hasFreightRoute = Boolean(
		freightUser?.origin_label?.trim() && freightUser?.destination_label?.trim(),
	);

	const routeSummary = useMemo(() => {
		if (hasFreightRoute && freightUser) {
			return {
				origem: freightUser.origin_label,
				destino: freightUser.destination_label,
			};
		}
		return { origem: "—", destino: "—" };
	}, [hasFreightRoute, freightUser]);

	const destinationLabelForGoogle = freightUser?.destination_label?.trim() ?? "";
	const stopLabelForGoogle = freightUser?.origin_label?.trim() ?? "";
	const canOpenGoogleMaps = Boolean(destinationLabelForGoogle);

	const openGoogleMapsFromMap = useCallback(async () => {
		if (!destinationLabelForGoogle) return;
		let origin: Coordinates | null =
			coords && !error && isUsableGps(coords) ? coords : null;
		if (!origin) {
			try {
				const pos = await getCurrentCoordinates();
				if (pos && isUsableGps(pos)) origin = pos;
			} catch {
				/* Google Maps usa posição atual se não houver origem */
			}
		}
		const url = buildGoogleMapsDirectionsUrl({
			origin,
			waypointLabel: stopLabelForGoogle,
			destinationLabel: destinationLabelForGoogle,
		});
		try {
			await Linking.openURL(url);
		} catch {
			await notify({ status: "error", message: t("FREIGHT.OPENGOOGLEMAPS_ERROR") });
		}
	}, [coords, destinationLabelForGoogle, error, notify, stopLabelForGoogle, t]);

	const goToFreightDetailsTab = useCallback(() => {
		navigation.navigate("Home", { screen: "AndamentoTab" });
	}, [navigation]);

	const lineCoordinates = rotaData?.geometria?.coordinates;

	const routeCenterZoom = useMemo(() => {
		if (!lineCoordinates?.length) return null;
		return getCameraFromGeometry({ coordinates: lineCoordinates });
	}, [lineCoordinates]);

	const instrucaoTopo = useMemo(() => {
		if (rotaData?.proxima_instrucao?.trim()) return rotaData.proxima_instrucao.trim();
		const dest = routeSummary.destino;
		return dest && dest !== "—" ? `Em direção a ${dest}` : "Siga na rota";
	}, [rotaData?.proxima_instrucao, routeSummary.destino]);

	const iconeManobra = useMemo(
		() => maneuverIconName(rotaData?.manobra_modificador, rotaData?.manobra_tipo),
		[rotaData?.manobra_modificador, rotaData?.manobra_tipo],
	);

	const routeGlowLayerStyle = useMemo(
		() => ({
			lineColor: colors.bgOctonary,
			lineWidth: 14,
			lineOpacity: isNavActive ? 0.28 : 0,
			lineCap: "round" as const,
			lineJoin: "round" as const,
		}),
		[colors.bgOctonary, isNavActive],
	);

	const routeLineLayerStyle = useMemo(
		() => ({
			lineColor: colors.bgOctonary,
			lineWidth: isNavActive ? 6 : 5,
			lineCap: "round" as const,
			lineJoin: "round" as const,
		}),
		[colors.bgOctonary, isNavActive],
	);

	const routeCompletedLayerStyle = useMemo(
		() => ({
			lineColor: colors.textSecondary,
			lineWidth: 5,
			lineOpacity: 0.38,
			lineCap: "round" as const,
			lineJoin: "round" as const,
		}),
		[colors.textSecondary],
	);

	const routeLngLat = useMemo((): LngLat[] => {
		if (!Array.isArray(lineCoordinates) || !lineCoordinates.length) return [];
		return lineCoordinates as LngLat[];
	}, [lineCoordinates]);

	const isDriverOnRoute = useMemo(() => {
		if (navState !== "running" || !routeLngLat.length) return false;
		const user = navigationCoords ?? coords;
		if (!user) return false;
		const projection = projectUserOntoPolyline(
			user.latitude,
			user.longitude,
			routeLngLat,
		);
		return projection.distanceToRouteMeters <= NAV_OFF_ROUTE_THRESHOLD_M;
	}, [navState, routeLngLat, navigationCoords, coords]);

	const shouldUseCarPuck = navState === "running" && isDriverOnRoute;

	const totalRouteMeters = useMemo(() => polylineLengthMeters(routeLngLat), [routeLngLat]);

	const { completedRouteCoords, remainingRouteCoords } = useMemo(() => {
		if (!routeLngLat.length) {
			return { completedRouteCoords: [] as LngLat[], remainingRouteCoords: [] as LngLat[] };
		}
		if (!isNavActive || routeProgressAlongM < 1) {
			return { completedRouteCoords: [] as LngLat[], remainingRouteCoords: routeLngLat };
		}
		const split = splitRouteAtDistance(routeLngLat, routeProgressAlongM);
		const remaining =
			split.remaining.length >= 2 ? split.remaining : routeLngLat;
		return {
			completedRouteCoords: split.completed.length >= 2 ? split.completed : ([] as LngLat[]),
			remainingRouteCoords: remaining,
		};
	}, [routeLngLat, isNavActive, routeProgressAlongM]);

	const remainingRouteFraction = useMemo(() => {
		if (!isNavActive || totalRouteMeters < 5) return 1;
		return Math.max(0, Math.min(1, 1 - routeProgressAlongM / totalRouteMeters));
	}, [isNavActive, totalRouteMeters, routeProgressAlongM]);

	const displayTempoTotalMin = useMemo(() => {
		const base = rotaData?.tempo_total_min;
		if (!Number.isFinite(base) || base == null) return 0;
		return isNavActive ? base * remainingRouteFraction : base;
	}, [rotaData?.tempo_total_min, isNavActive, remainingRouteFraction]);

	const displayDistanciaTotalKm = useMemo(() => {
		const base = rotaData?.distancia_total_km;
		if (!Number.isFinite(base) || base == null) return null;
		return isNavActive ? base * remainingRouteFraction : base;
	}, [rotaData?.distancia_total_km, isNavActive, remainingRouteFraction]);

	const geometrySignature = useMemo(
		() => (routeLngLat.length ? JSON.stringify(routeLngLat) : null),
		[routeLngLat],
	);

	const cameraCenterStatic = followUserActive
		? undefined
		: navState === "running" && !navFollowUser && routeCenterZoom?.center
			? routeCenterZoom.center
			: center;

	const cameraZoomStatic = followUserActive
		? undefined
		: navState === "running" && !navFollowUser && routeCenterZoom
			? Math.min(routeCenterZoom.zoom, 14)
			: navState === "paused" && activeCoords
				? NAV_ZOOM
				: currentZoom ?? zoom;

	const cameraPitchStatic = followUserActive ? undefined : navState === "paused" ? 42 : 0;

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
	}, [loading, zoom]);

	/** Carrega rota apenas quando há frete com origem e destino válidos. */
	useEffect(() => {
		if (loading) return;

		if (hasFreightRoute && freightUser) {
			const useDriverLeg = Boolean(coords && !error);
			void handleGetMapBox(freightUser.origin_label, freightUser.destination_label, {
				rotaSimples: !useDriverLeg,
			});
			return;
		}
		clearRota();
	}, [
		loading,
		hasFreightRoute,
		freightUser?.id,
		freightUser?.origin_label,
		freightUser?.destination_label,
		coords?.latitude,
		coords?.longitude,
		error,
		handleGetMapBox,
		clearRota,
	]);

	/** Nova geometria (ou primeira carga): reinicia progresso e ancora na posição atual se em navegação. */
	useEffect(() => {
		if (!geometrySignature) {
			prevGeometrySigRef.current = null;
			return;
		}
		if (prevGeometrySigRef.current === geometrySignature) return;
		prevGeometrySigRef.current = geometrySignature;
		offRouteStreakRef.current = 0;
		const user = navigationCoords ?? coords;
		if ((navState === "running" || navState === "paused") && user && routeLngLat.length) {
			const p = projectUserOntoPolyline(user.latitude, user.longitude, routeLngLat);
			setRouteProgressAlongM(p.distanceAlongMeters);
		} else {
			setRouteProgressAlongM(0);
		}
	}, [geometrySignature, routeLngLat, navState, navigationCoords, coords]);

	/** GPS contínuo só com navegação ativa (economiza bateria). */
	useEffect(() => {
		if (navState !== "running") return;
		let cancelled = false;
		let watcher: { remove: () => void } | null = null;
		void (async () => {
			const w = await startNavigationLocationWatch((c) => {
				if (!cancelled) setNavigationCoords(c);
			});
			if (!cancelled) watcher = w;
		})();
		return () => {
			cancelled = true;
			watcher?.remove();
		};
	}, [navState]);

	useEffect(() => {
		if (navState === "idle") {
			setNavigationCoords(null);
			setRouteProgressAlongM(0);
			offRouteStreakRef.current = 0;
			lastRerouteCoordsRef.current = null;
			rerouteInFlightRef.current = false;
		}
	}, [navState]);

	/** Progresso ao longo da rota + reroute por desvio (só em execução). */
	useEffect(() => {
		if (navState !== "running") return;
		const user = navigationCoords ?? coords;
		if (!user || !routeLngLat.length) return;

		const proj = projectUserOntoPolyline(user.latitude, user.longitude, routeLngLat);

		if (proj.distanceToRouteMeters > NAV_OFF_ROUTE_THRESHOLD_M) {
			offRouteStreakRef.current += 1;
			const now = Date.now();
			const canTryReroute = !loadingRota && !rerouteInFlightRef.current;
			const movedEnoughSinceLastReroute = (() => {
				if (!lastRerouteCoordsRef.current) return true;
				return (
					haversineMeters(lastRerouteCoordsRef.current, [
						user.longitude,
						user.latitude,
					]) >= NAV_REROUTE_MIN_MOVE_M
				);
			})();
			if (
				canTryReroute &&
				movedEnoughSinceLastReroute &&
				offRouteStreakRef.current >= NAV_OFF_ROUTE_CONSECUTIVE_UPDATES &&
				now - lastRerouteAtRef.current > NAV_REROUTE_COOLDOWN_MS &&
				freightUser &&
				hasFreightRoute
			) {
				lastRerouteAtRef.current = now;
				offRouteStreakRef.current = 0;
				rerouteInFlightRef.current = true;
				lastRerouteCoordsRef.current = [user.longitude, user.latitude];
				void recalculateFromDriverLocation({
					moradaDestino: freightUser.destination_label,
					coordsMotorista: user,
				}).finally(() => {
					rerouteInFlightRef.current = false;
				});
			}
			return;
		}
		offRouteStreakRef.current = 0;

		if (proj.distanceToRouteMeters > NAV_SNAP_MAX_DISTANCE_M) return;

		setRouteProgressAlongM((prev) =>
			clampMonotonicProgress(prev, proj.distanceAlongMeters),
		);
	}, [
		navState,
		navigationCoords,
		coords,
		routeLngLat,
		freightUser,
		hasFreightRoute,
		loadingRota,
		recalculateFromDriverLocation,
	]);

	/** Em modo idle, enquadra a rota quando a geometria muda ou ao sair da navegação. */
	useEffect(() => {
		if (navState !== "idle") return;
		const coordsList = rotaData?.geometria?.coordinates;
		const geom = rotaData?.geometria;
		if (!geom || !coordsList?.length) {
			lastFittedGeometryRef.current = null;
			return;
		}
		const signature = JSON.stringify(coordsList);
		if (lastFittedGeometryRef.current === signature) return;
		lastFittedGeometryRef.current = signature;
		const { center: c, zoom: z } = getCameraFromGeometry(geom);
		setCurrentZoom(z);
		cameraRef.current?.setCamera({
			centerCoordinate: c,
			zoomLevel: z,
			animationDuration: CAMERA_ANIMATION_MS,
		});
	}, [rotaData?.geometria, navState]);

	const handleCentralizarMinhaLocalizacao = useCallback(() => {
		if (isNavActive) setNavFollowUser(true);
		if (!activeCoords) return;
		setCurrentZoom(USER_ZOOM);
		cameraRef.current?.setCamera({
			centerCoordinate: [activeCoords.longitude, activeCoords.latitude],
			zoomLevel: USER_ZOOM,
			animationDuration: CAMERA_ANIMATION_MS,
			...(isNavActive ? { padding: { ...MAP_EDGE_PADDING_NAV_FOLLOW } } : {}),
		});
	}, [activeCoords, isNavActive]);

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

	const handleIniciarNavegacao = useCallback(() => {
		if (!rotaData || loadingRota) return;
		setNavFollowUser(true);
		if (coords && !error && lineCoordinates?.length) {
			const p = projectUserOntoPolyline(
				coords.latitude,
				coords.longitude,
				lineCoordinates as LngLat[],
			);
			if (p.distanceToRouteMeters <= NAV_SNAP_MAX_DISTANCE_M + 80) {
				setRouteProgressAlongM(p.distanceAlongMeters);
			}
		}
		setNavState("running");
		if (coords && !error) {
			ignoreMapGestureUnfollowUntilRef.current = Date.now() + 1200;
			setCurrentZoom(NAV_ZOOM);
			cameraRef.current?.setCamera({
				centerCoordinate: [coords.longitude, coords.latitude],
				zoomLevel: NAV_ZOOM,
				padding: { ...MAP_EDGE_PADDING_NAV_FOLLOW },
				animationDuration: CAMERA_ANIMATION_MS,
			});
		} else if (rotaData.geometria) {
			const { center: c, zoom: z } = getCameraFromGeometry(rotaData.geometria);
			setCurrentZoom(z);
			cameraRef.current?.setCamera({
				centerCoordinate: c,
				zoomLevel: z,
				animationDuration: CAMERA_ANIMATION_MS,
			});
		}
	}, [rotaData, loadingRota, coords, error, lineCoordinates]);

	const handleVerRotaCompleta = useCallback(() => {
		if (!lineCoordinates?.length) return;
		setNavFollowUser(false);
		const b = boundsFromLineString(lineCoordinates as [number, number][]);
		cameraRef.current?.setCamera({
			bounds: b,
			padding: {
				paddingTop: 120,
				paddingBottom: 220,
				paddingLeft: 32,
				paddingRight: 32,
			},
			pitch: 0,
			animationDuration: 700,
		});
	}, [lineCoordinates]);

	const applyFollowVehicleCamera = useCallback(() => {
		if (!activeCoords) return;
		ignoreMapGestureUnfollowUntilRef.current = Date.now() + 900;
		setCurrentZoom(NAV_ZOOM);
		cameraRef.current?.setCamera({
			centerCoordinate: [activeCoords.longitude, activeCoords.latitude],
			zoomLevel: NAV_ZOOM,
			pitch: shouldUseCarPuck ? 55 : 0,
			padding: { ...MAP_EDGE_PADDING_NAV_FOLLOW },
			animationDuration: CAMERA_ANIMATION_MS,
		});
	}, [activeCoords, shouldUseCarPuck]);

	const handleMapCameraChanged = useCallback(
		(state: MapState) => {
			if (navState !== "running") return;
			if (Date.now() < ignoreMapGestureUnfollowUntilRef.current) return;
			if (!state.gestures?.isGestureActive) return;
			setNavFollowUser((prev) => (prev ? false : prev));
		},
		[navState],
	);

	const handlePausarOuContinuar = useCallback(() => {
		if (navState === "running") {
			setNavFollowUser(false);
			setNavState("paused");
			return;
		}
		if (navState === "paused") {
			ignoreMapGestureUnfollowUntilRef.current = Date.now() + 600;
			setNavFollowUser(true);
			setNavState("running");
		}
	}, [navState]);

	const handleAlternarModoNavegacao = useCallback(() => {
		if (navState !== "running") return;
		setNavFollowUser((previous) => {
			const next = !previous;
			if (next) {
				applyFollowVehicleCamera();
			} else {
				cameraRef.current?.setCamera({
					pitch: 0,
					animationDuration: CAMERA_ANIMATION_MS,
				});
			}
			return next;
		});
	}, [navState, applyFollowVehicleCamera]);

	const handleCancelarNavegacao = useCallback(() => {
		setNavState("idle");
		setNavFollowUser(true);
		if (rotaData?.geometria) {
			const { center: c, zoom: z } = getCameraFromGeometry(rotaData.geometria);
			setCurrentZoom(z);
			cameraRef.current?.setCamera({
				centerCoordinate: c,
				zoomLevel: z,
				pitch: 0,
				animationDuration: CAMERA_ANIMATION_MS,
			});
		}
	}, [rotaData]);

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<View className="flex-1">
			<Mapbox.MapView
				style={{ flex: 1 }}
				styleURL={styleURL}
				onCameraChanged={handleMapCameraChanged}
			>
				<Mapbox.Camera
					ref={cameraRef}
					animationMode="easeTo"
					animationDuration={CAMERA_ANIMATION_MS}
					followUserLocation={followUserActive}
					followUserMode={
						shouldUseCarPuck
							? UserTrackingMode.FollowWithCourse
							: UserTrackingMode.Follow
					}
					followZoomLevel={shouldUseCarPuck ? 17 : 16}
					followPitch={shouldUseCarPuck ? 55 : 0}
					followPadding={
						followUserActive ? MAP_EDGE_PADDING_NAV_FOLLOW : MAP_EDGE_PADDING_IDLE
					}
					centerCoordinate={cameraCenterStatic}
					zoomLevel={cameraZoomStatic}
					pitch={cameraPitchStatic}
					heading={followUserActive ? undefined : 0}
				/>
				<Mapbox.LocationPuck
					visible={!error}
					puckBearingEnabled={shouldUseCarPuck}
					puckBearing="course"
				/>

				{remainingRouteCoords.length >= 2 ? (
					<>
						{isNavActive && completedRouteCoords.length >= 2 ? (
							<Mapbox.ShapeSource
								id="rotaConcluidaSource"
								shape={{
									type: "Feature",
									properties: {},
									geometry: {
										type: "LineString",
										coordinates: completedRouteCoords,
									},
								}}
							>
								<Mapbox.LineLayer id="rotaConcluidaLinha" style={routeCompletedLayerStyle} />
							</Mapbox.ShapeSource>
						) : null}
						<Mapbox.ShapeSource
							id="rotaRestanteSource"
							shape={{
								type: "Feature",
								properties: {},
								geometry: {
									type: "LineString",
									coordinates: remainingRouteCoords,
								},
							}}
						>
							<Mapbox.LineLayer id="rotaRestanteGlow" style={routeGlowLayerStyle} />
							<Mapbox.LineLayer id="rotaRestanteLinha" style={routeLineLayerStyle} />
						</Mapbox.ShapeSource>
					</>
				) : null}

				{!isNavActive && rotaData?.trecho_ate_carga != null && lineCoordinates?.[0] && (
					<Mapbox.PointAnnotation id="marker-inicio" coordinate={lineCoordinates[0]} title="Início">
						<Ionicons name="person" size={24} color={themeColor} />
					</Mapbox.PointAnnotation>
				)}

				{!isNavActive && rotaData?.coords_carga && (
					<Mapbox.PointAnnotation id="marker-carga" coordinate={rotaData.coords_carga} title="Origem / carga">
						<Ionicons name={hasFreightRoute ? "cube" : "navigate"} size={24} color={themeColor} />
					</Mapbox.PointAnnotation>
				)}

				{rotaData?.coords_destino && (
					<Mapbox.PointAnnotation id="marker-destino" coordinate={rotaData.coords_destino} title="Destino">
						<Ionicons name="flag" size={26} color={isNavActive ? colors.bgOctonary : themeColor} />
					</Mapbox.PointAnnotation>
				)}
			</Mapbox.MapView>

			{loadingRota ? (
				<View
					className="absolute left-4 z-20 rounded-xl border px-3 py-2 flex-row items-center gap-2"
					style={{ top: 56, backgroundColor: colors.bg, borderColor: colors.bgNonary, borderWidth: 1 }}
					pointerEvents="none"
				>
					<ActivityIndicator size="small" color={iconColor} />
					<Text className="text-sm" style={{ color: colors.textSecondary }}>
						Calculando rota…
					</Text>
				</View>
			) : null}

			{rotaErro && !loadingRota ? (
				<View
					className="absolute left-4 right-4 z-20 rounded-xl border px-3 py-2.5"
					style={{ top: isNavActive ? 120 : 56, backgroundColor: colors.bg, borderColor: "#c0392b", borderWidth: 1 }}
				>
					<Text className="text-sm font-medium" style={{ color: colors.text }}>
						{rotaErro}
					</Text>
				</View>
			) : null}

			{isNavActive && rotaData ? (
				<SafeAreaView
					edges={["top"]}
					className="absolute top-0 left-0 right-0 z-30 border-b"
					style={{
						backgroundColor: colors.bgSecondary,
						borderBottomColor: colors.bgNonary,
						borderBottomWidth: 1,
					}}
					pointerEvents="box-none"
				>
					<View className="flex-row items-center px-3 py-3 gap-3">
						<Ionicons name={iconeManobra} size={32} color={colors.bgOctonary} />
						<Text
							className="flex-1 text-base leading-snug font-medium"
							style={{ color: colors.text }}
							numberOfLines={3}
						>
							{instrucaoTopo}
						</Text>
					</View>
				</SafeAreaView>
			) : null}

			<SafeAreaView
				className={`absolute left-0 right-0 flex-row items-center justify-end gap-2 px-4 z-20 ${isNavActive ? "top-32 pt-1" : "top-0 pt-4"}`}
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
				{navState === "running" ? (
					<TouchableOpacity
						className="h-11 rounded-xl border items-center justify-center px-3"
						style={{ backgroundColor: colors.bg, borderColor: colors.bgNonary, borderWidth: 1 }}
						onPress={handleAlternarModoNavegacao}
						accessibilityRole="button"
						accessibilityLabel={
							navFollowUser ? "Ativar navegação livre" : "Vincular mapa ao carro"
						}
					>
						<Text className="text-xs font-semibold" style={{ color: navFollowUser ? colors.textSecondary : colors.bgOctonary }}>
							{navFollowUser ? "Livre" : "Carro"}
						</Text>
					</TouchableOpacity>
				) : null}
			</SafeAreaView>

			<SafeAreaView
				className={`absolute bottom-0 left-0 right-0 z-10 gap-2 ${isNavActive ? "px-2 pb-3 pt-1" : "px-3 pb-2"}`}
				edges={["bottom"]}
				pointerEvents="box-none"
			>
				{rotaData && !isNavActive ? (
					<View
						className="w-full rounded-3xl border overflow-hidden p-4 mb-1"
						style={{
							backgroundColor: colors.bg,
							borderColor: colors.bgNonary,
							borderWidth: 1,
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.12,
							shadowRadius: 8,
							elevation: 6,
						}}
					>
						<Text className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: colors.textSecondary }}>
							Prévia da rota
						</Text>
						<Text className="text-sm leading-5" style={{ color: colors.text }} numberOfLines={2}>
							{routeSummary.origem} → {routeSummary.destino}
						</Text>
						{rotaData.trecho_ate_carga != null ? (
							<View
								className="mt-3 rounded-xl px-3 py-2.5"
								style={{ backgroundColor: colors.bgSecondary }}
							>
								<Text
									className="text-xs font-semibold uppercase tracking-wide"
									style={{ color: colors.textSecondary }}
								>
									Até a saída (coleta)
								</Text>
								<Text className="text-base font-semibold mt-1" style={{ color: colors.text }}>
									{rotaData.trecho_ate_carga.distancia_km.toFixed(1)} km · ~
									{Math.round(rotaData.trecho_ate_carga.tempo_min)} min
								</Text>
								<Text className="text-xs mt-1" style={{ color: colors.textSecondary }}>
									Da sua posição até o ponto de embarque do frete
								</Text>
							</View>
						) : null}
						<View
							className="mt-3 flex-row items-center justify-between px-1 pt-3"
							style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.bgNonary }}
						>
							<View className="flex-1 items-center">
								<Text className="text-xs" style={{ color: colors.textSecondary }}>
									Distância
								</Text>
								<Text className="text-xl font-semibold mt-1" style={{ color: colors.text }}>
									{rotaData.distancia_total_km != null
										? `${rotaData.distancia_total_km.toFixed(1)} km`
										: "—"}
								</Text>
							</View>
							<View style={{ width: StyleSheet.hairlineWidth, height: 44, backgroundColor: colors.bgNonary }} />
							<View className="flex-1 items-center">
								<Text className="text-xs" style={{ color: colors.textSecondary }}>
									Tempo estimado
								</Text>
								<Text className="text-xl font-semibold mt-1" style={{ color: colors.text }}>
									{rotaData.tempo_total_min != null
										? `~${Math.round(rotaData.tempo_total_min)} min`
										: "—"}
								</Text>
							</View>
						</View>

						<View className="mt-4">
							<TouchableOpacity
								className="w-full py-3.5 rounded-2xl items-center"
								style={{
									backgroundColor: colors.bgOctonary,
									opacity: !rotaData || loadingRota ? 0.45 : 1,
								}}
								disabled={!rotaData || loadingRota}
								onPress={handleIniciarNavegacao}
								accessibilityRole="button"
								accessibilityLabel="Iniciar navegação"
							>
								<Text className="text-base font-semibold" style={{ color: "#FFFFFF" }}>
									Iniciar navegação
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				) : null}

				{rotaData && isNavActive ? (
					<View
						className="w-full overflow-hidden rounded-3xl px-3 pt-4 pb-3"
						style={{
							backgroundColor: colors.bgSecondary,
							borderWidth: 1,
							borderColor: colors.bgNonary,
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 4 },
							shadowOpacity: 0.22,
							shadowRadius: 12,
							elevation: 12,
						}}
					>
						<View className="flex-row items-center justify-between">
							<TouchableOpacity
								onPress={handleCancelarNavegacao}
								className="h-12 w-12 shrink-0 rounded-full items-center justify-center"
								style={{ backgroundColor: colors.bgTertiary }}
								accessibilityRole="button"
								accessibilityLabel="Encerrar navegação"
							>
								<Ionicons name="close" size={24} color={colors.text} />
							</TouchableOpacity>
							<View className="min-w-0 flex-1 items-center px-2">
								<Text
									className="text-center text-3xl font-bold"
									style={{ color: colors.text }}
									numberOfLines={1}
									adjustsFontSizeToFit
									minimumFontScale={0.65}
								>
									{formatDriveDuration(displayTempoTotalMin ?? 0)}
								</Text>
								<Text
									className="mt-1.5 text-center text-sm"
									style={{ color: colors.textSecondary }}
									numberOfLines={1}
								>
									{displayDistanciaTotalKm != null
										? `${Math.round(displayDistanciaTotalKm)} km`
										: "—"}{" "}
									· {formatChegadaClock(displayTempoTotalMin ?? 0)}
								</Text>
							</View>
							<TouchableOpacity
								onPress={handleVerRotaCompleta}
								className="h-12 w-12 shrink-0 rounded-full items-center justify-center"
								style={{ backgroundColor: colors.bgTertiary }}
								accessibilityRole="button"
								accessibilityLabel="Ver rota completa no mapa"
							>
								<Ionicons name="map-outline" size={22} color={colors.text} />
							</TouchableOpacity>
						</View>
						<View
							className="mt-3 flex-row flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-3"
							style={{ borderTopColor: colors.bgNonary, borderTopWidth: StyleSheet.hairlineWidth }}
						>
							<TouchableOpacity onPress={handlePausarOuContinuar} accessibilityRole="button" hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}>
								<Text className="text-base font-semibold" style={{ color: colors.text }}>
									{navState === "paused" ? "Continuar" : "Pausar"}
								</Text>
							</TouchableOpacity>
							{navState === "running" ? (
								<TouchableOpacity
									onPress={handleAlternarModoNavegacao}
									accessibilityRole="button"
									hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
								>
									<Text className="text-base font-semibold" style={{ color: navFollowUser ? colors.textSecondary : colors.bgOctonary }}>
										{navFollowUser ? "Navegação livre" : "Vincular ao carro"}
									</Text>
								</TouchableOpacity>
							) : null}
						</View>
					</View>
				) : null}

				{!isNavActive ? (
					<View className="mb-2 flex-row w-full gap-2">
						<TouchableOpacity
							className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-3 px-2"
							style={{
								backgroundColor: colors.bg,
								borderColor: colors.bgNonary,
								borderWidth: 1,
								opacity: canOpenGoogleMaps ? 1 : 0.45,
							}}
							disabled={!canOpenGoogleMaps}
							onPress={openGoogleMapsFromMap}
							accessibilityRole="button"
							accessibilityLabel={t("FREIGHT.OPENGOOGLEMAPS_A11Y")}
						>
							<Ionicons name="logo-google" size={22} color={iconColor} />
							<Text className="text-base font-semibold text-center" style={{ color: colors.text }} numberOfLines={2}>
								{t("FREIGHT.OPENGOOGLEMAPS")}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-3 px-2"
							style={{ backgroundColor: colors.bg, borderColor: colors.bgNonary, borderWidth: 1 }}
							onPress={goToFreightDetailsTab}
							accessibilityRole="button"
							accessibilityLabel={t("FREIGHT.VIEW_FREIGHT_DETAILS")}
						>
							<Ionicons name="document-text-outline" size={22} color={iconColor} />
							<Text className="text-base font-semibold text-center" style={{ color: colors.text }} numberOfLines={2}>
								{t("FREIGHT.VIEW_FREIGHT_DETAILS")}
							</Text>
						</TouchableOpacity>
					</View>
				) : null}
			</SafeAreaView>

		</View>
	);
}
