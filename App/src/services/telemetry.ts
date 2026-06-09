import * as Location from 'expo-location';

import http from '@/src/services/http';

const MIN_PUBLISH_INTERVAL_MS = 5_000;

let lastPublishAt = 0;
let publishInFlight = false;

export type TelemetryPublishInput = {
	freightId: number;
	latitude: number;
	longitude: number;
	speed?: number | null;
	heading?: number | null;
};

export async function publishDriverLocation(input: TelemetryPublishInput): Promise<void> {
	const now = Date.now();
	if (publishInFlight || now - lastPublishAt < MIN_PUBLISH_INTERVAL_MS) {
		return;
	}

	publishInFlight = true;
	lastPublishAt = now;

	try {
		await http.post<TelemetryPublishInput>('mapbox/telemetry/location', {
			...input,
			recordedAt: new Date().toISOString(),
		});
	} catch {
	} finally {
		publishInFlight = false;
	}
}

export type TelemetryLocationWatcher = {
	remove: () => void;
};

export async function startFreightTelemetryWatch(
	freightId: number,
	onError?: (error: unknown) => void,
): Promise<TelemetryLocationWatcher | null> {
	const { status } = await Location.requestForegroundPermissionsAsync();
	if (status !== 'granted') return null;

	const sub = await Location.watchPositionAsync(
		{
			accuracy: Location.Accuracy.BestForNavigation,
			timeInterval: 5_000,
			distanceInterval: 5,
		},
		(loc) => {
			const speedMs = loc.coords.speed;
			const speedKmh =
				speedMs != null && Number.isFinite(speedMs) ? Math.max(0, speedMs * 3.6) : null;
			const heading = loc.coords.heading;

			void publishDriverLocation({
				freightId,
				latitude: loc.coords.latitude,
				longitude: loc.coords.longitude,
				speed: speedKmh,
				heading: heading != null && Number.isFinite(heading) ? heading : null,
			}).catch((error) => onError?.(error));
		},
	);

	return {
		remove: () => {
			sub.remove();
		},
	};
}
