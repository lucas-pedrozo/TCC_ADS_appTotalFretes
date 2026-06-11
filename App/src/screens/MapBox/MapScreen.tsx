import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	View,
	ActivityIndicator,
	TouchableOpacity,
	Text,
	StyleSheet,
	Linking,
	LayoutAnimation,
	Dimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import Mapbox, { type MapState } from "@rnmapbox/maps";
import { Ionicons } from "@expo/vector-icons";
import * as turf from "@turf/turf";

import { useThemeMode, useThemeColors, useIconColor } from "@/src/context/ThemeContext";
import {
	getMapStyleURL,
	CAMERA_ANIMATION_MS,
	CAMERA_ANIMATION_MODE,
	THEME_COLORS,
	withCameraEase,
	withCameraFollow,
} from "@/src/config/mapbox";
import {
	NAV_OFF_ROUTE_CONSECUTIVE_UPDATES,
	NAV_OFF_ROUTE_THRESHOLD_M,
	NAV_REROUTE_COOLDOWN_MS,
	NAV_REROUTE_MIN_MOVE_M,
	NAV_SNAP_MAX_DISTANCE_M,
	NAV_MOVING_SPEED_THRESHOLD_KMH,
	NAV_NEAR_DESTINATION_THRESHOLD_M,
	NAV_MAP_MATCH_BACKWARD_WINDOW_M,
	NAV_MAP_MATCH_FORWARD_WINDOW_M,
	NAV_GPS_LOW_ACCURACY_M,
	NAV_GPS_DRIFT_CONNECTOR_MIN_M,
} from "@/src/config/navigation";
import {
	getCurrentCoordinates,
	requestLocationPermission,
	startCompassHeadingWatch,
	startMapPreviewLocationWatch,
	startNavigationLocationWatch,
	type Coordinates,
	type NavigationLocationUpdate,
} from "@/src/services/location";
import { setMapNavigationActive } from "@/src/services/navigationLocationSession";
import { useGetFreightUser } from "@/src/hooks/freight/useGetFreightUser";
import {
	publishDriverLocation,
	TELEMETRY_PUBLISH_INTERVAL_MS,
} from "@/src/services/telemetry";
import { useGetMapBox } from "@/src/hooks/freight/useGetMapBox";
import { useUpdateFreightStatus } from "@/src/hooks/freight/useUpdateFreightStatus";
import { buildGoogleMapsDirectionsUrl, isUsableGps } from "@/src/utils/googleMapsDirections";
import { extractCityStateFromAddressLabel } from "@/src/utils/format";
import { normalizeFreightStatusName } from "@/src/utils/freightStatus";
import { getMapControlTheme, getMapNavUI } from "@/src/utils/mapControlTheme";
import {
	bearingAlongRouteAtDistance,
	projectUserOntoRoute,
} from "@/src/utils/routeMapMatching";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/routes/Routes";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import NavigationSpeedBadge from "@/src/components/mapbox/NavigationSpeedBadge";
import NavigationRecenterButton from "@/src/components/mapbox/NavigationRecenterButton";
import NavigationRoutesButton from "@/src/components/mapbox/NavigationRoutesButton";
import MapNavigationHeader from "@/src/components/mapbox/MapNavigationHeader";
import MapNavigationBottomSheet from "@/src/components/mapbox/MapNavigationBottomSheet";
import { NavigationDriverMarker } from "@/src/components/mapbox/NavigationDriverMarker";
import { NavigationLocationPuck } from "@/src/components/mapbox/NavigationLocationPuck";
import { NavigationManeuverMarker } from "@/src/components/mapbox/NavigationManeuverMarker";
import { CardFreight } from "@/src/components/cards/CardFreight";
import { CardActivityHome } from "@/src/components/cards/CardActivityHome";

type LngLat = [number, number];

const DEFAULT_ZOOM = 12;
const USER_ZOOM = 15;
const NAV_ZOOM = 18;
const MAX_BACKWARD_PROGRESS_M = 12;
const ROUTE_VIEW_PADDING: [number, number, number, number] = [120, 32, 220, 32];

const NAV_UI_LAYOUT_ANIM = LayoutAnimation.create(
	180,
	LayoutAnimation.Types.easeInEaseOut,
	LayoutAnimation.Properties.opacity,
);
/**
 * Duração da animação de câmera ao entrar na navegação.
 * O painel de nav só aparece APÓS esse tempo, garantindo que a câmera
 * já chegou na posição certa quando o usuário vê o painel.
 */
const NAV_CAMERA_ENTER_MS = 1000;
/** Buffer extra após a câmera chegar antes de mostrar o painel (ms). */
const NAV_PANEL_DELAY_AFTER_CAMERA_MS = 120;
/** Delay total antes do painel aparecer. */
const NAV_START_TOTAL_MS = NAV_CAMERA_ENTER_MS + NAV_PANEL_DELAY_AFTER_CAMERA_MS;
const CAMERA_ZOOM_SYNC_THROTTLE_MS = 90;
const CAMERA_ZOOM_SYNC_DELTA = 0.12;
/** Recentralizar, retomar follow e transições gerais da câmera. */
const MAP_CAMERA_ANIMATION_MS = 700;
/** Follow contínuo durante a navegação (em movimento / parado). */
const NAV_CAMERA_FOLLOW_MOVING_MS = 220;
const NAV_CAMERA_FOLLOW_IDLE_MS = 420;
const NAV_CAMERA_FOLLOW_MIN_INTERVAL_MOVING_MS = 140;
const NAV_CAMERA_FOLLOW_MIN_INTERVAL_IDLE_MS = 900;
const NAV_CAMERA_FOLLOW_MIN_MOVE_M = 1.5;
/** Ver rota completa (pitch + fit bounds). */
const NAV_VIEW_FULL_ROUTE_MS = 1100;
const NAV_DEFERRED_PROJECTION_DELAY_MS = 300;
const NAV_INITIAL_PROJECTION_MAX_POINTS = 20_000;

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

const NAV_SHEET_TOP_RADIUS = 24;
const NAV_SHEET_COLLAPSED_HEIGHT = 120;
/** Ignora “gestos fantasmas” após animações programáticas da câmera ao iniciar/follow. */
const NAV_PROGRAMMATIC_CAMERA_GRACE_MS = 2800;

function formatDriveDuration(totalMin: number): string {
	if (!Number.isFinite(totalMin) || totalMin < 0) return "—";
	const rounded = Math.max(1, Math.round(totalMin));
	if (rounded < 60) return `${rounded} min`;
	const totalH = Math.floor(rounded / 60);
	const m = rounded % 60;
	if (totalH < 24) return m > 0 ? `${totalH}h ${m}min` : `${totalH}h`;
	const d = Math.floor(totalH / 24);
	const h = totalH % 24;
	if (h === 0 && m === 0) return `${d}d`;
	if (h === 0) return `${d}d ${m}min`;
	if (m === 0) return `${d}d ${h}h`;
	return `${d}d ${h}h ${m}min`;
}

