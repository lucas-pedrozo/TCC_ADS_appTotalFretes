import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	View,
	ActivityIndicator,
	TouchableOpacity,
	Text,
	StyleSheet,
	Linking,
	LayoutAnimation,
	Platform,
	UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Mapbox, { UserTrackingMode, type MapState } from "@rnmapbox/maps";
import { Ionicons } from "@expo/vector-icons";
import * as turf from "@turf/turf";

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
	NAV_MOVING_SPEED_THRESHOLD_KMH,
	NAV_NEAR_DESTINATION_THRESHOLD_M,
} from "@/src/config/navigation";
import {
	getCurrentCoordinates,
	requestLocationPermission,
	startNavigationLocationWatch,
	type Coordinates,
	type NavigationLocationUpdate,
} from "@/src/services/location";
import { useGetFreightUser } from "@/src/hooks/freight/useGetFreightUser";
import { useGetMapBox } from "@/src/hooks/freight/useGetMapBox";
import { useUpdateFreightStatus } from "@/src/hooks/freight/useUpdateFreightStatus";
import { buildGoogleMapsDirectionsUrl, isUsableGps } from "@/src/utils/googleMapsDirections";
import { normalizeFreightStatusName } from "@/src/utils/freightStatus";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/routes/Routes";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import NavigationSpeedBadge from "@/src/components/mapbox/NavigationSpeedBadge";

type LngLat = [number, number];

const DEFAULT_ZOOM = 12;
const USER_ZOOM = 15;
const NAV_ZOOM = 17;
const MAX_BACKWARD_PROGRESS_M = 12;
const ROUTE_VIEW_PADDING: [number, number, number, number] = [120, 32, 220, 32];

if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
const NAV_CAMERA_ENTER_MS = 500	;
/** Buffer extra após a câmera chegar antes de mostrar o painel (ms). */
const NAV_PANEL_DELAY_AFTER_CAMERA_MS = 80;
/** Delay total antes do painel aparecer. */
const NAV_START_TOTAL_MS = NAV_CAMERA_ENTER_MS + NAV_PANEL_DELAY_AFTER_CAMERA_MS;
const CAMERA_ZOOM_SYNC_THROTTLE_MS = 90;
const CAMERA_ZOOM_SYNC_DELTA = 0.12;
const MAP_CAMERA_FAST_ANIMATION_MS = 360;
const NAV_DEFERRED_PROJECTION_DELAY_MS = 300;
const NAV_INITIAL_PROJECTION_MAX_POINTS = 20_000;
const PERF_TAG = "[MapPerf]";

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

