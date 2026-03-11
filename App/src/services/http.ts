import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { ENV_BASE_URL } from '@env';
import i18n from '@/src/i18n';

const baseURL = (`${ENV_BASE_URL}/api`)

const getCurrentLanguage = () => (i18n.resolvedLanguage || i18n.language || 'pt').split('-')[0];

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

const KEY_BIOMETRICS_ENABLED = 'biometricsEnabled';

let authTokenCache: string | null = null;

let tokenLoaded = false;

export const getBiometricsEnabled = async (): Promise<boolean> => {
	if (!isNative) return false;
	try {
		const value = await SecureStore.getItemAsync(KEY_BIOMETRICS_ENABLED);
		return value === 'true';
	} catch {
		return false;
	}
};

export const setBiometricsEnabled = async (enabled: boolean): Promise<void> => {
	if (!isNative) return;
	try {
		await SecureStore.setItemAsync(KEY_BIOMETRICS_ENABLED, enabled ? 'true' : 'false');
	} catch {
	}
};

export const setAuthToken = async (token: string | null) => {
	authTokenCache = token;
	if (token) {
		await SecureStore.setItemAsync('authToken', token);
	} else {
		await SecureStore.deleteItemAsync('authToken');
	}
};

export const clearAuthToken = () => setAuthToken(null);

export const clearAuthTokenCacheOnly = () => {
	authTokenCache = null;
	tokenLoaded = false;
};

export const getStoredAuthTokenSilent = async (): Promise<string | null> => {
	try {
		return await SecureStore.getItemAsync('authToken');
	} catch {
		return null;
	}
}

export const getStoredAuthToken = async ({ useBiometrics }: { useBiometrics: boolean }): Promise<string | null> => {
	try {
		if (isNative && useBiometrics) {
			const { success } = await LocalAuthentication.authenticateAsync({
				promptMessage: 'Use Face ID ou biometria para entrar no Total Fretes',
				fallbackLabel: 'Usar senha do dispositivo',
			});
			if (!success) return null;
		}
		return await getStoredAuthTokenSilent();
	} catch {
		return null;
	}
}

const http = axios.create({
	baseURL,
	timeout: 3000,
	headers: {
		Accept: 'application/json',
		'accept-language': getCurrentLanguage(),
	}
});

http.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		try {
			if (!tokenLoaded || authTokenCache === null) {
				const useBiometrics = await getBiometricsEnabled();
				if (!useBiometrics) {
					authTokenCache = await getStoredAuthToken({ useBiometrics });
				}
				tokenLoaded = true;
			}
			(config.headers as any)['accept-language'] = getCurrentLanguage();
			if (authTokenCache) {
				config.headers.Authorization = `Bearer ${authTokenCache}`;
			}
			(config.headers as any)['X-Request-Id'] = `${Date.now()}-${Math.random()
				.toString(16)
				.slice(2)}`;
		} catch {
		}
		return config;
	}
);


http.interceptors.response.use((response: AxiosResponse) => response, async (error: AxiosError) => {
		if (error.response?.status === 403) {
			const message = (error.response.data as { message?: string } | undefined)?.message;
			console.log('httpAxios 403:', {
				method: error.config?.method,
				url: error.config?.url,
				message,
			});
		}

		if (error.response?.status === 401) {
			await clearAuthToken();
		}
		return Promise.reject(error);
	}
);


export default http;
