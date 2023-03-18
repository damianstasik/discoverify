import { MutationFunction } from '@tanstack/react-query';
import { trpc } from '../trpc';

export const refreshAccessToken: Mutation<'auth.refresh'> = async () => {
  const token = await trpc.auth.refresh.mutate();

  return token;
};

export const getCurrentUser: Query<'auth.me'> = async ({ signal }) => {
  const user = await trpc.auth.me.query(undefined, {
    signal,
  });

  return user;
};

export const ignoreTrack: MutationFunction<void, string> = async (id) => {
  // await fetch(`${import.meta.env.VITE_API_URL}/track/${id}/ignore`, {
  //   method: isIgnored ? 'delete' : 'put',
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // });
};

export const saveTrack: Mutation<'track.save', string> = async (id) => {
  await trpc.track.save.mutate(id);
};

export const getRecommendedTracks: Query<
  'track.recommended',
  [key: string, trackIds: string[], values: any]
> = async ({ queryKey, signal }) => {
  const tracks = await trpc.track.recommended.query(
    {
      trackIds: queryKey[1],
      attributes: queryKey[2],
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

export const playTrack: Mutation<
  'track.play',
  { trackIds: string[]; offset: string; deviceId: string }
> = async ({ trackIds, offset, deviceId }) => {
  await trpc.track.play.mutate({
    trackIds,
    offset,
    deviceId,
  });
};

export const getPlaylist: Query<'playlist.byId', [key: string, id: string]> =
  async ({ queryKey, signal }) => {
    const playlist = await trpc.playlist.byId.query(queryKey[1], {
      signal,
    });

    return playlist;
  };

export const getPlaylistTracks: Query<
  'playlist.tracks',
  [key: string, id: string]
> = async ({ queryKey, signal }) => {
  const tracks = await trpc.playlist.tracks.query(queryKey[1], {
    signal,
  });

  return tracks;
};

export const authUrlMutation: Mutation<'auth.url', void> = async () => {
  const url = await trpc.auth.url.mutate();

  return url;
};
