export class ApiError extends Error {
  public statusCode: number;
  public details?: any;
  public validationErrors?: Record<string, string[]>;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    this.validationErrors = details?.errors;
  }
}

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

// A global lock and queue for request buffering while refreshing token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5207/api/v1';

export const apiClient = async <T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { requireAuth = true, headers, ...customOptions } = options;

  let accessToken = requireAuth ? getAccessToken() : null;

  const buildRequest = (token: string | null) => {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${BASE_URL}${endpoint}`, {
      ...customOptions,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
    });
  };

  try {
    let response = await buildRequest(accessToken);

    if (response.status === 401 && requireAuth) {
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const refreshToken = getRefreshToken();
          if (!refreshToken) throw new Error('No refresh token available');

          // Attempt to refresh the token directly against the API
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (!refreshRes.ok) {
            throw new Error('Refresh failed');
          }

          const retryData = await refreshRes.json();
          setTokens(retryData.accessToken, retryData.refreshToken);
          
          processQueue(null, retryData.accessToken);
          accessToken = retryData.accessToken;
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          clearTokens();
          // Optionally redirect to login here
          throw refreshErr;
        } finally {
          isRefreshing = false;
        }

        // Retry original request
        response = await buildRequest(accessToken);
      } else {
        // Wait for the refreshing instance to complete
        accessToken = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        
        if (accessToken) {
          response = await buildRequest(accessToken);
        } else {
          throw new ApiError('Unauthorized', 401);
        }
      }
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        errorData.detail || errorData.title || errorData.message || 'API request failed',
        response.status,
        errorData
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
};
