/** Distância máxima para snap do progresso na polyline (filtro de ruído GPS). */
export const NAV_SNAP_MAX_DISTANCE_M = 35;

/** Acima desse valor o GPS é considerado fora da rota no app. */
export const NAV_OFF_ROUTE_THRESHOLD_M = 52;

/** Quantidade de leituras consecutivas fora da rota antes do recálculo. */
export const NAV_OFF_ROUTE_CONSECUTIVE_UPDATES = 4;

/** Janela mínima entre recálculos para evitar spam de API. */
export const NAV_REROUTE_COOLDOWN_MS = 22_000;

/** Distância mínima entre pontos de recálculo para evitar repetição no mesmo local. */
export const NAV_REROUTE_MIN_MOVE_M = 90;

/** Velocidade mínima (km/h) para considerar o veículo em movimento (evita flicker ao parar). */
export const NAV_MOVING_SPEED_THRESHOLD_KMH = 3;

/** Distância em metros para considerar "próximo ao destino" e mudar status para "Em Rota de Entrega". */
export const NAV_NEAR_DESTINATION_THRESHOLD_M = 5000; // 5 km