function formatChegadaClock(totalMin: number): string {
	const d = new Date(Date.now() + totalMin * 60_000);
	return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function maneuverIconName(
	mod?: string | null,
	tipo?: string | null,
): React.ComponentProps<typeof Ionicons>["name"] {
	const MANEUVER_ICONS: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
		uturn: "return-up-back",
		"u-turn": "return-up-back",
		"sharp left": "arrow-undo",
		"hard left": "arrow-undo",
		"slight left": "arrow-back-outline",
		"merge left": "arrow-back-outline",
		left: "arrow-back",
		"sharp right": "arrow-redo",
		"hard right": "arrow-redo",
		"slight right": "arrow-forward-outline",
		"merge right": "arrow-forward-outline",
		right: "arrow-forward",
		roundabout: "sync",
		rotat: "sync",
		arrive: "flag",
	};
	const raw = `${mod ?? ""} ${tipo ?? ""}`.toLowerCase().trim();
	const match = Object.keys(MANEUVER_ICONS).find((k) => raw.includes(k));
	return match ? MANEUVER_ICONS[match] : "arrow-up";
}

function distanceMeters(a: LngLat, b: LngLat): number {
	return turf.distance(turf.point(a), turf.point(b), { units: "meters" });
}

function polylineLengthMeters(coords: LngLat[]): number {
	if (coords.length < 2) return 0;
	return turf.length(turf.lineString(coords), { units: "kilometers" }) * 1000;
}

function resolveSnapMaxDistanceM(accuracyM: number | null | undefined): number {
	if (accuracyM == null || !Number.isFinite(accuracyM)) return NAV_SNAP_MAX_DISTANCE_M;
	const adaptive = Math.max(
		NAV_SNAP_MAX_DISTANCE_M,
		Math.min(accuracyM * 1.1, NAV_GPS_LOW_ACCURACY_M + 10),
	);
	return Math.min(NAV_OFF_ROUTE_THRESHOLD_M - 2, adaptive);
}

function projectDriverOntoRoute(
	userLat: number,
	userLon: number,
	route: LngLat[],
	progressHintMeters: number | null | undefined,
	headingDeg: number | null | undefined,
	speedKmh: number | null | undefined,
) {
	return projectUserOntoRoute(userLat, userLon, route, {
		progressHintMeters,
		backwardWindowM: NAV_MAP_MATCH_BACKWARD_WINDOW_M,
		forwardWindowM: NAV_MAP_MATCH_FORWARD_WINDOW_M,
		headingDeg,
		speedKmh,
	});
}

function splitRouteAtDistance(route: LngLat[], distanceAlongMeters: number) {
	if (!route.length) {
		return { completed: [] as LngLat[], remaining: [] as LngLat[] };
	}
	if (route.length === 1) {
		return { completed: [...route], remaining: [] as LngLat[] };
	}

	const line = turf.lineString(route);
	const totalKm = turf.length(line, { units: "kilometers" });
	const progressKm = Math.max(0, Math.min(distanceAlongMeters / 1000, totalKm));

	const completed = turf.lineSliceAlong(line, 0, progressKm, {
		units: "kilometers",
	}).geometry.coordinates as LngLat[];
	const remaining = turf.lineSliceAlong(line, progressKm, totalKm, {
		units: "kilometers",
	}).geometry.coordinates as LngLat[];

	return { completed, remaining };
}

function clampMonotonicProgress(previousAlongMeters: number, proposedAlongMeters: number): number {
	return Math.max(previousAlongMeters - MAX_BACKWARD_PROGRESS_M, proposedAlongMeters);
}

