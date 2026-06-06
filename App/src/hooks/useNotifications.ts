import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import http from '@/src/services/http';
import { useWebSocket } from '@/src/hooks/useWebSocket';
import { buildNotificationsWebSocketUrl } from '@/src/utils/toWebSocketUrl';

export type AppNotification = {
  id: number;
  type: string;
  title: string;
  body: string;
  message: string;
  metadata: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
};

type ApiNotification = {
  id: number;
  user_id: number;
  type: string;
  title: string;
  body: string;
  metadata: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
};

function mapNotification(item: ApiNotification): AppNotification {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    body: item.body,
    message: item.body,
    metadata: item.metadata,
    read_at: item.read_at,
    created_at: item.created_at,
  };
}

function mergeNotification(list: AppNotification[], incoming: AppNotification): AppNotification[] {
  if (list.some((item) => item.id === incoming.id)) {
    return list;
  }
  return [incoming, ...list];
}

export function useNotifications() {
  const { id, token, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const wsUrl = useMemo(() => {
    if (!token) return null;
    return buildNotificationsWebSocketUrl(token);
  }, [token]);

  const fetchUnread = useCallback(async () => {
    if (id == null) return;
    setLoading(true);
    try {
      const { data } = await http.get<ApiNotification[]>(`notifications/${id}`);
      setNotifications(data.map(mapNotification));
    } catch {
      /* keep current list on failure */
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleWsMessage = useCallback((payload: unknown) => {
    if (!payload || typeof payload !== 'object') return;
    const event = payload as { event?: string; data?: ApiNotification | ApiNotification[] };

    if (event.event === 'NEW_NOTIFICATION' && event.data && !Array.isArray(event.data)) {
      const mapped = mapNotification(event.data);
      setNotifications((prev) => mergeNotification(prev, mapped));
      return;
    }

    if (event.event === 'UNREAD_NOTIFICATIONS' && Array.isArray(event.data)) {
      setNotifications(event.data.map(mapNotification));
    }
  }, []);

  useWebSocket({
    url: wsUrl,
    token,
    onMessage: handleWsMessage,
    enabled: Boolean(isAuthenticated && token && id),
  });

  useEffect(() => {
    if (isAuthenticated && id != null) {
      void fetchUnread();
    } else {
      setNotifications([]);
    }
  }, [fetchUnread, id, isAuthenticated]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.read_at == null).length,
    [notifications],
  );

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await http.patch(`notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId
            ? { ...item, read_at: new Date().toISOString() }
            : item,
        ),
      );
    } catch {
      /* ignore */
    }
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    clearAll,
    refetch: fetchUnread,
  };
}
