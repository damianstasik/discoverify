"use server";

import { getSpotifyApi } from "../app/sp";
import { getTokenFromCookie } from "../app/user";

export const getPlaylists: Query<"user.playlists", [key: string]> = async ({
  pageParam = 1,
  signal,
}) => {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const spotifyApi = getSpotifyApi(token.accessToken);

  const playlists = await spotifyApi.getUserPlaylists({
    limit: 50,
    offset: pageParam === 1 ? 0 : pageParam * 50,
  });

  return {
    playlists: playlists.body.items,
    nextPage: !!playlists.body.next,
  };
};
