"use server";

import concatLimit from "async/concatLimit";
import shuffle from "lodash/shuffle";
import { getSpotifyApi } from "../../../../sp";
import { getTokenFromCookie } from "../../../../user";

export async function getRelatedArtistsTopTracks(artistId: string) {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }
  const spotifyApi = getSpotifyApi(token.accessToken);

  const me = await spotifyApi.getMe();

  try {
    const d = await spotifyApi.getArtistRelatedArtists(artistId);

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
  }
}
