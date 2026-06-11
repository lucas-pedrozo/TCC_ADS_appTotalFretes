import type { Coordinates } from "@/src/services/location";

export function isUsableGps(c: Coordinates): boolean {
	if (!Number.isFinite(c.latitude) || !Number.isFinite(c.longitude)) return false;
	if (Math.abs(c.latitude) > 90 || Math.abs(c.longitude) > 180) return false;
	if (Math.abs(c.latitude) < 1e-4 && Math.abs(c.longitude) < 1e-4) return false;
	return true;
}

/**
 * URL do Google Maps: origem (caminhoneiro) → parada em `waypoints` (saída) → destino.
 */
export function buildGoogleMapsDirectionsUrl(params: {
	origin: Coordinates | null;
	waypointLabel: string;
	destinationLabel: string;
}): string {
	const q = new URLSearchParams();
	q.set("api", "1");
	q.set("travelmode", "driving");
	q.set("destination", params.destinationLabel.trim());
	const stop = params.waypointLabel.trim();
	if (stop) q.set("waypoints", stop);
	if (params.origin && isUsableGps(params.origin)) {
		q.set("origin", `${params.origin.latitude},${params.origin.longitude}`);
	}
	return `https://www.google.com/maps/dir/?${q.toString()}`;
}
