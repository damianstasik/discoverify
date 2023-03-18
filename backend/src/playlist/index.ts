import { router } from '..';
import { getSpotifyApi } from '../spotify';
import { procedureWithAuthToken } from '../auth/middleware';
import { z } from 'zod';
import { chunk } from 'lodash';

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
      const tracks = spotifyApi.getPlaylistTracks(req.input.id, {
        offset: req.input.page * 100,
      });
    }),
  byId: procedureWithAuthToken.input(z.string()).query(async (req) => {
    const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);
    const a = await spotifyApi.getPlaylist(req.input);

    const { tracks: trs, ...playlist } = a.body;

    const tracks = trs.items
      .filter((track) => track.track)
      .map((track) => ({
        addedBy: track.added_by,
        addedAt: track.added_at,
        ...track.track!,
      }));

    const ids = tracks.map((tr) => tr.id);
    const idGroups = chunk(ids, 50);
    const saved = new Set();

    for (const idGroup of idGroups) {
      const savi = await spotifyApi.containsMySavedTracks(idGroup);

      idGroup.forEach((id, index) => {
        if (savi.body[index]) {
          saved.add(id);
        }
      });
    }

    return {
      ...playlist,
      tracks: tracks.map((t) => ({
        ...t,
        isLiked: saved.has(t.id),
      })),
      meta: {
        total: trs.total,
        limit: trs.limit,
      },
    };
  }),
});
