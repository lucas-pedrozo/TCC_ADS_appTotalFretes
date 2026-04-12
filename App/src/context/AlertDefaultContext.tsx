import React, { createContext, useCallback, useState, useContext, useRef } from "react";
import { AlertStatus } from "@/src/types/statusNotify";

export interface AlertState {
    visible: boolean;
    status: AlertStatus;
    message?: string;
}

export interface AlertPayload {
    status: AlertStatus;
    message?: string;
}

interface AlertDefaultContextProps {
    alert: AlertState;
    notify: (payload: AlertPayload) => Promise<void>;
    showAlert: (status: AlertStatus, message?: string) => Promise<void>;
    hideAlert: () => void;
}

const AlertDefaultContext = createContext<AlertDefaultContextProps | undefined>(undefined);

const INITIAL_ALERT: AlertState = {
    visible: false,
    status: "loading",
    message: undefined,
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const buildAlertState = (status: AlertStatus, message?: string, visible = true): AlertState => ({
    visible, status, message,
});

const shouldTransitionAlert = (current: AlertState, next: AlertPayload) =>
    current.visible && (current.status !== next.status || current.message !== next.message);

export const AlertDefaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alert, setAlert] = useState<AlertState>(INITIAL_ALERT);
    const notifyRequestId = useRef(0);
    const alertRef = useRef<AlertState>(INITIAL_ALERT);
    const pendingNotifyResolveRef = useRef<(() => void) | null>(null);

    const syncAlert = useCallback((nextAlert: AlertState) => {
        alertRef.current = nextAlert;
        setAlert(nextAlert);
    }, []);

    const notify = useCallback((payload: AlertPayload): Promise<void> => {
        const currentAlert = alertRef.current;
        const currentRequestId = ++notifyRequestId.current;
        const shouldTransition = shouldTransitionAlert(currentAlert, payload);
        const resolveWhenDismissed = payload.status !== "loading";

        const promise = new Promise<void>((resolve) => {
            const doResolve = () => {
                if (currentRequestId !== notifyRequestId.current) return;
                resolve();
            };

            if (resolveWhenDismissed) {
                pendingNotifyResolveRef.current?.();
                pendingNotifyResolveRef.current = doResolve;
            }

            const applyState = () => {
                if (currentRequestId !== notifyRequestId.current) return;
                syncAlert(buildAlertState(payload.status, payload.message));
                if (!resolveWhenDismissed) doResolve();
            };

            if (shouldTransition) {
                syncAlert({ ...currentAlert, visible: false });
                wait(150).then(() => {
                    if (currentRequestId !== notifyRequestId.current) return;
                    applyState();
                });
            } else {
                applyState();
            }
        });

        return promise;
    }, [syncAlert]);

    const showAlert = useCallback(
        async (status: AlertStatus, message?: string) => {
            await notify({ status, message });
        },
        [notify]
    );

    const hideAlert = useCallback(() => {
        pendingNotifyResolveRef.current?.();
        pendingNotifyResolveRef.current = null;
        syncAlert({ ...alertRef.current, visible: false });
    }, [syncAlert]);

    return (
        <AlertDefaultContext.Provider value={{ alert, notify, showAlert, hideAlert }}>
            {children}
        </AlertDefaultContext.Provider>
    );
};

export const useAlertDefault = () => {
    const ctx = useContext(AlertDefaultContext);
    if (!ctx) throw new Error("useAlertDefault must be used within AlertDefaultProvider");
    return ctx;
};