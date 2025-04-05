/**
 * API client for making requests to the StackAI API
 */
import { SUPABASE_AUTH_URL, BACKEND_URL, ANON_KEY } from '@/config/api';
import { AuthCredentials, AuthHeaders, AuthResponse } from './types';

/**
 * Get authentication headers for API requests
 * @param credentials Authentication credentials
 * @returns Authentication headers
 */
export const getAuthHeaders = async (
  credentials: AuthCredentials
): Promise<AuthHeaders> => {
  try {
    const requestUrl = `${SUPABASE_AUTH_URL}/auth/v1/token?grant_type=password`;
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Apikey': ANON_KEY,
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        gotrue_meta_security: {},
      }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json() as AuthResponse;
    return {
      Authorization: `Bearer ${data.access_token}`,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

/**
 * API client class for making authenticated requests
 */
export class ApiClient {
  private headers: AuthHeaders;
  private orgId: string | null = null;

  constructor(headers: AuthHeaders) {
    this.headers = headers;
  }

  /**
   * Initialize the API client by fetching the organization ID
   */
  async initialize(): Promise<void> {
    try {
      const orgResponse = await this.get<{ org_id: string }>('/organizations/me/current');
      this.orgId = orgResponse.org_id;
    } catch (error) {
      console.error('Failed to initialize API client:', error);
      throw error;
    }
  }

  /**
   * Get the organization ID
   */
  getOrgId(): string {
    if (!this.orgId) {
      throw new Error('API client not initialized. Call initialize() first.');
    }
    return this.orgId;
  }

  /**
   * Make a GET request to the API
   * @param endpoint API endpoint
   * @param queryParams Optional query parameters
   * @returns Response data
   */
  async get<T>(endpoint: string, queryParams?: Record<string, string>): Promise<T> {
    const url = new URL(`${BACKEND_URL}${endpoint}`);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Make a POST request to the API
   * @param endpoint API endpoint
   * @param data Request body data
   * @returns Response data
   */
  async post<T, TPayload extends Record<string, unknown> = Record<string, unknown>>(endpoint: string, data: TPayload): Promise<T> {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Make a DELETE request to the API
   * @param endpoint API endpoint
   * @param queryParams Optional query parameters
   * @returns Response data
   */
  async delete<T>(endpoint: string, queryParams?: Record<string, string>): Promise<T> {
    const url = new URL(`${BACKEND_URL}${endpoint}`);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }
}
