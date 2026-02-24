import { createContext, useState, ReactNode, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

/**
 * @description Interface de token decodificado
 * @returns Interface de token decodificado
 */
interface DecodedToken {
	id_user: number;
	accessLevel: string;
}

/**
 * @description Interface de contexto de autenticacao
 * @returns Interface de contexto de autenticacao
 */
interface AuthContextType {
	token: string | null;
	id_user: number | null;
	accessLevel: string | null;
	isAuthenticated: boolean | null;

	login: (token: string) => void;
	logout: () => void;
}

/**
 * @description Contexto de autenticacao default
 * @returns Contexto de autenticacao default
 */
const defaultAuthContext: AuthContextType = {
	token: null,
	id_user: null,
	accessLevel: null,
	isAuthenticated: null,
	login: () => { },
	logout: () => { },
};

/**
 * @description Funcao para decodificar token
 * @param token Token a ser decodificado
 * @returns Token decodificado
 */
const decodeToken = (token: string) => {
	try {
		const decoded: DecodedToken = jwtDecode(token);
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
	const [token, setToken] = useState<string | null>(null);
	const [id_user, setId_user] = useState<number | null>(null);
	const [accessLevel, setAccessLevel] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	const login = async (token: string) => {
		const decoded = decodeToken(token);
		if (decoded) {
			setToken(token);
			setId_user(decoded.id_user);
			setAccessLevel(decoded.accessLevel);
			setIsAuthenticated(true);
			await SecureStore.setItemAsync("authToken", token);
		}
	};

	const logout = async () => {
		setToken(null);
		setId_user(null);
		setAccessLevel(null);
		setIsAuthenticated(false);
		await SecureStore.deleteItemAsync("authToken");
	};

	return (
		<AuthContext.Provider value={{ token, id_user, accessLevel, isAuthenticated, login, logout }}>
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