function projectUserOntoPolyline(userLat: number, userLon: number, route: LngLat[]) {
	const userPoint = turf.point([userLon, userLat]);
	if (!route.length) {
		return {
			distanceAlongMeters: 0,
			nearestOnRoute: [userLon, userLat] as LngLat,
			distanceToRouteMeters: Number.POSITIVE_INFINITY,
		};
	}
	if (route.length === 1) {
		return {
			distanceAlongMeters: 0,
			nearestOnRoute: route[0],
			distanceToRouteMeters: distanceMeters(route[0], [userLon, userLat]),
		};
	}

	const snapped = turf.nearestPointOnLine(turf.lineString(route), userPoint, {
		units: "meters",
	});
	const props = snapped.properties as { dist?: number; location?: number };
	return {
		distanceAlongMeters: Number.isFinite(props.location) ? (props.location as number) : 0,
		nearestOnRoute: snapped.geometry.coordinates as LngLat,
		distanceToRouteMeters: Number.isFinite(props.dist)
			? (props.dist as number)
			: distanceMeters(snapped.geometry.coordinates as LngLat, [userLon, userLat]),
	};
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

function logPerf(event: string, meta?: Record<string, unknown>) {
	if (!__DEV__) return;
	const payload = meta ? ` ${JSON.stringify(meta)}` : "";
	console.log(`${PERF_TAG} ${event}${payload}`);
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
	const [navigationLocation, setNavigationLocation] = useState<NavigationLocationUpdate | null>(null);
	const [routeProgressAlongM, setRouteProgressAlongM] = useState(0);
	const [isStartingNav, setIsStartingNav] = useState(false);
	const [isDriverOnRoute, setIsDriverOnRoute] = useState(false);
	const cameraRef = useRef<CameraRef>(null);
	const startNavTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const deferredProjectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const navStartPerfRef = useRef<number | null>(null);
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

	const { freightUser, handleGetFreightUser } = useGetFreightUser();
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

	const isNavActive = navState === "running" || navState === "paused";

	const activeCoords = useMemo((): Coordinates | null => {
		if (navState === "running" || navState === "paused") {
			return navigationLocation
				? { latitude: navigationLocation.latitude, longitude: navigationLocation.longitude }
				: coords;
		}
		return coords;
	}, [navState, navigationLocation, coords]);

	const speedKmh = navigationLocation?.speedKmh ?? 0;
	const isMoving = isNavActive && speedKmh >= NAV_MOVING_SPEED_THRESHOLD_KMH;
	const puckBearing = isMoving ? "course" : "heading";
	const dynamicFollowUserMode = isMoving
		? UserTrackingMode.FollowWithCourse
		: UserTrackingMode.FollowWithHeading;

	const followUserActive =
		navState === "running" && Boolean(activeCoords && !error && navFollowUser);

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
		cameraRef.current?.setCamera({
			centerCoordinate: [coords.longitude, coords.latitude],
			zoomLevel: USER_ZOOM,
			animationDuration: 0,
		});
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
			const p = projectUserOntoPolyline(user.latitude, user.longitude, routeLngLat);
			setRouteProgressAlongM(p.distanceAlongMeters);
		} else {
			setRouteProgressAlongM(0);
		}
	}, [geometrySignature, routeLngLat, navState, navigationLocation, coords]);

	/** GPS contínuo só com navegação ativa (economiza bateria). */
	useEffect(() => {
		if (navState !== "running") return;
		let cancelled = false;
		let watcher: { remove: () => void } | null = null;
		void (async () => {
			const w = await startNavigationLocationWatch((update) => {
				if (!cancelled) setNavigationLocation(update);
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

		const proj = projectUserOntoPolyline(user.latitude, user.longitude, routeLngLat);
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

		if (proj.distanceToRouteMeters > NAV_SNAP_MAX_DISTANCE_M) return;

		setRouteProgressAlongM((prev) =>
			clampMonotonicProgress(prev, proj.distanceAlongMeters),
		);
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
		ignoreMapGestureUnfollowUntilRef.current = Date.now() + 900;
		syncCurrentZoom(NAV_ZOOM, true);
		cameraRef.current?.setCamera({
			centerCoordinate: [activeCoords.longitude, activeCoords.latitude],
			zoomLevel: NAV_ZOOM,
			pitch: 45,
			padding: { ...MAP_EDGE_PADDING_NAV_FOLLOW },
			animationDuration: MAP_CAMERA_FAST_ANIMATION_MS,
		});
	}, [activeCoords, syncCurrentZoom]);

	const handleCentralizarMinhaLocalizacao = useCallback(() => {
		if (!activeCoords) return;
		ignoreMapGestureUnfollowUntilRef.current = Date.now() + 1200;

		if (navState === "running") {
			setNavFollowUser(true);
			applyFollowVehicleCamera();
			return;
		}

		if (navState === "paused") {
			setNavFollowUser(true);
			syncCurrentZoom(NAV_ZOOM, true);
			cameraRef.current?.setCamera({
				centerCoordinate: [activeCoords.longitude, activeCoords.latitude],
				zoomLevel: NAV_ZOOM,
				pitch: 45,
				padding: { ...MAP_EDGE_PADDING_NAV_FOLLOW },
				animationDuration: MAP_CAMERA_FAST_ANIMATION_MS,
			});
			return;
		}

		syncCurrentZoom(USER_ZOOM, true);
		cameraRef.current?.setCamera({
			centerCoordinate: [activeCoords.longitude, activeCoords.latitude],
			zoomLevel: USER_ZOOM,
			animationDuration: MAP_CAMERA_FAST_ANIMATION_MS,
		});
	}, [activeCoords, navState, applyFollowVehicleCamera, syncCurrentZoom]);

	const handleZoomIn = useCallback(() => {
		const next = Math.min((currentZoom ?? zoom) + 1, 20);
		syncCurrentZoom(next, true);
		cameraRef.current?.setCamera({
			zoomLevel: next,
			animationDuration: MAP_CAMERA_FAST_ANIMATION_MS,
		});
	}, [currentZoom, zoom, syncCurrentZoom]);

	const handleZoomOut = useCallback(() => {
		const next = Math.max((currentZoom ?? zoom) - 1, 2);
		syncCurrentZoom(next, true);
		cameraRef.current?.setCamera({
			zoomLevel: next,
			animationDuration: MAP_CAMERA_FAST_ANIMATION_MS,
		});
	}, [currentZoom, zoom, syncCurrentZoom]);

	const handleIniciarNavegacao = useCallback(() => {
		if (!rotaData || loadingRota || isStartingNav) return;

		setIsStartingNav(true);
		navStartPerfRef.current = Date.now();
		logPerf("nav_start_tap", {
			hasCoords: Boolean(coords && !error),
			routePoints: lineCoordinates?.length ?? 0,
		});

		ignoreMapGestureUnfollowUntilRef.current = Date.now() + NAV_START_TOTAL_MS + 800;
		setNavFollowUser(true);

		// Passo 1 — anima câmera imediatamente para a posição de navegação.
		// O painel de nav só aparece APÓS a animação terminar (NAV_START_TOTAL_MS),
		// então o usuário já vê a câmera posicionada antes de ver o painel.
		if (coords && !error) {
			syncCurrentZoom(NAV_ZOOM, true);
			cameraRef.current?.setCamera({
				centerCoordinate: [coords.longitude, coords.latitude],
				zoomLevel: NAV_ZOOM,
				pitch: 45,
				padding: { ...MAP_EDGE_PADDING_NAV_FOLLOW },
				animationDuration: NAV_CAMERA_ENTER_MS,
			});
		} else if (lineCoordinates?.length) {
			void fitCameraToRoute(lineCoordinates as LngLat[], NAV_CAMERA_ENTER_MS);
		}

		logPerf("nav_camera_enter_started", {
			elapsedMs: Date.now() - (navStartPerfRef.current ?? Date.now()),
		});

		// Passo 2 — aguarda câmera chegar e faz a transição do painel.
		if (startNavTimeoutRef.current) clearTimeout(startNavTimeoutRef.current);
		startNavTimeoutRef.current = setTimeout(() => {
			startNavTimeoutRef.current = null;
			LayoutAnimation.configureNext(NAV_UI_LAYOUT_ANIM);
			setNavState("running");
			setIsStartingNav(false);
			logPerf("nav_running_state_set", {
				elapsedMs: Date.now() - (navStartPerfRef.current ?? Date.now()),
			});

			// Passo 3 — projeção inicial adiada para não bloquear a transição do painel.
			if (deferredProjectionTimeoutRef.current) {
				clearTimeout(deferredProjectionTimeoutRef.current);
			}
			if (coords && !error && lineCoordinates?.length &&
				lineCoordinates.length <= NAV_INITIAL_PROJECTION_MAX_POINTS) {
				deferredProjectionTimeoutRef.current = setTimeout(() => {
					deferredProjectionTimeoutRef.current = null;
					const p = projectUserOntoPolyline(
						coords.latitude,
						coords.longitude,
						lineCoordinates as LngLat[],
					);
					if (p.distanceToRouteMeters <= NAV_SNAP_MAX_DISTANCE_M + 80) {
						setRouteProgressAlongM(p.distanceAlongMeters);
					}
					logPerf("nav_initial_projection_done", {
						elapsedMs: Date.now() - (navStartPerfRef.current ?? Date.now()),
						distanceToRouteM: Math.round(p.distanceToRouteMeters),
					});
				}, NAV_DEFERRED_PROJECTION_DELAY_MS);
			}
		}, NAV_START_TOTAL_MS);
	}, [rotaData, loadingRota, isStartingNav, coords, error, lineCoordinates, fitCameraToRoute, syncCurrentZoom]);

	const handleVerRotaCompleta = useCallback(() => {
		if (!lineCoordinates?.length) return;
		setNavFollowUser(false);
		cameraRef.current?.setCamera({
			pitch: 0,
			animationDuration: 700,
		});
		void fitCameraToRoute(lineCoordinates as LngLat[], 700);
	}, [lineCoordinates, fitCameraToRoute]);

	const handleMapCameraChanged = useCallback(
		(state: MapState) => {
			const nextZoom = state.properties?.zoom;
			if (typeof nextZoom === "number" && Number.isFinite(nextZoom)) {
				const now = Date.now();
				const delta = Math.abs(nextZoom - lastZoomSyncedValueRef.current);
				const shouldSyncZoom =
					delta >= CAMERA_ZOOM_SYNC_DELTA &&
					(now - lastZoomSyncAtRef.current >= CAMERA_ZOOM_SYNC_THROTTLE_MS || delta >= 0.35);
				if (shouldSyncZoom) {
					lastZoomSyncAtRef.current = now;
					syncCurrentZoom(nextZoom);
				}
			}
			if (navState !== "running") return;
			if (Date.now() < ignoreMapGestureUnfollowUntilRef.current) return;
			if (!state.gestures?.isGestureActive) return;
			setNavFollowUser((prev) => (prev ? false : prev));
		},
		[navState, syncCurrentZoom],
	);

	const handlePausarOuContinuar = useCallback(() => {
		if (navState === "running") {
			LayoutAnimation.configureNext(NAV_UI_LAYOUT_ANIM);
			setNavFollowUser(false);
			setNavState("paused");
			const snapshot = activeCoords;
			requestAnimationFrame(() => {
				if (!snapshot) return;
				cameraRef.current?.setCamera({
					centerCoordinate: [snapshot.longitude, snapshot.latitude],
					zoomLevel: NAV_ZOOM,
					pitch: 45,
					padding: { ...MAP_EDGE_PADDING_NAV_FOLLOW },
					animationDuration: MAP_CAMERA_FAST_ANIMATION_MS,
				});
			});
			return;
		}
		if (navState === "paused") {
			LayoutAnimation.configureNext(NAV_UI_LAYOUT_ANIM);
			ignoreMapGestureUnfollowUntilRef.current = Date.now() + 600;
			setNavFollowUser(true);
			setNavState("running");
			requestAnimationFrame(() => applyFollowVehicleCamera());
		}
	}, [navState, activeCoords, applyFollowVehicleCamera]);

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
		LayoutAnimation.configureNext(NAV_UI_LAYOUT_ANIM);
		setNavState("idle");
		setNavFollowUser(true);
		const routeCoords = lineCoordinates as LngLat[] | undefined;
		requestAnimationFrame(() => {
			cameraRef.current?.setCamera({
				pitch: 0,
				animationDuration: CAMERA_ANIMATION_MS,
			});
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
		<View className="flex-1">
			<Mapbox.MapView
				style={{ flex: 1 }}
				styleURL={styleURL}
				onCameraChanged={handleMapCameraChanged}
			>
			<Mapbox.Camera
				ref={cameraRef}
				animationMode="flyTo"
				animationDuration={MAP_CAMERA_FAST_ANIMATION_MS}
				followUserLocation={followUserActive}
				followUserMode={dynamicFollowUserMode}
				followZoomLevel={NAV_ZOOM}
				followPitch={45}
				followPadding={
					followUserActive ? MAP_EDGE_PADDING_NAV_FOLLOW : MAP_EDGE_PADDING_IDLE
				}
			/>
			<Mapbox.LocationPuck
				visible={!error}
				puckBearingEnabled={isNavActive}
				puckBearing={puckBearing}
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
					style={{ top: 56, backgroundColor: colors.bg, borderColor: colors.bgNonary, borderWidth: 1 }}
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
					accessibilityLabel={t("MAP.ZOOM_IN_A11Y")}
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
					accessibilityLabel={t("MAP.ZOOM_OUT_A11Y")}
				>
					<Ionicons name="remove" size={24} color={iconColor} />
				</TouchableOpacity>
				<TouchableOpacity
					className="w-11 h-11 rounded-xl border items-center justify-center"
					style={{ backgroundColor: colors.bg, borderColor: colors.bgNonary, borderWidth: 1 }}
					onPress={handleCentralizarMinhaLocalizacao}
					accessibilityRole="button"
					accessibilityLabel={t("MAP.CENTER_LOCATION_A11Y")}
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
							navFollowUser ? t("MAP.ENABLE_FREE_NAV_A11Y") : t("MAP.LINK_MAP_TO_CAR_A11Y")
						}
					>
						<Text className="text-xs font-semibold" style={{ color: navFollowUser ? colors.textSecondary : colors.bgOctonary }}>
							{navFollowUser ? t("MAP.FREE") : t("MAP.CAR")}
						</Text>
					</TouchableOpacity>
				) : null}
			</SafeAreaView>

			<SafeAreaView
				className={`absolute bottom-0 left-0 right-0 z-10 gap-2 ${isNavActive ? "px-2 pb-3 pt-1" : "px-3 pb-2"}`}
				edges={["bottom"]}
				pointerEvents="box-none"
			>
				{rotaData && navState === "idle" ? (
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
							{t("MAP.ROUTE_PREVIEW")}
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
									{t("MAP.UNTIL_PICKUP")}
								</Text>
								<Text className="text-base font-semibold mt-1" style={{ color: colors.text }}>
									{rotaData.trecho_ate_carga.distancia_km.toFixed(1)} km · ~
									{Math.round(rotaData.trecho_ate_carga.tempo_min)} min
								</Text>
								<Text className="text-xs mt-1" style={{ color: colors.textSecondary }}>
									{t("MAP.UNTIL_PICKUP_HINT")}
								</Text>
							</View>
						) : null}
						<View
							className="mt-3 flex-row items-center justify-between px-1 pt-3"
							style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.bgNonary }}
						>
							<View className="flex-1 items-center">
								<Text className="text-xs" style={{ color: colors.textSecondary }}>
									{t("MAP.DISTANCE")}
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
									{t("MAP.ESTIMATED_TIME")}
								</Text>
							<Text className="text-xl font-semibold mt-1" style={{ color: colors.text }}>
								{rotaData.tempo_total_min != null
									? formatDriveDuration(rotaData.tempo_total_min)
									: "—"}
							</Text>
							</View>
						</View>

						<View className="mt-4">
							<TouchableOpacity
								className="w-full py-3.5 rounded-2xl items-center justify-center"
								style={{
									backgroundColor: colors.bgOctonary,
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
										<ActivityIndicator size="small" color="#FFFFFF" />
										<Text className="text-base font-semibold" style={{ color: "#FFFFFF" }}>
											{t("MAP.STARTING_NAV")}
										</Text>
									</View>
								) : (
									<Text className="text-base font-semibold" style={{ color: "#FFFFFF" }}>
										{t("MAP.START_NAV")}
									</Text>
								)}
							</TouchableOpacity>
						</View>
					</View>
				) : null}

				{isNavActive ? (
					<View className="self-start" style={{ marginBottom: 0 }} pointerEvents="none">
						<NavigationSpeedBadge speedKmh={speedKmh} visible={isNavActive} />
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
								accessibilityLabel={t("MAP.END_NAV_A11Y")}
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
								accessibilityLabel={t("MAP.VIEW_FULL_ROUTE_A11Y")}
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
									{navState === "paused" ? t("MAP.CONTINUE") : t("MAP.PAUSE")}
								</Text>
							</TouchableOpacity>
							{navState === "running" ? (
								<TouchableOpacity
									onPress={handleAlternarModoNavegacao}
									accessibilityRole="button"
									hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
								>
									<Text className="text-base font-semibold" style={{ color: navFollowUser ? colors.textSecondary : colors.bgOctonary }}>
										{navFollowUser ? t("MAP.FREE_NAVIGATION") : t("MAP.LINK_TO_CAR")}
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
