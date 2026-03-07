import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ENV_BASE_URL } from '@env';

const defaultURL = Platform.select({
  ios: 'http://localhost:3005/api',
  android: 'http://10.0.2.2:3005/api',
  default: 'http://localhost:3005/api'
}) as string;

const envUrl = (ENV_BASE_URL ? `${ENV_BASE_URL}/api` : '').trim();
export const baseURL = envUrl || defaultURL;

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
  timeout: 10000,
  headers: {
    Accept: 'application/json'
  }
});

http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      if (!tokenLoaded || authTokenCache === null) {
        authTokenCache = (await SecureStore.getItemAsync('authToken')) || null;
        tokenLoaded = true;
      }
      if (authTokenCache) {
        config.headers.Authorization = `Bearer ${authTokenCache}`;
      } else {
        console.log('httpAxios: no auth token available');
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
