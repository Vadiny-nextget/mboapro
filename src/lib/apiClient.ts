import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { ApiError, type ApiErrorPayload } from '../types/api.types';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:9091/api/v1',
  // baseURL: import.meta.env.VITE_API_URL_HOST ?? 'http://192.168.100.27:9091/api/v1',
  timeout: 15000,
  withCredentials: true, // Envoie/recoit le cookie httpOnly sur chaque requete
});

// ---- Attache le JWT d'accès sur chaque requête sortante ----------
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Gestion du refresh automatique sur 401 ------------------------
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    const isUnauthorized = error.response?.status === 401;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/refresh');

    if (isUnauthorized && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      // const refreshToken = useAuthStore.getState().refreshToken;

      // if (!refreshToken) {
      //   useAuthStore.getState().logout();
      //   return Promise.reject(toApiError(error));
      // }

      if (isRefreshing) {
        // Une requête de refresh est déjà en cours : on met celle-ci en file d'attente
        return new Promise((resolve, reject) => {
          pendingQueue.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            apiClient(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {}, {withCredentials:true});
        const newAccessToken: string = data.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken);
        pendingQueue.forEach((resolveQueued) => resolveQueued(newAccessToken));
        pendingQueue = [];

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        pendingQueue = [];
        useAuthStore.getState().logout();
        window.location.href = '/connexion';
        return Promise.reject(toApiError(refreshError as AxiosError<ApiErrorPayload>));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(toApiError(error));
  }
);

/** Convertit une erreur axios/réseau en ApiError normalisée, exploitable par les composants. */
export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const payload = error.response.data as ApiErrorPayload;
      const fieldErrors =
        payload?.errors && typeof payload.errors === 'object' && !('secondsRemaining' in payload.errors)
          ? (payload.errors as Record<string, string>)
          : null;
      const meta = payload?.errors && 'secondsRemaining' in (payload.errors as object)
        ? (payload.errors as Record<string, unknown>)
        : null;
      return new ApiError(payload?.message ?? 'Une erreur est survenue.', error.response.status, fieldErrors, meta);
    }
    return new ApiError('Impossible de contacter le serveur. Vérifiez votre connexion.', error.status||500);
  }
  return new ApiError(error?.message??'Une erreur inattendue est survenue.', error.status||500);
}