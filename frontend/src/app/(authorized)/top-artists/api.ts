"use server";

import { getSpotifyApi } from "../../sp";
import { getTokenFromCookie } from "../../user";

export async function getTopArtists(
  page: number,
  timeRange: "short_term" | "medium_term" | "long_term",
) {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }
  const spotifyApi = getSpotifyApi(token.accessToken);

  const res = await spotifyApi.getMyTopArtists({
    limit: 50,
    offset: page === 1 ? 0 : page * 50,
    time_range: timeRange,
  });

  return {
    artists: res.body.items.map((item) => ({
      ...item,
      spotifyId: item.id,
    })),
    nextPage: res.body.next ? page + 1 : null,
    total: res.body.total,
  };
}
