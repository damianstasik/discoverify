import { MutationFunction, QueryFunction } from '@tanstack/react-query';
import { User } from '../types.d';

export function createUrl(
  path: string,
  params: Record<string, string>,
): string {
  const query = new URLSearchParams(params);
  return `${import.meta.env.VITE_API_URL}/${path}?${query}`;
}

export const refreshAccessToken: MutationFunction<string, string> = async (
  token,
) => {
  const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await req.json();

  if (body?.token) {
    return body.token;
  }

  throw new Error();
};

export const getCurrentUser: QueryFunction<User, [key: string, token: string]> =
  async ({ queryKey, signal }) => {
    const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      signal,
      headers: {
        Authorization: `Bearer ${queryKey[1]}`,
      },
    });

    if (!req.ok) {
      throw new Error();
    }

    return req.json();
  };

export const ignoreTrack: MutationFunction<
  void,
  { token: string; id: string; isIgnored: boolean }
> = async ({ token, id, isIgnored }) => {
  await fetch(`${import.meta.env.VITE_API_URL}/track/${id}/ignore`, {
    method: isIgnored ? 'delete' : 'put',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const saveTrack: MutationFunction<void, { token: string; id: string }> =
  async ({ token, id }) => {
    await fetch(`${import.meta.env.VITE_API_URL}/track/${id}/save`, {
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
