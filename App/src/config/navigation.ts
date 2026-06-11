/** Distância máxima para snap do progresso na polyline (filtro de ruído GPS). */
export const NAV_SNAP_MAX_DISTANCE_M = 35;

/** Janela para trás no map-matching direcional (evita snap em trecho já passado). */
export const NAV_MAP_MATCH_BACKWARD_WINDOW_M = 50;

/** Janela para frente no map-matching direcional (curvas e vias paralelas). */
export const NAV_MAP_MATCH_FORWARD_WINDOW_M = 140;

/** Precisão GPS acima disso reduz confiança no snap (metros). */
export const NAV_GPS_LOW_ACCURACY_M = 28;

/** Distância raw→snap para exibir linha conectora de deriva GPS. */
export const NAV_GPS_DRIFT_CONNECTOR_MIN_M = 10;

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

/** Intervalo máximo entre leituras GPS na navegação (ms). */
export const NAV_GPS_TIME_INTERVAL_MS = 400;

/** Deslocamento mínimo para nova leitura GPS na navegação (metros). */
export const NAV_GPS_DISTANCE_INTERVAL_M = 1;

/** Intervalo do GPS no mapa fora da navegação ativa (ms). */
export const MAP_PREVIEW_GPS_TIME_INTERVAL_MS = 1500;

/** Deslocamento mínimo no mapa fora da navegação ativa (metros). */
export const MAP_PREVIEW_GPS_DISTANCE_INTERVAL_M = 3;
