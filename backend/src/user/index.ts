import { router } from '..';
import { getSpotifyApi } from '../spotify';
import { procedureWithAuthToken } from '../auth/middleware';
import { z } from 'zod';

export const userRouter = router({
  playlists: procedureWithAuthToken
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).optional(),
          offset: z.number().min(0).optional(),
        })
        .optional(),
    )
    .query(async (req) => {
      const playlists = await getSpotifyApi(
        req.ctx.token.accessToken,
      ).getUserPlaylists({
        limit: req.input?.limit,
        offset: req.input?.offset,
      });

      return {
        playlists: playlists.body.items,
        hasNextPage: !!playlists.body.next,
      };
    }),
});
