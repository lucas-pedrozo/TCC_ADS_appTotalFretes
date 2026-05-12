import { jwtDecode } from "jwt-decode";

export interface DecodedAuthToken {
	id: number;
	role?: string;
	accessLevel?: string;
	exp?: number;
}

export function decodeAuthToken(token: string): DecodedAuthToken | null {
	try {
		const decoded: DecodedAuthToken = jwtDecode(token);
		if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
			return null;
		}
		return decoded;
	} catch (error) {
		console.log("Erro ao decodificar token:", error);
		return null;
	}
}

export function getUserIdFromAuthToken(token: string): number {
	const decoded = decodeAuthToken(token);
	if (decoded?.id == null) return NaN;
	return Number(decoded.id);
}
