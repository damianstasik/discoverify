"use server";
import { notFound } from "next/navigation";
import { getTokenFromCookie } from "../../user";

export async function getLikedTracks(page: number) {
  const token = await getTokenFromCookie();
  if (!token) {
    notFound();
  }

  const res = await fetch(
    `https://api.spotify.com/v1/me/tracks?limit=50&offset=${
      page === 1 ? 0 : page * 50
    }&market=from_token`,
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
      added_at: item.added_at,
      isLiked: true,
      spotifyId: item.track.id,
      album: {
        id: item.track.album.id,
        name: item.track.album.name,
      },
      isSaved: body2[index],
    })),
    nextPage: body.next ? page + 1 : null,
    total: body.total,
  };
}
