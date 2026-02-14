import React, { createContext, useCallback, useState, useContext } from "react";
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
  notify: (payload: NotifyPayload) => void;
  showNotification: (status: AlertStatus, message?: string) => void;
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

/**
 * @description Provider de notificacao
 * @param children Filhos do provider
 * @returns Provider de notificacao
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>(INITIAL_NOTIFICATION);

  const notify = useCallback((payload: NotifyPayload) => {
    setNotification({
      visible: true,
      status: payload.status,
      message: payload.message,
    });
  }, []);

  const showNotification = useCallback(
    (status: AlertStatus, message?: string) => {
      notify({ status, message });
    },
    [notify]
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, visible: false }));
  }, []);

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