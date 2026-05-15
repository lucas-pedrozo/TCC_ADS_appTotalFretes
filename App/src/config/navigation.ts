/** Distância máxima para snap do progresso na polyline (filtro de ruído GPS). */
export const NAV_SNAP_MAX_DISTANCE_M = 55;

/** Acima desse valor o GPS é considerado fora da rota no app. */
export const NAV_OFF_ROUTE_THRESHOLD_M = 52;

/** Quantidade de leituras consecutivas fora da rota antes do recálculo. */
export const NAV_OFF_ROUTE_CONSECUTIVE_UPDATES = 4;

/** Janela mínima entre recálculos para evitar spam de API. */
export const NAV_REROUTE_COOLDOWN_MS = 22_000;

/** Distância mínima entre pontos de recálculo para evitar repetição no mesmo local. */
export const NAV_REROUTE_MIN_MOVE_M = 90;
