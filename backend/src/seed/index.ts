import { search } from "fast-fuzzy";
import { z } from "zod";
import { router } from "..";
import { procedureWithAuthToken } from "../auth/middleware";
import { mixpanel } from "../mixpanel";
import { getSpotifyApi } from "../spotify";

interface GenreSearchResult {
  type: "genre";
  id: string;
  label: string;
}

interface ArtistSearchResult {
  type: "artist";
  id: string;
  label: string;
  img: string;
}

interface TrackSearchResult {
  type: "track";
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
        type: "genre",
        label: genre,
        id: `${genre}`,
      }));

      const results = await getSpotifyApi(req.ctx.token.accessToken).search(
        req.input,
        ["artist", "track"],
        {
          market: "from_token",
        },
      );

      const artists: ArtistSearchResult[] =
        results.body.artists?.items.map((artist) => ({
          type: "artist",
          label: artist.name,
          id: `${artist.id}`,
          img: artist.images?.[0]?.url,
        })) ?? [];

      const tracks: TrackSearchResult[] =
        results.body.tracks?.items.map((track) => ({
          type: "track",
          label: `${track.artists.map((artist) => artist.name).join(", ")} - ${
            track.name
          }`,
          name: track.name,
          artists: track.artists,
          id: `${track.id}`,
          img: track.album.images?.[0]?.url,
        })) ?? [];

      mixpanel.track("get_seeds", {
        distinct_id: req.ctx.token.userId,
        query: req.input,
      });

      return [...artists, ...tracks, ...genres];
    }),
});
