import { z } from 'zod';
import { router } from '..';
import { procedureWithAuthToken } from '../auth/middleware';
import { getSpotifyApi } from '../spotify';
import { concatLimit } from 'async';
import { shuffle } from 'lodash';

interface Response<T> {
  body: T;
  headers: Record<string, string>;
  statusCode: number;
}

type EndpointFunction<T> = (
  limit?: number,
  offset?: number,
) => Promise<Response<SpotifyApi.PagingObject<T>>>;

async function getOffsetPaginatedEndpoint<T>(
  endpoint: EndpointFunction<T>,
  rootKey?: keyof SpotifyApi.PagingObject<T>,
  limit = 50,
  offset = 0,
) {
  const res = await endpoint(limit, offset);
  const body = res.body;
  const result = body.items;

  if (body.total <= limit) {
    return result;
  }

  const requests = Array.from({
    length: Math.ceil(body.total / limit) - 1,
  }).map((_, i) => endpoint(limit, limit * (i + 1)).then((r) => r.body.items));

  const results = await Promise.all(requests);

  results.unshift(result);

  return results.flat();
}

export const artistRouter = router({
  byId: procedureWithAuthToken.input(z.string())

  .query(async (req) => {
    const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);
    const artist = await spotifyApi.getArtist(req.input);

    return artist.body;
  }),
  topTracks: procedureWithAuthToken.input(z.string()).query(async (req) => {
    const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);

    const me = await spotifyApi.getMe();

    const tracks = await spotifyApi.getArtistTopTracks(
      req.input,
      me.body.country,
    );

    return tracks.body.tracks;
  }),
  albums: procedureWithAuthToken
    .input(
      z.object({
        id: z.string(),
        type: z.enum(['album', 'single', 'appears_on']),
      }),
    )
    .query(async (req) => {
      const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);

      const albums = await spotifyApi.getArtistAlbums(req.input.id, {
        limit: 50,
        include_groups: req.input.type,
      });

      return albums.body.items.map((item) => ({
        ...item,
        spotifyId: item.id,
      }));
    }),
  relatedArtistsTopTracks: procedureWithAuthToken
    .input(
      z.object({
        id: z.string(),
        page: z.number(),
      }),
    )
    .query(async (req) => {
      const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);

      const me = await spotifyApi.getMe();

      try {
        const d = await spotifyApi.getArtistRelatedArtists(req.input.id);

        const t = await concatLimit(d.body.artists, 8, async (a) => {
          const tops = await spotifyApi.getArtistTopTracks(
            a.id,
            me.body.country,
          );

          return tops.body.tracks;
        });

        const da = shuffle(t);

        return {
          data: da,
          hasNextPage: false,
        };
      } catch (e) {
        return {
          data: [],
          hasNextPage: false,
        };
      }
    }),
});
