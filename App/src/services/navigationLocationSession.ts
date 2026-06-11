/**
 * Indica que o MapScreen está em navegação ativa e já publica telemetria/GPS.
 * Evita watchers duplicados de localização (causa comum de instabilidade no Android).
 */
type Listener = () => void;

let mapNavigationActive = false;
const listeners = new Set<Listener>();

export function setMapNavigationActive(active: boolean): void {
	if (mapNavigationActive === active) return;
	mapNavigationActive = active;
	listeners.forEach((listener) => listener());
}

export function isMapNavigationActive(): boolean {
	return mapNavigationActive;
}

export function subscribeMapNavigationActive(listener: Listener): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
