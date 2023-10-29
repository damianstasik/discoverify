"use server";

import { getSpotifyApi } from "../app/sp";
import { getTokenFromCookie } from "../app/user";

export const getPlaylistTracks = async (id, pageParam) => {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const spotifyApi = getSpotifyApi(token.accessToken);

  const tracks = await spotifyApi.getPlaylistTracks(id, {
    limit: 50,
    offset: pageParam === 1 ? 0 : pageParam * 50,
    market: "from_token",
  });

  return {
    tracks: tracks.body.items.map((item) => ({
      ...item.track,
      added_at: item.added_at,
      isLiked: true,
      spotifyId: item.track?.id,
    })),
    nextPage: tracks.body.next ? pageParam + 1 : null,
    total: tracks.body.total,
  };
};
