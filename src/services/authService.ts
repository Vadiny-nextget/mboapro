import { apiClient, toApiError } from '../lib/apiClient';
import type { ApiSuccessResponse } from '../types/api.types';
import type { AuthSession } from '../types/auth.types';

export type OtpPurpose = 'register_client' | 'register_prestataire' | 'login_2fa' | 'password_reset' | '2fa_setup';

interface LoginResult {
  requires2fa?: boolean;
  identifier?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthSession['user'];
}


async function unwrap<T>(promise: Promise<{ data: ApiSuccessResponse<T> }>): Promise<T> {
  try {
    const { data } = await promise;
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export const authService = {
  sendOtp: (identifier: string, purpose: OtpPurpose) =>
    unwrap<{ identifier: string; type: 'email' | 'phone' }>(
      apiClient.post('/auth/otp/send', { identifier, purpose })
    ),

  verifyOtp: (identifier: string, code: string, purpose: OtpPurpose) =>
    unwrap<{ verificationToken: string }>(
      apiClient.post('/auth/otp/verify', { identifier, code, purpose })
    ),

  registerClient: (payload: {
    verificationToken: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    preferredLanguage: string;
  }) => unwrap<AuthSession>(apiClient.post('/auth/register/client', payload)),

  registerProvider: (formData: FormData) =>
    unwrap<AuthSession>(
      apiClient.post('/auth/register/prestataire', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ),

  login: (identifier: string, password: string) =>
    unwrap<LoginResult>(apiClient.post('/auth/login', { identifier, password })),

  verifyLogin2fa: (identifier: string, code: string) =>
    unwrap<AuthSession>(apiClient.post('/auth/login/2fa/verify', { identifier, code })),

  logout: (refreshToken: string) => unwrap<null>(apiClient.post('/auth/logout', { refreshToken })),

  forgotPassword: (identifier: string) =>
    unwrap<null>(apiClient.post('/auth/password/forgot', { identifier })),

  resetPassword: (payload: { verificationToken: string; newPassword: string; confirmPassword: string }) =>
    unwrap<null>(apiClient.post('/auth/password/reset', payload)),

  request2faEnable: () => unwrap<{ identifier: string }>(apiClient.post('/auth/2fa/enable/request')),

  confirm2faEnable: (code: string) => unwrap<null>(apiClient.post('/auth/2fa/enable/confirm', { code })),

  disable2fa: (password: string) => unwrap<null>(apiClient.post('/auth/2fa/disable', { password })),

  
  getOAuthRedirectUrl: (provider: 'google' | 'linkedin') =>
    `${import.meta.env.VITE_API_URL ?? 'http://localhost:9091/api/v1'}/auth/oauth/${provider}/redirect`,

  exchangeOAuthCode: (code: string) =>
    unwrap<AuthSession>(apiClient.post('/auth/oauth/exchange', { code })),

    upgradeToProvider: (payload: {
    description?: string;
    whatsapp?: string;
    portfolioUrl?: string;
    yearsExperience?: string;
    region: string;
    city: string;
    address: string;
  }) => unwrap<AuthSession>(apiClient.post('/auth/upgrade-to-provider', payload)),
};