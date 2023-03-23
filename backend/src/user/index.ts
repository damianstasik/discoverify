import { ee, router } from '..';
import { getSpotifyApi } from '../spotify';
import { procedureWithAuthToken } from '../auth/middleware';
import { z } from 'zod';
import { observable } from '@trpc/server/observable';

type TrackSaveChange = {
  type: 'save' | 'unsave';
  id: string;
};

export const userRouter = router({
  onTrackSave: procedureWithAuthToken.subscription(async (req) => {
    return observable<TrackSaveChange>((emit) => {
      const onSave = (id: string) => {
        emit.next({ type: 'save', id });
      };

      const onUnsave = (id: string) => {
        emit.next({ type: 'unsave', id });
      };

      const { userId } = req.ctx.token;

      ee.on(`save:${userId}`, onSave);
      ee.on(`unsave:${userId}`, onUnsave);

      return () => {
        ee.off(`save:${userId}`, onSave);
        ee.off(`unsave:${userId}`, onUnsave);
      };
    });
  }),
  playlists: procedureWithAuthToken
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          perPage: z.number().min(1).max(50).default(50),
        })
        .optional()
        .default({
          page: 1,
          perPage: 50,
        }),
    )
    .query(async (req) => {
      const playlists = await getSpotifyApi(
        req.ctx.token.accessToken,
      ).getUserPlaylists({
        limit: req.input.perPage,
        offset: req.input.page === 1 ? 0 : req.input.page * 50,
      });

      return {
        playlists: playlists.body.items,
        nextPage: !!playlists.body.next,
      };
    }),
  stats: procedureWithAuthToken.query(async (req) => {
    const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);

    const [
      recentlyPlayedTrack,
      topArtists,
      topTracks,
      likedTracksSpotify,
      followedArtistsSpotify,
    ] = await Promise.allSettled([
      spotifyApi.getMyRecentlyPlayedTracks({
        limit: 1,
      }),
      spotifyApi.getMyTopArtists({
        time_range: 'long_term',
        limit: 5,
      }),
      spotifyApi.getMyTopTracks({
        time_range: 'long_term',
        limit: 5,
      }),
      spotifyApi.getMySavedTracks({
        limit: 1,
      }),
      spotifyApi.getFollowedArtists({
        limit: 1,
      }),
    ]);

    return {
      recentlyPlayedTrack:
        recentlyPlayedTrack.status === 'fulfilled'
          ? recentlyPlayedTrack.value.body.items[0]
          : null,
      topArtists:
        topArtists.status === 'fulfilled' ? topArtists.value.body.items : [],
      topTracks:
        topTracks.status === 'fulfilled' ? topTracks.value.body.items : [],
      likedTracksSpotify:
        likedTracksSpotify.status === 'fulfilled'
          ? likedTracksSpotify.value.body.total
          : 0,
      followedArtistsSpotify:
        followedArtistsSpotify.status === 'fulfilled'
          ? followedArtistsSpotify.value.body.artists.total
          : 0,
    };
  }),
});
