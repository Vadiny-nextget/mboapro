export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorPayload {
  success: false;
  message: string;
  errors?: Record<string, string> | Record<string, unknown> | null;
}

/** Erreur normalisée levée par tous les appels de services (auth, providers, ...). */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors: Record<string, string> | null = null,
    public readonly meta: Record<string, unknown> | null = null
  ) {
    super(message);
    this.name = 'ApiError';
  }
}