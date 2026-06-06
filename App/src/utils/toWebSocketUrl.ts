import { ENV_BASE_URL } from '@env';

export function toWebSocketUrl(baseUrl: string, token: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, '');
  const wsBase = trimmed.replace(/^http:\/\//i, 'ws://').replace(/^https:\/\//i, 'wss://');
  const root = wsBase.replace(/\/api$/i, '');
  return `${root}/api/ws?token=${encodeURIComponent(token)}`;
}

export function buildNotificationsWebSocketUrl(token: string): string {
  return toWebSocketUrl(ENV_BASE_URL, token);
}
