"use server";

import { getTokenFromCookie } from "../app/user";
import { getSpotifyApi } from "../app/sp";

export const getPlaylist = async (id: string) => {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const spotifyApi = getSpotifyApi(token.accessToken);

  const playlist = await spotifyApi.getPlaylist(id, {
    market: "from_token",
  });

  return playlist.body;
};
