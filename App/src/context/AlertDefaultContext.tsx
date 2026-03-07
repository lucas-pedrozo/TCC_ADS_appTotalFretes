import React, { createContext, useCallback, useState, useContext, useRef } from "react";
import { AlertStatus } from "@/src/types/statusNotify";

/**
 * @description Interface de estado de alert
 * @returns Interface de estado de alert
 */
export interface AlertState {
  visible: boolean;
  status: AlertStatus;
  message?: string;
}

/**
 * @description Interface de payload de alert
 * @returns Interface de payload de alert
 */
export interface AlertPayload {
  status: AlertStatus;
  message?: string;
}

/**
 * @description Interface de contexto de alert
 * @returns Interface de contexto de alert
 */
interface AlertDefaultContextProps {
  alert: AlertState;
  notify: (payload: AlertPayload) => Promise<void>;
  showAlert: (status: AlertStatus, message?: string) => Promise<void>;
  hideAlert: () => void;
}

const AlertDefaultContext = createContext<AlertDefaultContextProps | undefined>(undefined);

/**
 * @description Estado inicial de alert
 * @returns Estado inicial de alert
 */
const INITIAL_ALERT: AlertState = {
  visible: false,
  status: "loading",
  message: undefined,
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const buildAlertState = (status: AlertStatus, message?: string, visible = true): AlertState => ({ visible, status, message, });

const shouldTransitionAlert = (
  current: AlertState,
  next: AlertPayload
) => current.visible && (current.status !== next.status || current.message !== next.message);

/**
 * @description Provider de alert
 * @param children Filhos do provider
 * @returns Provider de alert
 */
export const AlertDefaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<AlertState>(INITIAL_ALERT);
  const notifyRequestId = useRef(0);
  const alertRef = useRef<AlertState>(INITIAL_ALERT);

  const syncAlert = useCallback((nextAlert: AlertState) => {
    alertRef.current = nextAlert;
    setAlert(nextAlert);
  }, []);

  const notify = useCallback(async (payload: AlertPayload) => {
    const currentAlert = alertRef.current;
    const currentRequestId = ++notifyRequestId.current;
    const shouldTransition = shouldTransitionAlert(currentAlert, payload);

    if (shouldTransition) {
      syncAlert({ ...currentAlert, visible: false });
      await wait(150);

      if (currentRequestId !== notifyRequestId.current) return;
    }

    syncAlert(buildAlertState(payload.status, payload.message));
  }, [syncAlert]);

  const showAlert = useCallback(
    async (status: AlertStatus, message?: string) => {
      await notify({ status, message });
    },
    [notify]
  );

  const hideAlert = useCallback(() => {
    const currentAlert = alertRef.current;
    syncAlert({ ...currentAlert, visible: false });
  }, [syncAlert]);

  return (
    <AlertDefaultContext.Provider value={{ alert, notify, showAlert, hideAlert }}>
      {children}
    </AlertDefaultContext.Provider>
  );
};

/**
 * @description Hook para usar o contexto de alert
 * @returns Hook para usar o contexto de alert
 */
export const useAlertDefault = () => {
  const ctx = useContext(AlertDefaultContext);
  if (!ctx) throw new Error("useAlertDefault must be used within AlertDefaultProvider");
  return ctx;
};