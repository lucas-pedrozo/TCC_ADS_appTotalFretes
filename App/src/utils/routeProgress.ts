/**
 * Progresso ao longo de uma LineString GeoJSON [lng, lat] e detecção de desvio.
 * Sem dependências externas (Haversine + projeção em segmento).
 */

export type LngLat = [number, number];

const EARTH_RADIUS_M = 6_371_008.8;

function toRad(d: number): number {
	return (d * Math.PI) / 180;
}

/** Distância em metros entre dois pontos WGS84. */
export function haversineMeters(a: LngLat, b: LngLat): number {
	const [lon1, lat1] = a;
	const [lon2, lat2] = b;
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const s1 = Math.sin(dLat / 2);
	const s2 = Math.sin(dLon / 2);
	const h =
		s1 * s1 +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * s2 * s2;
	return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Comprimento total da polyline em metros. */
export function polylineLengthMeters(coords: LngLat[]): number {
	if (coords.length < 2) return 0;
	let sum = 0;
	for (let i = 0; i < coords.length - 1; i++) {
		sum += haversineMeters(coords[i], coords[i + 1]);
	}
	return sum;
}

/**
 * Projeta um ponto (lat/lon) na polyline e retorna distância acumulada até o ponto mais próximo,
 * o ponto projetado e a distância perpendicular aproximada até a linha.
 */
export function projectUserOntoPolyline(
	userLat: number,
	userLon: number,
	route: LngLat[],
): {
	distanceAlongMeters: number;
	nearestOnRoute: LngLat;
	segmentIndex: number;
	distanceToRouteMeters: number;
} {
	const user: LngLat = [userLon, userLat];
	if (route.length === 0) {
		return {
			distanceAlongMeters: 0,
			nearestOnRoute: user,
			segmentIndex: 0,
			distanceToRouteMeters: Number.POSITIVE_INFINITY,
		};
	}
	if (route.length === 1) {
		const d = haversineMeters(route[0], user);
		return {
			distanceAlongMeters: 0,
			nearestOnRoute: route[0],
			segmentIndex: 0,
			distanceToRouteMeters: d,
		};
	}

	let bestDist = Number.POSITIVE_INFINITY;
	let bestAlong = 0;
	let bestPoint: LngLat = route[0];
	let bestSeg = 0;
	let cumulative = 0;

	for (let i = 0; i < route.length - 1; i++) {
		const a = route[i];
		const b = route[i + 1];
		const segLen = haversineMeters(a, b);
		if (segLen < 1e-6) {
			cumulative += segLen;
			continue;
		}

		const [lonA, latA] = a;
		const [lonB, latB] = b;
		const latU = userLat;
		const lonU = userLon;

		// Projeção em graus (aproximação local; suficiente para segmentos curtos)
		const dLat = latB - latA;
		const dLon = lonB - lonA;
		const dLatU = latU - latA;
		const dLonU = lonU - lonA;
		const t = Math.max(
			0,
			Math.min(1, (dLatU * dLat + dLonU * dLon) / (dLat * dLat + dLon * dLon || 1e-12)),
		);
		const projLon = lonA + t * dLon;
		const projLat = latA + t * dLat;
		const proj: LngLat = [projLon, projLat];

		const dUser = haversineMeters([lonU, latU], proj);
		const along = cumulative + t * segLen;

		if (dUser < bestDist) {
			bestDist = dUser;
			bestAlong = along;
			bestPoint = proj;
			bestSeg = i;
		}
		cumulative += segLen;
	}

	return {
		distanceAlongMeters: bestAlong,
		nearestOnRoute: bestPoint,
		segmentIndex: bestSeg,
		distanceToRouteMeters: bestDist,
	};
}

export type SplitRouteResult = {
	completed: LngLat[];
	remaining: LngLat[];
	distanceAlongMeters: number;
};

/**
 * Corta a rota no ponto a `distanceAlongMeters` do início (ao longo da polyline).
 */
export function splitRouteAtDistance(
	route: LngLat[],
	distanceAlongMeters: number,
): SplitRouteResult {
	if (!route.length) {
		return { completed: [], remaining: [], distanceAlongMeters: 0 };
	}
	if (route.length === 1) {
		return {
			completed: [...route],
			remaining: [],
			distanceAlongMeters: 0,
		};
	}

	let remainingBudget = Math.max(0, distanceAlongMeters);
	const completed: LngLat[] = [route[0]];

	for (let i = 0; i < route.length - 1; i++) {
		const a = route[i];
		const b = route[i + 1];
		const segLen = haversineMeters(a, b);
		if (segLen < 1e-6) {
			if (remainingBudget <= 0) {
				// ainda no início
				continue;
			}
			remainingBudget -= segLen;
			completed.push(b);
			continue;
		}
		if (remainingBudget >= segLen) {
			remainingBudget -= segLen;
			completed.push(b);
			continue;
		}
		// Corte dentro do segmento [a,b]
		const t = Math.max(0, Math.min(1, remainingBudget / segLen));
		if (t <= 1e-9) {
			const rest = route.slice(i);
			return {
				completed: route.slice(0, i + 1),
				remaining: rest,
				distanceAlongMeters,
			};
		}
		const [lonA, latA] = a;
		const [lonB, latB] = b;
		const cut: LngLat = [
			lonA + t * (lonB - lonA),
			latA + t * (latB - latA),
		];
		completed.push(cut);
		const rest = [cut, ...route.slice(i + 1)];
		return {
			completed,
			remaining: rest,
			distanceAlongMeters,
		};
	}

	// Percorreu tudo
	return {
		completed: [...route],
		remaining: [],
		distanceAlongMeters: polylineLengthMeters(route),
	};
}

/**
 * Avança o progresso de forma monotônica com histerese leve.
 */
export function clampMonotonicProgress(
	previousAlongMeters: number,
	proposedAlongMeters: number,
	options?: { maxBackwardMeters?: number },
): number {
	const maxBack = options?.maxBackwardMeters ?? 12;
	return Math.max(previousAlongMeters - maxBack, proposedAlongMeters);
}
