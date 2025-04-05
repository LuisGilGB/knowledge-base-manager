/**
 * Types for the API service layer
 */

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface AuthHeaders {
  Authorization: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_cursor: number | null;
  next_cursor: number | null;
}

export interface InodePath {
  path: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
