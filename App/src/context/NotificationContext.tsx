import React, { createContext, useCallback, useState, useContext, useRef } from "react";
import { AlertStatus } from "@/src/types/statusNotify";

/**
 * @description Interface de estado de notificacao
 * @returns Interface de estado de notificacao
 */
export interface NotificationState {
  visible: boolean;
  status: AlertStatus;
  message?: string;
}

/**
 * @description Interface de payload de notificacao
 * @returns Interface de payload de notificacao
 */
export interface NotifyPayload {
  status: AlertStatus;
  message?: string;
}

/**
 * @description Interface de contexto de notificacao
 * @returns Interface de contexto de notificacao
 */
interface NotificationContextProps {
  notification: NotificationState;
  notify: (payload: NotifyPayload) => Promise<void>;
  showNotification: (status: AlertStatus, message?: string) => Promise<void>;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

/**
 * @description Estado inicial de notificacao
 * @returns Estado inicial de notificacao
 */
const INITIAL_NOTIFICATION: NotificationState = {
  visible: false,
  status: "loading",
  message: undefined,
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const buildNotificationState = (status: AlertStatus, message?: string, visible = true): NotificationState => ({ visible, status, message, });

const shouldTransitionNotification = (
  current: NotificationState,
  next: NotifyPayload
) => current.visible && (current.status !== next.status || current.message !== next.message);

/**
 * @description Provider de notificacao
 * @param children Filhos do provider
 * @returns Provider de notificacao
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>(INITIAL_NOTIFICATION);
  const notifyRequestId = useRef(0);
  const notificationRef = useRef<NotificationState>(INITIAL_NOTIFICATION);

  const syncNotification = useCallback((nextNotification: NotificationState) => {
    notificationRef.current = nextNotification;
    setNotification(nextNotification);
  }, []);

  const notify = useCallback(async (payload: NotifyPayload) => {
    const currentNotification = notificationRef.current;
    const currentRequestId = ++notifyRequestId.current;
    const shouldTransition = shouldTransitionNotification(currentNotification, payload);

    if (shouldTransition) {
      syncNotification({ ...currentNotification, visible: false });
      await wait(150);

      if (currentRequestId !== notifyRequestId.current) return;
    }

    syncNotification(buildNotificationState(payload.status, payload.message));
  }, [syncNotification]);

  const showNotification = useCallback(
    async (status: AlertStatus, message?: string) => {
      await notify({ status, message });
    },
    [notify]
  );

  const hideNotification = useCallback(() => {
    const currentNotification = notificationRef.current;
    syncNotification({ ...currentNotification, visible: false });
  }, [syncNotification]);

  return (
    <NotificationContext.Provider value={{ notification, notify, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * @description Hook para usar o contexto de notificacao
 * @returns Hook para usar o contexto de notificacao
 */
export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
};