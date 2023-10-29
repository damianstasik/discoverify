"use server";

import { getSpotifyApi } from "../../../../sp";
import { getTokenFromCookie } from "../../../../user";

export const getAlbum = async (artistId: string, type: "album") => {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }
  const spotifyApi = getSpotifyApi(token.accessToken);

  const albums = await spotifyApi.getArtistAlbums(artistId, {
    limit: 50,
    include_groups: type,

    // @ts-ignore - this is a valid option
    market: "from_token",
  });

  return albums.body.items.map((item) => ({
    ...item,
    spotifyId: item.id,
  }));
};
