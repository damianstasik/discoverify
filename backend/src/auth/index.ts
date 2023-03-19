import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, procedure } from '..';
import { getSpotifyApi } from '../spotify';
import { procedureWithAuthToken, withAuthToken } from './middleware';
import * as jwt from 'jsonwebtoken';
import { isPast } from 'date-fns';

function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object,
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }

      return [err, undefined];
    });
}

const scopes = [
  'user-read-private',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-top-read',
  'user-read-currently-playing',
  'user-follow-read',
  'playlist-read-private',
  'user-read-email',
  'user-library-read',
  'playlist-read-collaborative',
  'user-follow-modify',
  'user-library-modify',
  'streaming',
];

export const authRouter = router({
  refresh: procedure
    .use(withAuthToken({ ignoreExpiration: true }))
    .mutation(async (req) => {
      const spotifyApi = getSpotifyApi();

      spotifyApi.setRefreshToken(req.ctx.token.refreshToken);

      if (isPast(req.ctx.token.exp)) {
        console.log('refreshing access token');

        const res = await spotifyApi.refreshAccessToken();

        console.log('refreshing res', res);

        const newToken = jwt.sign(
          {
            accessToken: res.body.access_token,
            refreshToken: req.ctx.token.refreshToken,
            userId: req.ctx.token.userId,
          },
          'temp-secret',
          {
            expiresIn: res.body.expires_in,
          },
        );

        return newToken;
      }

      return req.ctx.rawToken;
    }),
  url: procedure.mutation(() => {
    const url = getSpotifyApi().createAuthorizeURL(scopes, '');
    console.log('url', url);

    return url;
  }),
  me: procedureWithAuthToken.query(async (req) => {
    const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);

    const [profileError, profileResult] = await to(spotifyApi.getMe());

    if (profileError || !profileResult) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
      });
    }

    const { email, display_name: displayName, id, images } = profileResult.body;

    return {
      email,
      displayName: displayName || null,
      spotifyId: id,
      photoUrl: images?.[0].url || null,
    };
  }),
  authorize: procedure.input(z.string()).query(async ({ ctx, input }) => {
    const spotifyApi = getSpotifyApi();

    const [codeGrantError, codeGrantResult] = await to(
      spotifyApi.authorizationCodeGrant(input),
    );

    if (codeGrantError || !codeGrantResult) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }

    spotifyApi.setAccessToken(codeGrantResult.body.access_token);
    spotifyApi.setRefreshToken(codeGrantResult.body.refresh_token);

    const [profileError, profileResult] = await to(spotifyApi.getMe());

    if (profileError || !profileResult) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    const token = jwt.sign(
      {
        accessToken: codeGrantResult.body.access_token,
        refreshToken: codeGrantResult.body.refresh_token,
        userId: profileResult.body.id,
      },
      'temp-secret',
      {
        expiresIn: codeGrantResult.body.expires_in,
      },
    );

    return token;
  }),
});