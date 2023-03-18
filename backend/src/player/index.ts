import { router } from '..';
import { procedureWithAuthToken } from '../auth/middleware';

export const playerRouter = router({
  queue: procedureWithAuthToken.query(async (req) => {
    const res = await fetch('https://api.spotify.com/v1/me/player/queue', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.ctx.token.accessToken}`,
      },
    });

    const body = await res.json();

    return body?.queue || [];
  }),
});
