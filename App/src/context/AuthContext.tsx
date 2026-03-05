import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { clearAuthToken, setAuthToken } from "@/src/service/http";

/**
 * @description Interface de token decodificado
 * @returns Interface de token decodificado
 */
interface DecodedToken {
	id: number | string;
	role?: string;
	accessLevel?: string;
	exp?: number;
}

/**
 * @description Interface de contexto de autenticacao 
 * @returns Interface de contexto de autenticacao
 */
interface AuthContextType {
	id: number | null;
	token: string | null;
	accessLevel: string | null;
	isAuthenticated: boolean | null;

	login: (token: string) => Promise<void>;
	logout: () => Promise<void>;
}

/**
 * @description Contexto de autenticacao default
 * @returns Contexto de autenticacao default
 */
const defaultAuthContext: AuthContextType = {
	token: null,
	id: null,
	accessLevel: null,
	isAuthenticated: false,
	login: async () => { },
	logout: async () => { },
};

/**
 * @description Funcao para decodificar token e verificar se ele é valido (nao expirado)
 * @param token Token a ser decodificado
 * @returns Token decodificado
 */
const decodeToken = (token: string) => {
	try {
		const decoded: DecodedToken = jwtDecode(token);
		if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
			return null;
		}
		
		return decoded;
	} catch (error) {
		console.log("Erro ao decodificar token:", error);
		return null;
	}
}

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

/**
 * @description Provider de autenticacao
 * @param children Filhos do provider
 * @returns Provider de autenticacao
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [id, setId] = useState<number | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [accessLevel, setAccessLevel] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	useEffect(() => {
		const loadStoredToken = async () => {
			const storedToken = await SecureStore.getItemAsync("authToken");
			if (!storedToken) {
				setIsAuthenticated(false);
				return;
			}

			const decoded = decodeToken(storedToken);
			if (!decoded?.id || !(decoded.role || decoded.accessLevel)) {
				await SecureStore.deleteItemAsync("authToken");
				await clearAuthToken();
				setIsAuthenticated(false);
				return;
			}

			setToken(storedToken);
			setId(Number(decoded.id));
			setAccessLevel(decoded.role ?? decoded.accessLevel ?? null);
			setIsAuthenticated(true);

			await setAuthToken(storedToken);
		};

		loadStoredToken();
	}, []);

	const login = async (token: string) => {
		const decoded = decodeToken(token);
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
		
		await clearAuthToken();
	};

	return (
		<AuthContext.Provider value={{ token, id, accessLevel, isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
} 

/**
 * @description Hook para usar o contexto de autenticacao
 * @returns Hook para usar o contexto de autenticacao
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth needs to be inside the AuthProvider");
    }
    return context;
};