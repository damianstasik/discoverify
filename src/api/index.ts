import { MutationFunction, QueryFunction } from '@tanstack/react-query';
import { RouterOutput, trpc } from '../trpc';
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

export const getCurrentUser: QueryFunction<RouterOutput['auth']['me']> =
  async ({ signal }) => {
    const user = await trpc.auth.me.query(undefined, {
      signal,
    });

    return user;
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

export const getRecommendedTracks: QueryFunction<
  RouterOutput['track']['recommended'],
  [key: string, trackIds: string[], values: any]
> = async ({ queryKey, signal }) => {
  const tracks = await trpc.track.recommended.query(
    {
      trackIds: queryKey[2],
    },
    { signal },
  );

  return tracks;
};

export const getTracks: QueryFunction<
  Array<{ id: string; title: string }>,
  [key: string, token: string, trackIds: string[]]
> = async ({ queryKey, signal }) => {
  const q = new URLSearchParams({
    id: queryKey[2].join(),
  });

  const req = await fetch(`${import.meta.env.VITE_API_URL}/track/tracks?${q}`, {
    signal,
    headers: {
      Authorization: `Bearer ${queryKey[1]}`,
    },
  });

  const body = await req.json();

  return body.tracks;
};

export const search: QueryFunction<
  Array<{ id: string; title: string }>,
  [key: string, token: string, query: string]
> = async ({ queryKey, signal }) => {
  const q = new URLSearchParams({
    q: queryKey[2],
  });

  const req = await fetch(`${import.meta.env.VITE_API_URL}/seed/search?${q}`, {
    signal,
    headers: {
      Authorization: `Bearer ${queryKey[1]}`,
    },
  });

  const body = await req.json();

  return body;
};

export const playTrack: MutationFunction<
  void,
  { token: string; ids: string[]; offset: string; deviceId: string }
> = async ({ token, ids, offset, deviceId }) => {
  const qs = new URLSearchParams();
  qs.append('deviceId', deviceId);
  qs.append('offset', offset);
  for (let id of ids) {
    qs.append('id', id);
  }
  await fetch(`${import.meta.env.VITE_API_URL}/player/play?${qs}`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPlaylist: QueryFunction<
  Array<{ name: string; tracks: any[] }>,
  [key: string, token: string, id: string]
> = async ({ queryKey, signal }) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/playlist/${queryKey[2]}`,
    {
      signal,
      headers: {
        Authorization: `Bearer ${queryKey[1]}`,
      },
    },
  );
  const body = await res.json();

  return body;
};
