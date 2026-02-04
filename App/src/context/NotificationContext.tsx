import React, { createContext, useCallback, useContext, useState } from "react";
import { AlertStatus } from "@/src/types/statusNotify";

export interface NotificationState {
  visible: boolean;
  status: AlertStatus;
  message?: string;
}

export interface NotifyPayload {
  status: AlertStatus;
  message?: string;
}

interface NotificationContextProps {
  notification: NotificationState;
  notify: (payload: NotifyPayload) => void;
  showNotification: (status: AlertStatus, message?: string) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

const INITIAL_NOTIFICATION: NotificationState = {
  visible: false,
  status: "loading",
  message: undefined,
};

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

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
};