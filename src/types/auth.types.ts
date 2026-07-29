
export type UserRole = 'client' | 'prestataire' | 'admin';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isVerified: boolean; // badge "réputation vérifiée"
}

interface ErrorMessageItem {
  memberNames: string[];
  errorMessage: string;
}

export type ServerNotificationTypes = "Success" | "Error" | "Warning" | "Info";


export interface AuthenticateUserCommand {
  email: string;
  password: string;
  saveSession: boolean;
}
export interface AuthenticateUserByGoogleCommand {
  code: string;
}
export interface AuthenticateUserByLinkedinCommand {
  code: string;
}
export interface AuthenticateUserResult {
  payload: AuthenticateUserSuccessPayload;
  hasSucceeded: boolean;
  errorMessages: ErrorMessageItem[];
}
export interface AuthenticateUserSuccessPayload {
  id: string;
  email: string;
  role: string;
  token: string;
  message: string;
  is_verified?: boolean;
  is_verify_2fa?: boolean;
  is_connected?: boolean;
  message_email?: string;
}

export interface RegisterCommand {
  lastName: string;
  email: string;
  firstName: string;
  password: string;
  confirmPassword: string;
  is_verify_2fa: boolean;
  userlanguage: string;
  theme: string;
}
export interface RegisterResult {
  payload: RegisterSuccessPayload;
  hasSucceeded: boolean;
  errorMessages: ErrorMessageItem[];
}
export interface RegisterSuccessPayload {
  pinCode: string;
  message: string;
}

export interface VerifyIdentityCommand {
  id: string;
  token: string;
  otp: string;
}
export interface VerifyIdentityResult {
  payload: VerifyIdentitySuccessPayload;
  hasSucceeded: boolean;
  errorMessages: ErrorMessageItem[];
}
export interface VerifyIdentitySuccessPayload {
  id: string;
  email: string;
  role: string;
  token: string;
  message: string;
  is_verified: boolean;
  is_connected: boolean;
}

export interface ResendPinCodeCommand {
  id: string;
  email: string;
  token: string;
  type?: 0 | 1;
}
export interface ResendPinCodeResult {
  payload: ResendPinCodeSuccessPayload;
  hasSucceeded: boolean;
  errorMessages: ErrorMessageItem[];
}
export interface ResendPinCodeSuccessPayload {
  id: string;
  email: string;
  token: string;
  message: string;
  message_email?: string;
}


export interface VerifyRegistrationCommand {
  otp: string;
  token: string;
}
export interface ForgotPasswordCommand {
  email: string;
}
export interface ResetPasswordCommand {
  otp: string;
  token: string;
  password: string;
  confirmPassword: string;
}
