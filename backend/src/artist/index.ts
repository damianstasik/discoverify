import { z } from 'zod';
import { router } from '..';
import { procedureWithAuthToken } from '../auth/middleware';
import { getSpotifyApi } from '../spotify';
import { concatLimit, mapLimit } from 'async';
import { chunk, shuffle, uniq } from 'lodash';
import { mixpanel } from '../mixpanel';
import SpotifyWebApi from 'spotify-web-api-node';

export const artistRouter = router({
  top: procedureWithAuthToken
    .input(
      z.object({
        page: z.number(),
        timeRange: z.enum(['short_term', 'medium_term', 'long_term']),
      }),
    )
    .query(async (req) => {
      const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);

      const res = await spotifyApi.getMyTopArtists({
        limit: 50,
        offset: req.input.page === 1 ? 0 : req.input.page * 50,
        time_range: req.input.timeRange,
      });

      mixpanel.track('get_top_artists', {
        distinct_id: req.ctx.token.userId,
        time_range: req.input.timeRange,
        page: req.input.page,
      });

      return {
        artists: res.body.items.map((item) => ({
          ...item,
          spotifyId: item.id,
        })),
        nextPage: res.body.next ? req.input.page + 1 : null,
        total: res.body.total,
      };
    }),
  byId: procedureWithAuthToken.input(z.string()).query(async (req) => {
    const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);
    const artist = await spotifyApi.getArtist(req.input);

    mixpanel.track('get_artist', {
      distinct_id: req.ctx.token.userId,
      artist_id: req.input,
    });

    return artist.body;
  }),
  byIds: procedureWithAuthToken.input(z.string().array()).query(async (req) => {
    const res = await getSpotifyApi(req.ctx.token.accessToken).getArtists(
      req.input,
    );

    mixpanel.track('get_artists', {
      distinct_id: req.ctx.token.userId,
      artist_ids: req.input,
    });

    return res.body.artists;
  }),
  topTracks: procedureWithAuthToken.input(z.string()).query(async (req) => {
    const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);

    const me = await spotifyApi.getMe();

    const tracks = await spotifyApi.getArtistTopTracks(
      req.input,
      me.body.country, // TODO: this is passed as `country` in the code, but it should be `market`
    );

    mixpanel.track('get_artist_top_tracks', {
      distinct_id: req.ctx.token.userId,
      artist_id: req.input,
    });

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

        // @ts-ignore - this is a valid option
        market: 'from_token',
      });

      mixpanel.track('get_artist_albums', {
        distinct_id: req.ctx.token.userId,
        artist_id: req.input.id,
        type: req.input.type,
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
            me.body.country, // TODO: this is passed as `country` in the code, but it should be `market`
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
      } finally {
        mixpanel.track('get_related_artists_top_tracks', {
          distinct_id: req.ctx.token.userId,
          artist_id: req.input.id,
          page: req.input.page,
        });
      }
    }),
  getArtistsFromSavedTracks: procedureWithAuthToken
    .input(
      z.object({
        offset: z.number().default(0),
      }),
    )
    .query(async (req) => {
      const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);

      let results = [];
      let offset: number | null = req.input.offset;

      do {
        const { data, nextOffset } = await getUntil(spotifyApi, offset);
        results = results.concat(data);
        offset = nextOffset;
      } while (results.length < 50 && offset !== null);

      return {
        data: results,
        nextOffset: offset,
      };
    }),
});

async function getUntil(api: SpotifyWebApi, offset: number) {
  const d = await api.getMySavedTracks({
    limit: 50,
    offset: offset,
  });

  const artistIds = uniq(
    d.body.items.reduce<string[]>(
      (acc, item) => acc.concat(item.track.artists.map((a) => a.id)),
      [],
    ),
  );

  const chunkedArtistIds = chunk(artistIds, 50);

  const i = await concatLimit(chunkedArtistIds, 3, async (a) => {
    const b = await api.isFollowingArtists(a);

    const unfollowed = [];

    for (let i = 0; i < b.body.length; i++) {
      if (!b.body[i]) {
        unfollowed.push(a[i]);
      }
    }

    if (unfollowed.length === 0) {
      return [];
    }

    const tops = await api.getArtists(unfollowed);

    return tops.body.artists;
  });

  return {
    data: i,
    nextOffset: d.body.next ? offset + 50 : null,
  };
}
