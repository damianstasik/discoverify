import { z } from 'zod';
import { router } from '..';
import { procedureWithAuthToken } from '../auth/middleware';
import { getSpotifyApi } from '../spotify';
import { mixpanel } from '../mixpanel';

export const albumRouter = router({
  byId: procedureWithAuthToken.input(z.string()).query(async (req) => {
    const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);
    const album = await spotifyApi.getAlbum(req.input);

    mixpanel.track('get_album', {
      distinct_id: req.ctx.token.userId,
      album_id: req.input,
    });

    return album.body;
  }),
});
