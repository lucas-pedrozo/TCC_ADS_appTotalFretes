import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const defaultURL = Platform.select({
  ios: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000'
}) as string;


const envUrl = ('').trim();
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
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  }
);


export default http;