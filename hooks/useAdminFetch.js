'use client';

import { useCallback } from 'react';
import { useAuth } from 'services/auth';

// fetch() for the manager-only /api/admin/* routes: adds the session's access token.
// Resolves to { ok, status, data } and never throws on HTTP errors.
export default function useAdminFetch() {
  const { session } = useAuth();
  const accessToken = session?.access_token;

  return useCallback(
    async (url, { body, headers, ...options } = {}) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...headers,
          Authorization: `Bearer ${accessToken}`,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const data = await response.json().catch(() => ({}));
      return { ok: response.ok, status: response.status, data };
    },
    [accessToken]
  );
}
