"use server";

import { getSpotifyApi } from "../../sp";
import { getTokenFromCookie } from "../../user";

export async function getRecentlyPlayed(page = 1) {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }
  const spotifyApi = getSpotifyApi(token.accessToken);

  const res = await spotifyApi.getMyRecentlyPlayedTracks({
    limit: 50,
    // offset: req.input.page === 1 ? 0 : req.input.page * 50,
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
