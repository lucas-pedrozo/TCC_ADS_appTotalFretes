import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { ENV_BASE_URL } from '@env';
import i18n from '@/src/i18n';

const defaultURL = Platform.select({
  ios: 'http://localhost:3005/api',
  android: 'http://10.0.2.2:3005/api',
  default: 'http://localhost:3005/api'
}) as string;

const envUrl = (`${ENV_BASE_URL}/api`)
export const baseURL = envUrl || defaultURL;

const getCurrentLanguage = () => (i18n.resolvedLanguage || i18n.language || 'pt').split('-')[0];

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

const KEY_BIOMETRICS_ENABLED = 'biometricsEnabled';

let authTokenCache: string | null = null;
let tokenLoaded = false;

/** Lê se o usuário habilitou acesso por biometria (padrão: false) */
export const getBiometricsEnabled = async (): Promise<boolean> => {
  if (!isNative) return false;
  try {
    const value = await SecureStore.getItemAsync(KEY_BIOMETRICS_ENABLED);
    return value === 'true';
  } catch {
    return false;
  }
};

/** Salva a preferência de uso de biometria (sem exigir biometria para ler essa chave) */
export const setBiometricsEnabled = async (enabled: boolean): Promise<void> => {
  if (!isNative) return;
  await SecureStore.setItemAsync(KEY_BIOMETRICS_ENABLED, enabled ? 'true' : 'false');
};

/** Salva o token sem exigir biometria na hora (evita prompt após digitar senha). A biometria é pedida só na leitura ao abrir o app. */
export const setAuthToken = async (token: string | null) => {
  authTokenCache = token;
  if (token) {
    await SecureStore.setItemAsync('authToken', token);
  } else {
    await SecureStore.deleteItemAsync('authToken');
  }
};

export const clearAuthToken = () => setAuthToken(null);

/** Limpa só o cache em memória (não apaga o token do SecureStore). Usado no logout quando biometria está ativa, para poder entrar de novo pelo card. */
export const clearAuthTokenCacheOnly = () => {
  authTokenCache = null;
  tokenLoaded = false;
};

/** Lê o token do SecureStore sem pedir biometria. Usado para verificar se existe token antes de mostrar o prompt. */
export const getStoredAuthTokenSilent = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('authToken');
  } catch {
    return null;
  }
};

/**
 * Lê o token armazenado. Se biometria estiver ativa, pede Face ID/Touch ID ANTES de ler
 * (assim o usuário vê a biometria ao abrir o app, não depois de digitar a senha).
 */
export const getStoredAuthToken = async (): Promise<string | null> => {
  try {
    const useBiometrics = await getBiometricsEnabled();
    if (isNative && useBiometrics) {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Use biometria para entrar no Total Fretes',
        fallbackLabel: 'Usar senha do dispositivo',
      });
      if (!success) return null;
    }
    return await SecureStore.getItemAsync('authToken');
  } catch {
    return null;
  }
};

const http = axios.create({
  baseURL,
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
          authTokenCache = await getStoredAuthToken();
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

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
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
