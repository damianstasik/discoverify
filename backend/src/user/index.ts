import { router } from '..';
import { getSpotifyApi } from '../spotify';
import { procedureWithAuthToken } from '../auth/middleware';
import { z } from 'zod';

export const userRouter = router({
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
});
