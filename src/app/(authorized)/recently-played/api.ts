"use server";

import { getTokenFromCookie } from "../../user";

export async function getRecentlyPlayed(after) {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=50${
      after ? `&after=${after}` : ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
  );

  const body = await res.json();

  const ids = body.items.map((item) => item.track.id).join(",");

  const res2 = await fetch(
    `https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`,
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
  );

  const body2 = await res2.json();

  return {
    tracks: body.items.map((item, index) => ({
      ...item.track,
      spotifyId: item.track.id,
      playedAt: item.played_at,
      isSaved: body2[index],
    })),
    nextCursor: body.cursors?.after,
    total: body.total,
  };
}
