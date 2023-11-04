"use server";

import { getSpotifyApi } from "../../sp";
import { getTokenFromCookie } from "../../user";

export async function getRecentlyPlayed(page) {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }
  const spotifyApi = getSpotifyApi(token.accessToken);

  const res = await spotifyApi.getMyRecentlyPlayedTracks({
    limit: 50,
    offset: page === 1 ? 0 : page * 50,
  });

  return {
    tracks: res.body.items.map((item) => ({
      ...item.track,
      spotifyId: item.track.id,
      playedAt: item.played_at,
    })),
    nextPage: res.body.next ? page + 1 : null,
    total: res.body.total,
  };
}
