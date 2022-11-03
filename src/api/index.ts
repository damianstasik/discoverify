import { MutationFunction } from '@tanstack/react-query';

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
