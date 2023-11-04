"use server";

import { getTokenFromCookie } from "../../../user";

export async function getTopArtists(
  page: number,
  timeRange: "short_term" | "medium_term" | "long_term",
) {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const res = await fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=50&offset=${
      page === 1 ? 0 : page * 50
    }&time_range=${timeRange}`,
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
  );

  const body = await res.json();

  const ids = body.items.map((item) => item.id).join(",");

  const res2 = await fetch(
    `https://api.spotify.com/v1/me/following/contains?ids=${ids}`,
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
  );

  const body2 = await res2.json();

  return {
    artists: body.items.map((item, index) => ({
      ...item,
      spotifyId: item.id,
      isSaved: body2[index],
    })),
    nextPage: body.next ? page + 1 : null,
    total: body.total,
  };
}
