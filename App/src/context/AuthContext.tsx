import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { clearAuthToken, setAuthToken, getStoredAuthToken, getBiometricsEnabled, setBiometricsEnabled, clearAuthTokenCacheOnly } from "@/src/services/http";
import { decodeAuthToken } from "@/src/utils/authToken";
import type { SavedAccount } from "@/src/utils/savedAccounts";
import { getSavedAccounts, getLastUsedAccountEmail, addOrUpdateSavedAccount as persistAddSavedAccount, removeSavedAccount as persistRemoveSavedAccount, setLastUsedAccountEmail } from "@/src/utils/savedAccounts";

interface AuthContextType {
    id: number | null;
    token: string | null;
    accessLevel: string | null;
    isAuthenticated: boolean | null;
    isAuthReady: boolean;
    savedAccounts: SavedAccount[];
    lastUsedAccount: SavedAccount | null;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    addSavedAccount: (email: string, displayLabel?: string, userImageUrl?: string) => Promise<void>;
    setLastUsedAccount: (email: string) => Promise<void>;
    removeSavedAccount: (email: string) => Promise<void>;
    refreshSavedAccounts: () => Promise<void>;
    biometricsEnabled: boolean;
    setBiometricsEnabledAsync: (enabled: boolean) => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
    token: null,
    id: null,
    accessLevel: null,
    isAuthenticated: false,
    isAuthReady: false,
    savedAccounts: [],
    lastUsedAccount: null,
    login: async () => { },
    logout: async () => { },
    addSavedAccount: async () => { },
    setLastUsedAccount: async () => { },
    removeSavedAccount: async () => { },
    refreshSavedAccounts: async () => { },
    biometricsEnabled: false,
    setBiometricsEnabledAsync: async () => { },
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

/**
 * AuthContext provider hook and context.
 * @param param0 React children nodes.
 * @returns AuthProvider component.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [id, setId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [accessLevel, setAccessLevel] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [savedAccounts, setSavedAccountsState] = useState<SavedAccount[]>([]);
    const [lastUsedAccount, setLastUsedAccountState] = useState<SavedAccount | null>(null);
    const [biometricsEnabled, setBiometricsEnabledState] = useState(false);

    const refreshSavedAccounts = async () => {
        const accounts = await getSavedAccounts();
        const lastEmail = await getLastUsedAccountEmail();
        setSavedAccountsState(accounts);
        setLastUsedAccountState(
            accounts.find((a) => a.email.toLowerCase() === lastEmail?.toLowerCase()) ?? accounts[0] ?? null
        );
    };

    useEffect(() => {
        const loadStoredToken = async () => {
            try {
                const biometricsPref = await getBiometricsEnabled();
                setBiometricsEnabledState(biometricsPref);

                if (biometricsPref) {
                    setIsAuthenticated(false);
                    await refreshSavedAccounts();
                    setIsAuthReady(true);
                    return;
                }

                const storedToken = await getStoredAuthToken({ useBiometrics: biometricsPref });
                if (!storedToken) {
                    setIsAuthenticated(false);
                    await refreshSavedAccounts();
                    return;
                }

                const decoded = decodeAuthToken(storedToken);
                if (!decoded?.id || !(decoded.role || decoded.accessLevel)) {
                    await SecureStore.deleteItemAsync("authToken");
                    await clearAuthToken();
                    setIsAuthenticated(false);
                    await refreshSavedAccounts();
                    return;
                }

                setToken(storedToken);
                setId(Number(decoded.id));
                setAccessLevel(decoded.role ?? decoded.accessLevel ?? null);
                setIsAuthenticated(true);
                await setAuthToken(storedToken);
                await refreshSavedAccounts();
            } catch {
                setIsAuthenticated(false);
                await refreshSavedAccounts();
            } finally {
                setIsAuthReady(true);
            }
        };
        loadStoredToken();
    }, []);

    const login = async (token: string) => {
        const decoded = decodeAuthToken(token);
        if (decoded?.id && (decoded.role || decoded.accessLevel)) {
            setToken(token);
            setId(Number(decoded.id));
            setAccessLevel(decoded.role ?? decoded.accessLevel ?? null);
            setIsAuthenticated(true);
            await setAuthToken(token);
        }
    };

    const logout = async () => {
        setToken(null);
        setId(null);
        setAccessLevel(null);
        setIsAuthenticated(false);
        if (biometricsEnabled) {
            clearAuthTokenCacheOnly();
        } else {
            await clearAuthToken();
        }
    };

    const addSavedAccount = async (email: string, displayLabel?: string, userImageUrl?: string) => {
        await persistAddSavedAccount({ email, displayLabel: displayLabel ?? "", userImageUrl });
        await refreshSavedAccounts();
    };

    const setLastUsedAccount = async (email: string) => {
        await setLastUsedAccountEmail(email.trim());
        await refreshSavedAccounts();
    };

    const removeSavedAccount = async (email: string) => {
        await persistRemoveSavedAccount(email);
        await refreshSavedAccounts();
    };

    const setBiometricsEnabledAsync = async (enabled: boolean) => {
        await setBiometricsEnabled(enabled);
        setBiometricsEnabledState(enabled);
        if (token) {
            await setAuthToken(token);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                id,
                accessLevel,
                isAuthenticated,
                isAuthReady,
                savedAccounts,
                lastUsedAccount,
                login,
                logout,
                addSavedAccount,
                setLastUsedAccount,
                removeSavedAccount,
                refreshSavedAccounts,
                biometricsEnabled,
                setBiometricsEnabledAsync,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth needs to be inside the AuthProvider");
    }
    return context;
};
