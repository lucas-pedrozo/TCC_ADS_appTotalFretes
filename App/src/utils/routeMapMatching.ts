import * as turf from "@turf/turf";

export type LngLat = [number, number];

export type RouteProjection = {
	distanceAlongMeters: number;
	nearestOnRoute: LngLat;
	distanceToRouteMeters: number;
};

export type ProjectOntoRouteOptions = {
	/** Progresso atual na rota — restringe o snap a uma janela à frente/atrás. */
	progressHintMeters?: number | null;
	backwardWindowM?: number;
	forwardWindowM?: number;
	headingDeg?: number | null;
	speedKmh?: number | null;
};

function distanceMeters(a: LngLat, b: LngLat): number {
	return turf.distance(turf.point(a), turf.point(b), { units: "meters" });
}

function bearingDiff(a: number, b: number): number {
	let delta = Math.abs(a - b) % 360;
	if (delta > 180) delta = 360 - delta;
	return delta;
}

function projectOntoLine(route: LngLat[], userLat: number, userLon: number): RouteProjection {
	const userPoint = turf.point([userLon, userLat]);
	if (!route.length) {
		return {
			distanceAlongMeters: 0,
			nearestOnRoute: [userLon, userLat],
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

function sliceRouteWindow(
	route: LngLat[],
	progressMeters: number,
	backwardM: number,
	forwardM: number,
): { coords: LngLat[]; offsetAlongMeters: number } {
	if (route.length < 2) {
		return { coords: route, offsetAlongMeters: 0 };
	}

	const line = turf.lineString(route);
	const totalM = turf.length(line, { units: "kilometers" }) * 1000;
	const startM = Math.max(0, progressMeters - backwardM);
	const endM = Math.min(totalM, progressMeters + forwardM);

	if (endM - startM < 2) {
		return { coords: route, offsetAlongMeters: 0 };
	}

	const sliced = turf.lineSliceAlong(line, startM / 1000, endM / 1000, {
		units: "kilometers",
	}).geometry.coordinates as LngLat[];

	return {
		coords: sliced.length >= 2 ? sliced : route,
		offsetAlongMeters: startM,
	};
}

export function bearingAlongRouteAtDistance(
	route: LngLat[],
	distanceAlongMeters: number,
): number | null {
	if (route.length < 2) return null;

	const line = turf.lineString(route);
	const totalKm = turf.length(line, { units: "kilometers" });
	const progressKm = Math.max(0, Math.min(distanceAlongMeters / 1000, totalKm));
	const lookAheadKm = Math.min(totalKm, progressKm + 0.02);
	const lookBehindKm = Math.max(0, progressKm - 0.002);

	if (lookAheadKm <= lookBehindKm) return null;

	const fromPoint = turf.along(line, lookBehindKm, { units: "kilometers" });
	const toPoint = turf.along(line, lookAheadKm, { units: "kilometers" });
	return turf.bearing(fromPoint, toPoint);
}

/**
 * Projeta o GPS na polyline com map-matching direcional.
 * Sem progressHint, usa a rota inteira (início da navegação).
 * Com progressHint, busca só numa janela ao redor do progresso atual —
 * evita snap em trecho paralelo ou em curva já percorrida.
 */
export function projectUserOntoRoute(
	userLat: number,
	userLon: number,
	route: LngLat[],
	options: ProjectOntoRouteOptions = {},
): RouteProjection {
	const {
		progressHintMeters,
		backwardWindowM = 45,
		forwardWindowM = 120,
		headingDeg,
		speedKmh,
	} = options;

	let searchRoute = route;
	let alongOffset = 0;

	if (
		progressHintMeters != null &&
		Number.isFinite(progressHintMeters) &&
		route.length >= 2
	) {
		const windowed = sliceRouteWindow(
			route,
			progressHintMeters,
			backwardWindowM,
			forwardWindowM,
		);
		searchRoute = windowed.coords;
		alongOffset = windowed.offsetAlongMeters;
	}

	const projection = projectOntoLine(searchRoute, userLat, userLon);
	const result: RouteProjection = {
		...projection,
		distanceAlongMeters: projection.distanceAlongMeters + alongOffset,
	};

	const isMovingFast =
		speedKmh != null && Number.isFinite(speedKmh) && speedKmh >= 8;
	const hasHeading =
		headingDeg != null && Number.isFinite(headingDeg) && headingDeg >= 0;

	if (
		isMovingFast &&
		hasHeading &&
		progressHintMeters != null &&
		route.length >= 2
	) {
		const routeBearing = bearingAlongRouteAtDistance(route, result.distanceAlongMeters);
		if (routeBearing != null && bearingDiff(routeBearing, headingDeg) > 95) {
			const forwardOnly = sliceRouteWindow(route, progressHintMeters, 8, forwardWindowM * 1.4);
			const alt = projectOntoLine(forwardOnly.coords, userLat, userLon);
			alt.distanceAlongMeters += forwardOnly.offsetAlongMeters;

			if (
				alt.distanceToRouteMeters <= result.distanceToRouteMeters + 10 &&
				alt.distanceAlongMeters >= (progressHintMeters ?? 0) - 15
			) {
				return alt;
			}
		}
	}

	return result;
}
