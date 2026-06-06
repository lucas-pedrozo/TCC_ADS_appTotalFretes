import { useCallback, useEffect, useRef, useState } from 'react';

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

type UseWebSocketOptions = {
  url: string | null;
  token: string | null;
  onMessage?: (data: unknown) => void;
  enabled?: boolean;
};

const BACKOFF_STEPS_MS = [1000, 2000, 4000, 8000, 30000];

export function useWebSocket({ url, token, onMessage, enabled = true }: UseWebSocketOptions) {
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onMessageRef = useRef(onMessage);
  const connectRef = useRef<() => void>(() => {});

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const cleanupSocket = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (!enabled || !url || !token) return;

    const attempt = reconnectAttemptRef.current;
    const delay = BACKOFF_STEPS_MS[Math.min(attempt, BACKOFF_STEPS_MS.length - 1)];
    reconnectAttemptRef.current += 1;

    reconnectTimerRef.current = setTimeout(() => {
      connectRef.current();
    }, delay);
  }, [enabled, token, url]);

  const connect = useCallback(() => {
    if (!enabled || !url || !token) {
      setStatus('disconnected');
      return;
    }

    cleanupSocket();
    setStatus('connecting');

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttemptRef.current = 0;
        setStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(String(event.data));
          onMessageRef.current?.(parsed);
        } catch {
          /* ignore malformed payloads */
        }
      };

      ws.onerror = () => {
        setStatus('error');
      };

      ws.onclose = () => {
        wsRef.current = null;
        setStatus('disconnected');
        scheduleReconnect();
      };
    } catch {
      setStatus('error');
      scheduleReconnect();
    }
  }, [cleanupSocket, enabled, scheduleReconnect, token, url]);

  connectRef.current = connect;

  useEffect(() => {
    connect();
    return () => {
      cleanupSocket();
    };
  }, [connect, cleanupSocket]);

  return { status };
}
