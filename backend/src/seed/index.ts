import { router } from '..';
import { getSpotifyApi } from '../spotify';
import { procedureWithAuthToken } from '../auth/middleware';
import { z } from 'zod';
import { search } from 'fast-fuzzy';

interface GenreSearchResult {
  type: 'genre';
  id: string;
  label: string;
}

interface ArtistSearchResult {
  type: 'artist';
  id: string;
  label: string;
  img: string;
}

interface TrackSearchResult {
  type: 'track';
  id: string;
  label: string;
  img: string;
  name: string;
  artists: SpotifyApi.ArtistObjectSimplified[];
}

type SearchResult = GenreSearchResult | ArtistSearchResult | TrackSearchResult;

export const seedRouter = router({
  search: procedureWithAuthToken
    .input(z.string())
    .query<SearchResult[]>(async (req) => {
      const allGenres = await getSpotifyApi(
        req.ctx.token.accessToken,
      ).getAvailableGenreSeeds();

      const genres: SearchResult[] = search(
        req.input,
        allGenres.body.genres,
      ).map((genre) => ({
        type: 'genre',
        label: genre,
        id: `genre-${genre}`,
      }));

      const results = await getSpotifyApi(req.ctx.token.accessToken).search(
        req.input,
        ['artist', 'track'],
      );

      const artists: ArtistSearchResult[] =
        results.body.artists?.items.map((artist) => ({
          type: 'artist',
          label: artist.name,
          id: `artist-${artist.id}`,
          img: artist.images?.[0]?.url,
        })) ?? [];

      const tracks: TrackSearchResult[] =
        results.body.tracks?.items.map((track) => ({
          type: 'track',
          label: `${track.artists.map((artist) => artist.name).join(', ')} - ${
            track.name
          }`,
          name: track.name,
          artists: track.artists,
          id: `${track.id}`,
          img: track.album.images?.[0]?.url,
        })) ?? [];

      return [...artists, ...tracks, ...genres];
    }),
});
