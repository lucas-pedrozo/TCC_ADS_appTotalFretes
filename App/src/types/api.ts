/**
 * Tipos de resposta e payload das APIs (POST/GET).
 * Use como genérico em http.post<Resposta>(url, payload) para tipar response.data.
 */

/** Resposta padrão com mensagem (signup, forgot-password, validate-code, etc.) */
export interface ApiMessageResponse {
  message?: string;
}

/** Resposta do login (auth-service devolve token + user) */
export interface LoginResponse {
  token: string;
  message?: string;
  user?: { id: number; role?: string };
}

/** Resposta do validate-code (inclui resetToken para fluxo de nova senha) */
export interface ValidateCodeResponse extends ApiMessageResponse {
  resetToken?: string;
}

/** Payload do POST /auth/login */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Payload do POST /auth/forgot-password */
export interface ForgotPasswordPayload {
  email: string;
}

/** Payload do POST /auth/validate-code */
export interface ValidateCodePayload {
  email: string;
  code: string;
}

/** Payload do POST /auth/reset-password */
export interface ResetPasswordPayload {
  resetToken: string;
  password: string;
}

/** Payload do POST /auth/resend-code */
export interface ResendCodePayload {
  email: string;
}

/** Payload do POST /user/end-account (cadastro) */
export interface SignUpPayload {
  name?: string;
  email?: string;
  sex?: string;
  cpf?: string;
  cnhNumber?: string;
  useGlasses?: boolean;
  cnhType_id?: number;
  isDeficient?: boolean;
  issuingAgencyCnh?: string;
  birthDate?: string;
  phoneNumber?: string;
  password?: string;
  account_type_id: number;
}
