import { useAuth } from '@clerk/clerk-expo';
import { useCallback } from 'react';
import { apiRequest } from './api';

/**
 * Hook that provides an authenticated API caller.
 * Automatically attaches the Clerk session token as Bearer header.
 *
 * Usage:
 *   const api = useApi();
 *   const data = await api('/users/me/');
 *   await api('/users/me/', { method: 'PATCH', body: { full_name: 'Rohit' } });
 */
export function useApi() {
  const { getToken } = useAuth();

  const authenticatedRequest = useCallback(
    async <T = any>(
      path: string,
      options: {
        method?: string;
        body?: any;
        headers?: Record<string, string>;
      } = {},
    ): Promise<T> => {
      const token = await getToken();
      return apiRequest<T>(path, { ...options, token });
    },
    [getToken],
  );

  return authenticatedRequest;
}