function buildRouteSignature(route: LngLat[]): string | null {
	if (!route.length) return null;
	const first = route[0];
	const middle = route[Math.floor(route.length / 2)];
	const last = route[route.length - 1];
	return `${route.length}:${first[0].toFixed(5)},${first[1].toFixed(5)}:${middle[0].toFixed(5)},${middle[1].toFixed(5)}:${last[0].toFixed(5)},${last[1].toFixed(5)}`;
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
	const insets = useSafeAreaInsets();
	const navSheetExpandedHeight = useMemo(
		() => Dimensions.get("window").height * 0.58,
		[],
	);
	const [coords, setCoords] = useState<Coordinates | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [currentZoom, setCurrentZoom] = useState(USER_ZOOM);
	const [navState, setNavState] = useState<NavState>("idle");
	const [navFollowUser, setNavFollowUser] = useState(true);
	const [freeCompassFollow, setFreeCompassFollow] = useState(true);
	const [compassHeading, setCompassHeading] = useState<number | null>(null);
	const [navigationLocation, setNavigationLocation] = useState<NavigationLocationUpdate | null>(null);
	const navigationLocationRef = useRef<NavigationLocationUpdate | null>(null);
	const [routeProgressAlongM, setRouteProgressAlongM] = useState(0);
	const routeProgressAlongMRef = useRef(0);
	const [isStartingNav, setIsStartingNav] = useState(false);
	const [isDriverOnRoute, setIsDriverOnRoute] = useState(false);
	const [routeOverviewActive, setRouteOverviewActive] = useState(true);
	const cameraRef = useRef<CameraRef>(null);
	const startNavTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const deferredProjectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const lastZoomSyncAtRef = useRef(0);
	const lastZoomSyncedValueRef = useRef(USER_ZOOM);
	const initialCameraAppliedRef = useRef(false);
	const lastFittedGeometryRef = useRef<string | null>(null);
	const offRouteStreakRef = useRef(0);
	const lastRerouteAtRef = useRef(0);
	const lastRerouteCoordsRef = useRef<LngLat | null>(null);
	const rerouteInFlightRef = useRef(false);
	const prevGeometrySigRef = useRef<string | null>(null);
	/** Evita desligar o follow logo após animação programática da câmera (gesto “fantasma”). */
	const ignoreMapGestureUnfollowUntilRef = useRef(0);
	const hasAttemptedDeliveryStatusRef = useRef(false);
	const lastCameraFollowAtRef = useRef(0);
	const lastCameraFollowCoordsRef = useRef<Coordinates | null>(null);

	const { freightUser, handleGetFreightUser, invalidateFreightUser } = useGetFreightUser();
	const {
		rotaData,
		loadingRota,
		rotaErro,
		handleGetMapBox,
		recalculateFromDriverLocation,
		clearRota,
	} = useGetMapBox();
	const { handleUpdateFreightStatus } = useUpdateFreightStatus();
	const themeColor = mode === "dark" ? THEME_COLORS.dark : THEME_COLORS.light;

	const mapControlTheme = useMemo(() => getMapControlTheme(mode, colors), [mode, colors]);
	const navUi = useMemo(() => getMapNavUI(mode), [mode]);
	const mapButtonStyle = mapControlTheme.button;
	const mapButtonTextColor = mapControlTheme.foreground;
	const mapButtonIconColor = mapControlTheme.foreground;

	const isNavActive = navState === "running" || navState === "paused";
	const showRecenterButton = isNavActive && !navFollowUser;

	const speedKmh = navigationLocation?.speedKmh ?? null;
	const isMoving =
		isNavActive &&
		speedKmh != null &&
		Number.isFinite(speedKmh) &&
		speedKmh >= NAV_MOVING_SPEED_THRESHOLD_KMH;

	const syncCurrentZoom = useCallback((nextZoom: number, force = false) => {
		if (!Number.isFinite(nextZoom)) return;
		lastZoomSyncedValueRef.current = nextZoom;
		setCurrentZoom((prev) => {
			if (!force && Math.abs(prev - nextZoom) < 0.01) return prev;
			return nextZoom;
		});
	}, []);

	const styleURL = useMemo(() => getMapStyleURL(mode === "dark"), [mode]);
	const zoom = coords ? USER_ZOOM : DEFAULT_ZOOM;

	const hasFreightRoute = Boolean(
		freightUser?.origin_label?.trim() && freightUser?.destination_label?.trim(),
	);

	const routeSummary = useMemo(() => {
		if (hasFreightRoute && freightUser) {
			return {
				origem: extractCityStateFromAddressLabel(freightUser.origin_label, "—"),
				destino: extractCityStateFromAddressLabel(freightUser.destination_label, "—"),
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

	const instrucaoTopo = useMemo(() => {
		if (rotaData?.proxima_instrucao?.trim()) return rotaData.proxima_instrucao.trim();
		const dest = routeSummary.destino;
		return dest && dest !== "—" ? t("MAP.HEADING_TO", { dest }) : t("MAP.FOLLOW_ROUTE");
	}, [rotaData?.proxima_instrucao, routeSummary.destino, t]);

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

	const routeConnectorLayerStyle = useMemo(
		() => ({
			lineColor: "#9AA0A6",
			lineWidth: 3,
			lineOpacity: 0.9,
			lineCap: "round" as const,
			lineJoin: "round" as const,
			lineDasharray: [1.5, 2.5] as [number, number],
		}),
		[],
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

	const snappedDriverPosition = useMemo(() => {
		if (!isNavActive || !navigationLocation || !routeLngLat.length) return null;

		const snapMaxM = resolveSnapMaxDistanceM(navigationLocation.accuracyM);
		const projection = projectDriverOntoRoute(
			navigationLocation.latitude,
			navigationLocation.longitude,
			routeLngLat,
			routeProgressAlongMRef.current,
			navigationLocation.heading,
			navigationLocation.speedKmh,
		);

		if (projection.distanceToRouteMeters <= snapMaxM) {
			const [longitude, latitude] = projection.nearestOnRoute;
			const routeBearing = bearingAlongRouteAtDistance(
				routeLngLat,
				projection.distanceAlongMeters,
			);
			return {
				latitude,
				longitude,
				onRoute: true,
				bearing: routeBearing ?? navigationLocation.heading ?? 0,
				driftMeters: projection.distanceToRouteMeters,
			};
		}

		return {
			latitude: navigationLocation.latitude,
			longitude: navigationLocation.longitude,
			onRoute: false,
			bearing: navigationLocation.heading ?? 0,
			driftMeters: projection.distanceToRouteMeters,
		};
	}, [isNavActive, navigationLocation, routeLngLat]);

	const driverBearing = snappedDriverPosition?.bearing ?? navigationLocation?.heading ?? 0;

	const rawDriverCoords = useMemo((): Coordinates | null => {
		if (!isNavActive || !navigationLocation) return null;
		return {
			latitude: navigationLocation.latitude,
			longitude: navigationLocation.longitude,
		};
	}, [isNavActive, navigationLocation]);

	const routeSnapOverlay = useMemo(() => {
		if (!isNavActive || !snappedDriverPosition?.onRoute || !routeLngLat.length) return null;

		const routeBearing = bearingAlongRouteAtDistance(
			routeLngLat,
			routeProgressAlongMRef.current,
		);

		return {
			coordinate: [
				snappedDriverPosition.longitude,
				snappedDriverPosition.latitude,
			] as LngLat,
			bearing: routeBearing ?? driverBearing,
			showConnector:
				(snappedDriverPosition.driftMeters ?? 0) >= NAV_GPS_DRIFT_CONNECTOR_MIN_M,
		};
	}, [isNavActive, snappedDriverPosition, routeLngLat, driverBearing]);

	const routeConnectorCoords = useMemo((): LngLat[] | null => {
		if (!routeSnapOverlay?.showConnector || !rawDriverCoords) return null;
		return [
			[rawDriverCoords.longitude, rawDriverCoords.latitude],
			routeSnapOverlay.coordinate,
		];
	}, [routeSnapOverlay, rawDriverCoords]);

	const activeCoords = useMemo((): Coordinates | null => {
		if (navState === "running" || navState === "paused") {
			if (snappedDriverPosition) {
				return {
					latitude: snappedDriverPosition.latitude,
					longitude: snappedDriverPosition.longitude,
				};
			}
			return navigationLocation
				? { latitude: navigationLocation.latitude, longitude: navigationLocation.longitude }
				: coords;
		}
		return coords;
	}, [navState, navigationLocation, coords, snappedDriverPosition]);

	const showRawGpsPuck = useMemo(() => {
		if (!isNavActive || !rawDriverCoords) return false;
		if (!snappedDriverPosition?.onRoute) return true;
		return (snappedDriverPosition.driftMeters ?? 0) >= NAV_GPS_DRIFT_CONNECTOR_MIN_M;
	}, [isNavActive, rawDriverCoords, snappedDriverPosition]);

	const puckCoords = useMemo((): Coordinates | null => {
		if (!isNavActive) return activeCoords;
		if (showRawGpsPuck && rawDriverCoords) return rawDriverCoords;
		if (snappedDriverPosition?.onRoute) {
			return {
				latitude: snappedDriverPosition.latitude,
				longitude: snappedDriverPosition.longitude,
			};
		}
		return rawDriverCoords ?? activeCoords;
	}, [isNavActive, showRawGpsPuck, rawDriverCoords, activeCoords, snappedDriverPosition]);

	const followDriverOnRoute =
		navState === "running" && Boolean(activeCoords && !error && navFollowUser);

	const followFreeNavigationCompass =
		navState === "running" &&
		Boolean(activeCoords && !error && !navFollowUser && freeCompassFollow);

	const mapRotatesWithHeading = followDriverOnRoute || followFreeNavigationCompass;

	const mapHeadingForMarkers = mapRotatesWithHeading
		? (compassHeading ?? driverBearing)
		: 0;

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
		() => buildRouteSignature(routeLngLat),
		[routeLngLat],
	);

	const fitCameraToRoute = useCallback(
		(coordsList: LngLat[], animationDuration = CAMERA_ANIMATION_MS): boolean => {
			if (coordsList.length < 2) return false;
			const [minLng, minLat, maxLng, maxLat] = turf.bbox(turf.lineString(coordsList));
			cameraRef.current?.fitBounds(
				[maxLng, maxLat],
				[minLng, minLat],
				ROUTE_VIEW_PADDING,
				animationDuration,
			);
			return true;
		},
		[],
	);

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
		if (!loading) syncCurrentZoom(zoom, true);
	}, [loading, zoom, syncCurrentZoom]);

	/** Posição inicial só por imperativo (evita reancorar no GPS a cada gesto/re-render). */
	useEffect(() => {
		if (loading || error || !coords || navState !== "idle") return;
		if (initialCameraAppliedRef.current) return;
		if (lineCoordinates && lineCoordinates.length >= 2) return;
		initialCameraAppliedRef.current = true;
		syncCurrentZoom(USER_ZOOM, true);
		cameraRef.current?.setCamera(
			withCameraEase(
				{
					centerCoordinate: [coords.longitude, coords.latitude],
					zoomLevel: USER_ZOOM,
				},
				0,
			),
		);
	}, [loading, error, coords, navState, lineCoordinates, syncCurrentZoom]);

	/** Carrega rota apenas quando há frete com origem e destino válidos. */
	useEffect(() => {
		if (loading) return;

		let cancelled = false;

		if (hasFreightRoute && freightUser) {
			const useDriverLeg = Boolean(coords && !error);
			void handleGetMapBox(freightUser.origin_label, freightUser.destination_label, {
				rotaSimples: !useDriverLeg,
				coordenadasMotorista:
					useDriverLeg && coords
						? `${coords.longitude},${coords.latitude}`
						: undefined,
			}).finally(() => {
				if (cancelled) clearRota();
			});
			return () => {
				cancelled = true;
			};
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
		const user = navigationLocation
			? { latitude: navigationLocation.latitude, longitude: navigationLocation.longitude }
			: coords;
		if ((navState === "running" || navState === "paused") && user && routeLngLat.length) {
			const p = projectDriverOntoRoute(
				user.latitude,
				user.longitude,
				routeLngLat,
				routeProgressAlongMRef.current,
				navigationLocation?.heading,
				navigationLocation?.speedKmh,
			);
			setRouteProgressAlongM(p.distanceAlongMeters);
			routeProgressAlongMRef.current = p.distanceAlongMeters;
		} else {
			setRouteProgressAlongM(0);
			routeProgressAlongMRef.current = 0;
		}
	}, [geometrySignature, routeLngLat, navState, navigationLocation, coords]);

	/** Segue o marcador ajustado à rota (em vez do puck nativo do GPS). */
	useEffect(() => {
		if (!followDriverOnRoute || !activeCoords) return;
		if (Date.now() < ignoreMapGestureUnfollowUntilRef.current) return;

		const now = Date.now();
		const lastCoords = lastCameraFollowCoordsRef.current;
		const movedM =
			lastCoords != null
				? distanceMeters(
						[lastCoords.longitude, lastCoords.latitude],
						[activeCoords.longitude, activeCoords.latitude],
					)
				: Number.POSITIVE_INFINITY;
		const minInterval = isMoving
			? NAV_CAMERA_FOLLOW_MIN_INTERVAL_MOVING_MS
			: NAV_CAMERA_FOLLOW_MIN_INTERVAL_IDLE_MS;

		if (
			lastCoords != null &&
			now - lastCameraFollowAtRef.current < minInterval &&
			movedM < NAV_CAMERA_FOLLOW_MIN_MOVE_M
		) {
			return;
		}

		lastCameraFollowAtRef.current = now;
		lastCameraFollowCoordsRef.current = activeCoords;

		cameraRef.current?.setCamera(
			withCameraFollow(
				{
					centerCoordinate: [activeCoords.longitude, activeCoords.latitude],
					zoomLevel: NAV_ZOOM,
					heading: driverBearing,
					pitch: 45,
					padding: { ...MAP_EDGE_PADDING_NAV_FOLLOW },
				},
				isMoving ? NAV_CAMERA_FOLLOW_MOVING_MS : NAV_CAMERA_FOLLOW_IDLE_MS,
			),
		);
	}, [
		followDriverOnRoute,
		activeCoords?.latitude,
		activeCoords?.longitude,
		driverBearing,
		isMoving,
	]);

	/** Navegação livre: câmera gira com a orientação física do celular (bússola). */
	useEffect(() => {
		if (!followFreeNavigationCompass || !activeCoords) return;
		if (Date.now() < ignoreMapGestureUnfollowUntilRef.current) return;

		const heading = compassHeading ?? driverBearing;

		cameraRef.current?.setCamera(
			withCameraFollow(
				{
					centerCoordinate: [activeCoords.longitude, activeCoords.latitude],
					heading,
					pitch: 0,
				},
				isMoving ? NAV_CAMERA_FOLLOW_MOVING_MS : NAV_CAMERA_FOLLOW_IDLE_MS,
			),
		);
	}, [
		followFreeNavigationCompass,
		activeCoords?.latitude,
		activeCoords?.longitude,
		compassHeading,
		driverBearing,
		isMoving,
	]);

	/** Bússola ativa apenas na navegação livre. */
	useEffect(() => {
		if (navState !== "running" || navFollowUser) {
			setCompassHeading(null);
			return;
		}

		let cancelled = false;
		let watcher: { remove: () => void } | null = null;
		void (async () => {
			const w = await startCompassHeadingWatch((heading) => {
				if (!cancelled) setCompassHeading(heading);
			});
			if (!cancelled) watcher = w;
		})();

		return () => {
			cancelled = true;
			watcher?.remove();
		};
	}, [navState, navFollowUser]);

	navigationLocationRef.current = navigationLocation;

	/** Publica telemetria a cada 5 s com a última posição GPS (GPS do mapa segue em alta frequência). */
	useEffect(() => {
		const freightId = freightUser?.id;
		if (navState !== "running" || freightId == null) return;

		const publishLatest = () => {
			const loc = navigationLocationRef.current;
			if (!loc) return;
			void publishDriverLocation({
				freightId,
				latitude: loc.latitude,
				longitude: loc.longitude,
				speed: loc.speedKmh,
				heading: loc.heading,
			});
		};

		publishLatest();
		const intervalId = setInterval(publishLatest, TELEMETRY_PUBLISH_INTERVAL_MS);
		return () => clearInterval(intervalId);
	}, [navState, freightUser?.id]);

	/** Evita watcher global de telemetria enquanto a navegação in-app controla o GPS. */
	useEffect(() => {
		const active = navState === "running";
		setMapNavigationActive(active);
		return () => setMapNavigationActive(false);
	}, [navState]);

	/** GPS contínuo na navegação (running/paused) — alta frequência. */
	useEffect(() => {
		if (navState !== "running" && navState !== "paused") return;
		let cancelled = false;
		let watcher: { remove: () => void } | null = null;
		void (async () => {
			const w = await startNavigationLocationWatch((update) => {
				if (cancelled) return;
				setNavigationLocation(update);
				if (routeLngLat.length > 0) {
					const snapMaxM = resolveSnapMaxDistanceM(update.accuracyM);
					const proj = projectDriverOntoRoute(
						update.latitude,
						update.longitude,
						routeLngLat,
						routeProgressAlongMRef.current,
						update.heading,
						update.speedKmh,
					);
					if (proj.distanceToRouteMeters <= snapMaxM) {
						const next = clampMonotonicProgress(
							routeProgressAlongMRef.current,
							proj.distanceAlongMeters,
						);
						routeProgressAlongMRef.current = next;
					}
				}
			});
			if (!cancelled) watcher = w;
		})();
		return () => {
			cancelled = true;
			watcher?.remove();
		};
	}, [navState, routeLngLat]);

	/** GPS contínuo no mapa antes da navegação — evita posição “congelada”. */
	useEffect(() => {
		if (navState !== "idle") return;
		let cancelled = false;
		let watcher: { remove: () => void } | null = null;
		void (async () => {
			const w = await startMapPreviewLocationWatch((update) => {
				if (cancelled) return;
				setCoords({
					latitude: update.latitude,
					longitude: update.longitude,
				});
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
			setNavigationLocation(null);
			setRouteProgressAlongM(0);
			routeProgressAlongMRef.current = 0;
			setIsStartingNav(false);
			setIsDriverOnRoute(false);
			offRouteStreakRef.current = 0;
			lastRerouteCoordsRef.current = null;
			rerouteInFlightRef.current = false;
		}
	}, [navState]);

	useEffect(() => {
		return () => {
			if (startNavTimeoutRef.current) clearTimeout(startNavTimeoutRef.current);
			if (deferredProjectionTimeoutRef.current) {
				clearTimeout(deferredProjectionTimeoutRef.current);
			}
		};
	}, []);

	/** Progresso ao longo da rota + reroute por desvio (só em execução). */
	useEffect(() => {
		if (navState !== "running") return;
		const user = navigationLocation
			? { latitude: navigationLocation.latitude, longitude: navigationLocation.longitude }
			: coords;
		if (!user || !routeLngLat.length) return;

		const snapMaxM = resolveSnapMaxDistanceM(navigationLocation?.accuracyM);
		const proj = projectDriverOntoRoute(
			user.latitude,
			user.longitude,
			routeLngLat,
			routeProgressAlongMRef.current,
			navigationLocation?.heading,
			navigationLocation?.speedKmh,
		);
		const onRoute = proj.distanceToRouteMeters <= NAV_OFF_ROUTE_THRESHOLD_M;

		setIsDriverOnRoute(onRoute);

		if (!onRoute) {
			offRouteStreakRef.current += 1;
			const now = Date.now();
			const canTryReroute = !loadingRota && !rerouteInFlightRef.current;
			const movedEnoughSinceLastReroute = (() => {
				if (!lastRerouteCoordsRef.current) return true;
				return (
					distanceMeters(lastRerouteCoordsRef.current, [
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

		if (proj.distanceToRouteMeters > snapMaxM) return;

		setRouteProgressAlongM((prev) => {
			const next = clampMonotonicProgress(prev, proj.distanceAlongMeters);
			routeProgressAlongMRef.current = next;
			return next;
		});
	}, [
		navState,
		navigationLocation,
		coords,
		routeLngLat,
		freightUser,
		hasFreightRoute,
		loadingRota,
		recalculateFromDriverLocation,
	]);

	/** Verifica proximidade ao destino e atualiza status para "Em Rota de Entrega" automaticamente. */
	useEffect(() => {
		if (navState !== "running") {
			hasAttemptedDeliveryStatusRef.current = false;
			return;
		}

		if (hasAttemptedDeliveryStatusRef.current) return;
		if (!freightUser || !rotaData?.coords_destino) return;

		const currentStatus = normalizeFreightStatusName(freightUser.status?.name);
		if (currentStatus !== "em transito") return;

		const userCoords = navigationLocation
			? { latitude: navigationLocation.latitude, longitude: navigationLocation.longitude }
			: coords;
		if (!userCoords) return;

		const destination: LngLat = rotaData.coords_destino;
		const userLngLat: LngLat = [userCoords.longitude, userCoords.latitude];
		const distanceToDestinationM = distanceMeters(userLngLat, destination);

		if (distanceToDestinationM <= NAV_NEAR_DESTINATION_THRESHOLD_M) {
			hasAttemptedDeliveryStatusRef.current = true;
			void handleUpdateFreightStatus(freightUser.id, "Em Rota de Entrega");
		}
	}, [
		navState,
		navigationLocation,
		coords,
		freightUser,
		rotaData,
		handleUpdateFreightStatus,
	]);

	/** Em modo idle, enquadra a rota quando a geometria muda ou ao sair da navegação. */
	useEffect(() => {
		if (navState !== "idle") return;
		const coordsList = rotaData?.geometria?.coordinates;
		if (!coordsList?.length) {
			lastFittedGeometryRef.current = null;
			return;
		}
		const signature = buildRouteSignature(coordsList as LngLat[]);
		if (!signature) {
			lastFittedGeometryRef.current = null;
			return;
		}
		if (lastFittedGeometryRef.current === signature) return;
		lastFittedGeometryRef.current = signature;
		void fitCameraToRoute(coordsList as LngLat[]);
	}, [rotaData?.geometria, navState, fitCameraToRoute]);

	const applyFollowVehicleCamera = useCallback(() => {
		if (!activeCoords) return;
		ignoreMapGestureUnfollowUntilRef.current = Date.now() + MAP_CAMERA_ANIMATION_MS + 400;
		syncCurrentZoom(NAV_ZOOM, true);
		cameraRef.current?.setCamera(
			withCameraEase(
				{
					centerCoordinate: [activeCoords.longitude, activeCoords.latitude],
					zoomLevel: NAV_ZOOM,
					heading: driverBearing,
					pitch: 45,
					padding: { ...MAP_EDGE_PADDING_NAV_FOLLOW },
				},
				MAP_CAMERA_ANIMATION_MS,
			),
		);
	}, [activeCoords, driverBearing, syncCurrentZoom]);

	const handleCentralizarMinhaLocalizacao = useCallback(() => {
		if (!activeCoords) return;
		ignoreMapGestureUnfollowUntilRef.current = Date.now() + NAV_PROGRAMMATIC_CAMERA_GRACE_MS;
		setRouteOverviewActive(false);

		if (navState === "running") {
			setFreeCompassFollow(false);
			setNavFollowUser(true);
			applyFollowVehicleCamera();
			return;
		}

		if (navState === "paused") {
			setNavFollowUser(true);
			syncCurrentZoom(NAV_ZOOM, true);
			cameraRef.current?.setCamera(
				withCameraEase(
					{
						centerCoordinate: [activeCoords.longitude, activeCoords.latitude],
						zoomLevel: NAV_ZOOM,
						pitch: 45,
						padding: { ...MAP_EDGE_PADDING_NAV_FOLLOW },
					},
					MAP_CAMERA_ANIMATION_MS,
				),
			);
			return;
		}

		syncCurrentZoom(USER_ZOOM, true);
		cameraRef.current?.setCamera(
			withCameraEase(
				{
					centerCoordinate: [activeCoords.longitude, activeCoords.latitude],
					zoomLevel: USER_ZOOM,
				},
				MAP_CAMERA_ANIMATION_MS,
			),
		);
	}, [activeCoords, navState, applyFollowVehicleCamera, syncCurrentZoom]);

	const handleIniciarNavegacao = useCallback(() => {
		if (!rotaData || loadingRota || isStartingNav) return;

		setIsStartingNav(true);

		const currentStatus = normalizeFreightStatusName(freightUser?.status?.name);
		if (currentStatus === "vinculado" && freightUser?.id) {
			void handleUpdateFreightStatus(freightUser.id, "Em Transito").then((ok) => {
				if (ok) void invalidateFreightUser();
			});
		}

		ignoreMapGestureUnfollowUntilRef.current =
			Date.now() + NAV_START_TOTAL_MS + NAV_PROGRAMMATIC_CAMERA_GRACE_MS;
		setNavFollowUser(true);
		setFreeCompassFollow(false);
		setRouteOverviewActive(false);

		// Passo 1 — anima câmera imediatamente para a posição de navegação.
		// O painel de nav só aparece APÓS a animação terminar (NAV_START_TOTAL_MS),
		// então o usuário já vê a câmera posicionada antes de ver o painel.
		if (coords && !error) {
			syncCurrentZoom(NAV_ZOOM, true);
			cameraRef.current?.setCamera(
				withCameraEase(
					{
						centerCoordinate: [coords.longitude, coords.latitude],
						zoomLevel: NAV_ZOOM,
						pitch: 45,
						padding: { ...MAP_EDGE_PADDING_NAV_FOLLOW },
					},
					NAV_CAMERA_ENTER_MS,
				),
			);
		} else if (lineCoordinates?.length) {
			void fitCameraToRoute(lineCoordinates as LngLat[], NAV_CAMERA_ENTER_MS);
		}

		// Passo 2 — aguarda câmera chegar e faz a transição do painel.
		if (startNavTimeoutRef.current) clearTimeout(startNavTimeoutRef.current);
		startNavTimeoutRef.current = setTimeout(() => {
			startNavTimeoutRef.current = null;
			LayoutAnimation.configureNext(NAV_UI_LAYOUT_ANIM);
			ignoreMapGestureUnfollowUntilRef.current =
				Date.now() + NAV_PROGRAMMATIC_CAMERA_GRACE_MS;
			setNavFollowUser(true);
			setFreeCompassFollow(false);
			setNavState("running");
			setIsStartingNav(false);

			// Passo 3 — projeção inicial adiada para não bloquear a transição do painel.
			if (deferredProjectionTimeoutRef.current) {
				clearTimeout(deferredProjectionTimeoutRef.current);
			}
			if (coords && !error && lineCoordinates?.length &&
				lineCoordinates.length <= NAV_INITIAL_PROJECTION_MAX_POINTS) {
				deferredProjectionTimeoutRef.current = setTimeout(() => {
					deferredProjectionTimeoutRef.current = null;
					const p = projectDriverOntoRoute(
						coords.latitude,
						coords.longitude,
						lineCoordinates as LngLat[],
						null,
						null,
						null,
					);
					if (p.distanceToRouteMeters <= NAV_SNAP_MAX_DISTANCE_M + 80) {
						setRouteProgressAlongM(p.distanceAlongMeters);
						routeProgressAlongMRef.current = p.distanceAlongMeters;
					}
				}, NAV_DEFERRED_PROJECTION_DELAY_MS);
			}
		}, NAV_START_TOTAL_MS);
	}, [
		rotaData,
		loadingRota,
		isStartingNav,
		coords,
		error,
		lineCoordinates,
		freightUser?.id,
		freightUser?.status?.name,
		handleUpdateFreightStatus,
		invalidateFreightUser,
		fitCameraToRoute,
		syncCurrentZoom,
	]);

	const handleToggleRouteOverview = useCallback(() => {
		if (!lineCoordinates?.length) return;
		ignoreMapGestureUnfollowUntilRef.current = Date.now() + NAV_PROGRAMMATIC_CAMERA_GRACE_MS;

		if (!routeOverviewActive) {
			setRouteOverviewActive(true);
			setNavFollowUser(false);
			setFreeCompassFollow(false);
			cameraRef.current?.setCamera(
				withCameraEase({ pitch: 0, heading: 0 }, NAV_VIEW_FULL_ROUTE_MS),
			);
			const coordsToFit =
				isNavActive && remainingRouteCoords.length >= 2
					? remainingRouteCoords
					: (lineCoordinates as LngLat[]);
			void fitCameraToRoute(coordsToFit, NAV_VIEW_FULL_ROUTE_MS);
			return;
		}

		setRouteOverviewActive(false);
		if (isNavActive) {
			setNavFollowUser(true);
			setFreeCompassFollow(false);
			applyFollowVehicleCamera();
			return;
		}

		if (coords && isUsableGps(coords)) {
			cameraRef.current?.setCamera(
				withCameraEase(
					{
						centerCoordinate: [coords.longitude, coords.latitude],
						zoomLevel: USER_ZOOM,
						pitch: 0,
						heading: 0,
					},
					NAV_VIEW_FULL_ROUTE_MS,
				),
			);
		}
	}, [
		lineCoordinates,
		routeOverviewActive,
		isNavActive,
		remainingRouteCoords,
		fitCameraToRoute,
		applyFollowVehicleCamera,
		coords,
	]);

	const handleMapCameraChanged = useCallback(
		(state: MapState) => {
			const nextZoom = state.properties?.zoom;
			let zoomDelta = 0;
			if (typeof nextZoom === "number" && Number.isFinite(nextZoom)) {
				const now = Date.now();
				zoomDelta = Math.abs(nextZoom - lastZoomSyncedValueRef.current);
				const shouldSyncZoom =
					zoomDelta >= CAMERA_ZOOM_SYNC_DELTA &&
					(now - lastZoomSyncAtRef.current >= CAMERA_ZOOM_SYNC_THROTTLE_MS || zoomDelta >= 0.35);
				if (shouldSyncZoom) {
					lastZoomSyncAtRef.current = now;
					syncCurrentZoom(nextZoom);
				}
			}
			if (navState !== "running" && navState !== "paused") return;
			if (Date.now() < ignoreMapGestureUnfollowUntilRef.current) return;
			if (!state.gestures?.isGestureActive) return;

			setNavFollowUser((prev) => {
				if (prev) {
					setFreeCompassFollow(true);
					setRouteOverviewActive(true);
					return false;
				}
				setFreeCompassFollow(false);
				return prev;
			});
		},
		[navState, syncCurrentZoom],
	);

	const handleCancelarNavegacao = useCallback(() => {
		LayoutAnimation.configureNext(NAV_UI_LAYOUT_ANIM);
		setNavState("idle");
		setNavFollowUser(true);
		setRouteOverviewActive(true);
		const routeCoords = lineCoordinates as LngLat[] | undefined;
		requestAnimationFrame(() => {
			cameraRef.current?.setCamera(withCameraEase({ pitch: 0 }, CAMERA_ANIMATION_MS));
			if (routeCoords?.length) {
				void fitCameraToRoute(routeCoords);
			}
		});
	}, [lineCoordinates, fitCameraToRoute]);

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<View className="flex-1" style={{ backgroundColor: navUi.sheetBg }}>
			<StatusBar style={mode === "dark" ? "light" : "dark"} translucent />
			<Mapbox.MapView
				style={StyleSheet.absoluteFillObject}
				styleURL={styleURL}
				scrollEnabled
				zoomEnabled
				pitchEnabled
				rotateEnabled
				scaleBarEnabled={false}
				onCameraChanged={handleMapCameraChanged}
			>
			<Mapbox.Camera
				ref={cameraRef}
				animationMode={CAMERA_ANIMATION_MODE}
				animationDuration={MAP_CAMERA_ANIMATION_MS}
				followUserLocation={false}
				followZoomLevel={NAV_ZOOM}
				followPitch={45}
			/>
				{puckCoords && !error ? (
					isNavActive ? (
						showRawGpsPuck ? (
							<Mapbox.MarkerView
								coordinate={[puckCoords.longitude, puckCoords.latitude]}
								anchor={{ x: 0.5, y: 0.5 }}
								allowOverlap
								allowOverlapWithPuck
							>
								<NavigationLocationPuck />
							</Mapbox.MarkerView>
						) : null
					) : (
						<Mapbox.PointAnnotation
							id="driver-location-arrow"
							coordinate={[puckCoords.longitude, puckCoords.latitude]}
							anchor={{ x: 0.5, y: 0.5 }}
						>
							<NavigationDriverMarker
								bearing={
									mapRotatesWithHeading ? 0 : compassHeading ?? driverBearing
								}
							/>
						</Mapbox.PointAnnotation>
					)
				) : null}

				{routeConnectorCoords ? (
					<Mapbox.ShapeSource
						id="routeConnectorSource"
						shape={{
							type: "Feature",
							properties: {},
							geometry: {
								type: "LineString",
								coordinates: routeConnectorCoords,
							},
						}}
					>
						<Mapbox.LineLayer id="routeConnectorLine" style={routeConnectorLayerStyle} />
					</Mapbox.ShapeSource>
				) : null}

				{isNavActive && routeSnapOverlay ? (
					<Mapbox.MarkerView
						coordinate={routeSnapOverlay.coordinate}
						anchor={{ x: 0.5, y: 0.5 }}
						allowOverlap
						allowOverlapWithPuck
					>
						<NavigationManeuverMarker
							bearing={routeSnapOverlay.bearing}
							mapHeading={mapHeadingForMarkers}
						/>
					</Mapbox.MarkerView>
				) : null}

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
					<Mapbox.PointAnnotation id="marker-inicio" coordinate={lineCoordinates[0]} title={t("MAP.MARKER_START")}>
						<Ionicons name="person" size={24} color={themeColor} />
					</Mapbox.PointAnnotation>
				)}

				{!isNavActive && rotaData?.coords_carga && (
					<Mapbox.PointAnnotation id="marker-carga" coordinate={rotaData.coords_carga} title={t("MAP.MARKER_PICKUP")}>
						<Ionicons name={hasFreightRoute ? "cube" : "navigate"} size={24} color={themeColor} />
					</Mapbox.PointAnnotation>
				)}

				{rotaData?.coords_destino && (
					<Mapbox.PointAnnotation id="marker-destino" coordinate={rotaData.coords_destino} title={t("MAP.MARKER_DESTINATION")}>
						<Ionicons name="flag" size={26} color={isNavActive ? colors.bgOctonary : themeColor} />
					</Mapbox.PointAnnotation>
				)}
			</Mapbox.MapView>

			{loadingRota ? (
				<View
					className="absolute left-4 z-20 rounded-xl border px-3 py-2 flex-row items-center gap-2"
					style={{ top: insets.top + 120, backgroundColor: navUi.sheetBg, borderColor: navUi.cardBorder, borderWidth: 1 }}
					pointerEvents="none"
				>
					<ActivityIndicator size="small" color={iconColor} />
					<Text className="text-sm" style={{ color: colors.textSecondary }}>
						{t("MAP.CALCULATING_ROUTE")}
					</Text>
				</View>
			) : null}

			{rotaErro && !loadingRota ? (
				<View
					className="absolute left-4 right-4 z-20 rounded-xl border px-3 py-2.5"
					style={{ top: insets.top + (isNavActive ? 168 : 120), backgroundColor: navUi.sheetBg, borderColor: "#c0392b", borderWidth: 1 }}
				>
					<Text className="text-sm font-medium" style={{ color: colors.text }}>
						{rotaErro}
					</Text>
				</View>
			) : null}

			<MapNavigationHeader
				title={t("MAP.ROUTE_TITLE")}
				directionIcon={isNavActive && rotaData ? iconeManobra : undefined}
				directionLabel={isNavActive && rotaData ? instrucaoTopo : undefined}
			/>

			{rotaData && isNavActive ? (
				<MapNavigationBottomSheet
					visible={isNavActive}
					collapsedHeight={NAV_SHEET_COLLAPSED_HEIGHT}
					expandedHeight={navSheetExpandedHeight}
					floatingLeft={
						showRecenterButton ? (
							<NavigationRecenterButton
								onPress={handleCentralizarMinhaLocalizacao}
								visible={isNavActive}
							/>
						) : (
							<NavigationSpeedBadge speedKmh={speedKmh} visible={isNavActive} />
						)
					}
					header={
						<View className="flex-row items-center justify-between px-4 pb-2">
							<TouchableOpacity
								onPress={handleCancelarNavegacao}
								className="h-11 w-11 shrink-0 rounded-full items-center justify-center border"
								style={mapButtonStyle}
								accessibilityRole="button"
								accessibilityLabel={t("MAP.END_NAV_A11Y")}
							>
								<Ionicons name="close" size={22} color={mapButtonIconColor} />
							</TouchableOpacity>
							<View className="min-w-0 flex-1 items-center px-2">
								<Text
									className="text-center text-3xl font-bold"
									style={{ color: navUi.textPrimary }}
									numberOfLines={1}
									adjustsFontSizeToFit
									minimumFontScale={0.65}
								>
									{formatDriveDuration(displayTempoTotalMin ?? 0)}
								</Text>
								<Text
									className="mt-1.5 text-center text-sm"
									style={{ color: navUi.textSecondary }}
									numberOfLines={1}
								>
									{displayDistanciaTotalKm != null
										? `${Math.round(displayDistanciaTotalKm)} km`
										: "—"}{" "}
									| {formatChegadaClock(displayTempoTotalMin ?? 0)}
								</Text>
							</View>
							<NavigationRoutesButton
								onPress={handleToggleRouteOverview}
								active={routeOverviewActive}
								backgroundColor={navUi.circleButtonBg}
								borderColor={navUi.cardBorder}
								activeBorderColor={colors.bgOctonary}
								iconColor={mapButtonIconColor}
								accessibilityLabel={
									routeOverviewActive
										? t("MAP.ROUTE_OVERVIEW_EXIT_A11Y")
										: t("MAP.ROUTE_OVERVIEW_A11Y")
								}
							/>
						</View>
					}
				>
					{freightUser ? (
						<View style={{ gap: 10 }}>
							<CardFreight freight={freightUser} navigateTo={goToFreightDetailsTab} />
							<CardActivityHome
								freight={freightUser}
								AcceptButton={false}
								onPress={goToFreightDetailsTab}
							/>
						</View>
					) : null}
				</MapNavigationBottomSheet>
			) : null}

			<SafeAreaView
				className="absolute bottom-0 left-0 right-0 z-10"
				edges={["bottom"]}
				pointerEvents="box-none"
			>
				{rotaData && navState === "idle" ? (
					<View
						className="w-full overflow-hidden px-4 pt-4"
						style={{
							backgroundColor: navUi.sheetBg,
							borderTopLeftRadius: NAV_SHEET_TOP_RADIUS,
							borderTopRightRadius: NAV_SHEET_TOP_RADIUS,
							paddingBottom: Math.max(insets.bottom, 12),
							shadowColor: "#000",
							shadowOffset: { width: 0, height: -4 },
							shadowOpacity: mode === "dark" ? 0.22 : 0.12,
							shadowRadius: 12,
							elevation: 12,
						}}
					>
						<View
							className="flex-row items-center justify-between pb-3"
							style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: navUi.scrollDivider }}
						>
							<Text className="text-base font-semibold flex-1" style={{ color: navUi.textPrimary }} numberOfLines={1}>
								{routeSummary.origem}
							</Text>
							<Text className="px-2 text-base" style={{ color: navUi.textSecondary }}>→</Text>
							<Text className="text-base font-semibold flex-1 text-right" style={{ color: navUi.textPrimary }} numberOfLines={1}>
								{routeSummary.destino}
							</Text>
						</View>
						{rotaData.trecho_ate_carga != null ? (
							<View
								className="mt-3 rounded-xl px-3 py-2.5"
								style={{ backgroundColor: navUi.circleButtonBg }}
							>
								<Text
									className="text-xs font-semibold uppercase tracking-wide"
									style={{ color: navUi.textSecondary }}
								>
									{t("MAP.UNTIL_PICKUP")}
								</Text>
								<Text className="text-base font-semibold mt-1" style={{ color: navUi.textPrimary }}>
									{rotaData.trecho_ate_carga.distancia_km.toFixed(1)} km · ~
									{Math.round(rotaData.trecho_ate_carga.tempo_min)} min
								</Text>
								<Text className="text-xs mt-1" style={{ color: navUi.textSecondary }}>
									{t("MAP.UNTIL_PICKUP_HINT")}
								</Text>
							</View>
						) : null}
						<View
							className="mt-3 flex-row items-center justify-between px-1 pt-3"
							style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: navUi.scrollDivider }}
						>
							<View className="flex-1 flex-row items-center">
								<View className="flex-1 items-center">
									<Text className="text-xs" style={{ color: navUi.textSecondary }}>
										{t("MAP.DISTANCE")}
									</Text>
									<Text className="text-xl font-semibold mt-1" style={{ color: navUi.textPrimary }}>
										{rotaData.distancia_total_km != null
											? `${rotaData.distancia_total_km.toFixed(1)} km`
											: "—"}
									</Text>
								</View>
								<View
									style={{
										width: StyleSheet.hairlineWidth,
										height: 44,
										backgroundColor: navUi.scrollDivider,
									}}
								/>
								<View className="flex-1 items-center">
									<Text className="text-xs" style={{ color: navUi.textSecondary }}>
										{t("MAP.ESTIMATED_TIME")}
									</Text>
									<Text className="text-xl font-semibold mt-1" style={{ color: navUi.textPrimary }}>
										{rotaData.tempo_total_min != null
											? formatDriveDuration(rotaData.tempo_total_min)
											: "—"}
									</Text>
								</View>
							</View>
							<View className="ml-3">
								<NavigationRoutesButton
									onPress={handleToggleRouteOverview}
									active={routeOverviewActive}
									backgroundColor={navUi.circleButtonBg}
									borderColor={navUi.cardBorder}
									activeBorderColor={colors.bgOctonary}
									iconColor={mapButtonIconColor}
									accessibilityLabel={
										routeOverviewActive
											? t("MAP.ROUTE_OVERVIEW_EXIT_A11Y")
											: t("MAP.ROUTE_OVERVIEW_A11Y")
									}
								/>
							</View>
						</View>

						<View className="mt-4">
							<TouchableOpacity
								className="w-full py-3.5 rounded-2xl items-center justify-center"
								style={{
									backgroundColor: colors.bgQuaternary,
									opacity: !rotaData || loadingRota || isStartingNav ? 0.65 : 1,
								}}
								disabled={!rotaData || loadingRota || isStartingNav}
								onPress={handleIniciarNavegacao}
								accessibilityRole="button"
								accessibilityLabel={
									isStartingNav ? t("MAP.STARTING_NAV_A11Y") : t("MAP.START_NAV_A11Y")
								}
								accessibilityState={{ busy: isStartingNav }}
							>
								{isStartingNav ? (
									<View className="flex-row items-center gap-2">
										<ActivityIndicator size="small" color={colors.textTertiary} />
										<Text className="text-base font-bold" style={{ color: colors.textTertiary }}>
											{t("MAP.STARTING_NAV")}
										</Text>
									</View>
								) : (
									<Text className="text-base font-bold" style={{ color: colors.textTertiary }}>
										{t("MAP.START_NAV")}
									</Text>
								)}
							</TouchableOpacity>
						</View>

						<View className="mt-3 flex-row w-full gap-2">
							<TouchableOpacity
								className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-3 px-2"
								style={{
									...mapButtonStyle,
									opacity: canOpenGoogleMaps ? 1 : 0.45,
								}}
								disabled={!canOpenGoogleMaps}
								onPress={openGoogleMapsFromMap}
								accessibilityRole="button"
								accessibilityLabel={t("MAP.GOOGLE_MAP_A11Y")}
							>
								<Ionicons name="logo-google" size={22} color={mapButtonIconColor} />
								<Text className="text-base font-semibold text-center" style={{ color: mapButtonTextColor }} numberOfLines={2}>
									{t("MAP.GOOGLE_MAP")}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-3 px-2"
								style={mapButtonStyle}
								onPress={goToFreightDetailsTab}
								accessibilityRole="button"
								accessibilityLabel={t("MAP.VIEW_FREIGHTS_A11Y")}
							>
								<Ionicons name="document-text-outline" size={22} color={mapButtonIconColor} />
								<Text className="text-base font-semibold text-center" style={{ color: mapButtonTextColor }} numberOfLines={2}>
									{t("MAP.VIEW_FREIGHTS")}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				) : null}

				{!isNavActive && !rotaData ? (
					<View
						className="w-full flex-row gap-2 px-4"
						style={{ paddingBottom: Math.max(insets.bottom, 12) }}
					>
						<TouchableOpacity
							className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-3 px-2"
							style={{
								...mapButtonStyle,
								opacity: canOpenGoogleMaps ? 1 : 0.45,
							}}
							disabled={!canOpenGoogleMaps}
							onPress={openGoogleMapsFromMap}
							accessibilityRole="button"
							accessibilityLabel={t("MAP.GOOGLE_MAP_A11Y")}
						>
							<Ionicons name="logo-google" size={22} color={mapButtonIconColor} />
							<Text className="text-base font-semibold text-center" style={{ color: mapButtonTextColor }} numberOfLines={2}>
								{t("MAP.GOOGLE_MAP")}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-3 px-2"
							style={mapButtonStyle}
							onPress={goToFreightDetailsTab}
							accessibilityRole="button"
							accessibilityLabel={t("MAP.VIEW_FREIGHTS_A11Y")}
						>
							<Ionicons name="document-text-outline" size={22} color={mapButtonIconColor} />
							<Text className="text-base font-semibold text-center" style={{ color: mapButtonTextColor }} numberOfLines={2}>
								{t("MAP.VIEW_FREIGHTS")}
							</Text>
						</TouchableOpacity>
					</View>
				) : null}
			</SafeAreaView>

		</View>
	);
}
