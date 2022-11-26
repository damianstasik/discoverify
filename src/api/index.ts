import { MutationFunction } from '@tanstack/react-query';
import { trpc } from '../trpc';

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

export const getCurrentUser: Query<'auth.me'> = async ({ signal }) => {
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

export const getRecommendedTracks: Query<
  'track.recommended',
  [key: string, trackIds: string[], values: any]
> = async ({ queryKey, signal }) => {
  const tracks = await trpc.track.recommended.query(
    {
      trackIds: queryKey[1],
    },
    { signal },
  );

  return tracks;
};

export const getTracks: Query<
  'track.tracksById',
  [key: string, trackIds: string[]]
> = async ({ queryKey, signal }) => {
  const tracks = await trpc.track.tracksById.query(queryKey[1], { signal });

  return tracks;
};

export const search: Query<'seed.search', [key: string, query: string]> =
  async ({ queryKey, signal }) => {
    const results = await trpc.seed.search.query(queryKey[1], { signal });

    return results;
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

export const getPlaylist: Query<'playlist.byId', [key: string, id: string]> =
  async ({ queryKey, signal }) => {
    const playlist = await trpc.playlist.byId.query(queryKey[1], {
      signal,
    });

    return playlist;
  };
