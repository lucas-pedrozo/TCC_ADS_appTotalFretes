import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
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

let authTokenCache: string | null = null;
let tokenLoaded = false;

export const setAuthToken = async (token: string | null) => {
  authTokenCache = token;
  if (token) {
    await SecureStore.setItemAsync('authToken', token);
  } else {
    await SecureStore.deleteItemAsync('authToken');
  }
};
  
export const clearAuthToken = () => setAuthToken(null);

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
        authTokenCache = (await SecureStore.getItemAsync('authToken')) || null;
        tokenLoaded = true;
      }
      (config.headers as any)['accept-language'] = getCurrentLanguage();
      if (authTokenCache) {
        config.headers.Authorization = `Bearer ${authTokenCache}`;
      } else {
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
