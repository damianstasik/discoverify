import { router } from '..';
import { getSpotifyApi } from '../spotify';
import { procedureWithAuthToken } from '../auth/middleware';
import { z } from 'zod';
import { chunk } from 'lodash';
import { mixpanel } from '../mixpanel';

export const playlistRouter = router({
  tracks: procedureWithAuthToken
    .input(
      z.object({
        id: z.string(),
        page: z.number(),
      }),
    )
    .query(async (req) => {
      const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);
      const tracks = await spotifyApi.getPlaylistTracks(req.input.id, {
        limit: 50,
        offset: req.input.page === 1 ? 0 : req.input.page * 50,
      });

      mixpanel.track('get_playlist_tracks', {
        distinct_id: req.ctx.token.userId,
        playlist_id: req.input.id,
        page: req.input.page,
      });

      return {
        tracks: tracks.body.items.map((item) => ({
          ...item.track,
          added_at: item.added_at,
          isLiked: true,
          spotifyId: item.track?.id,
        })),
        nextPage: tracks.body.next ? req.input.page + 1 : null,
        total: tracks.body.total,
      };
    }),
  byId: procedureWithAuthToken.input(z.string()).query(async (req) => {
    const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);
    const playlist = await spotifyApi.getPlaylist(req.input);

    mixpanel.track('get_playlist', {
      distinct_id: req.ctx.token.userId,
      playlist_id: req.input,
    });

    return playlist.body;
  }),
});
