"use server";

import { getSpotifyApi } from "../app/sp";
import { getTokenFromCookie } from "../app/user";

export const getPlaylistTracks = async (id, pageParam) => {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${id}/tracks?limit=50&offset=${
      pageParam === 1 ? 0 : pageParam * 50
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
      isSaved: body2[index],
      spotifyId: item.track?.id,
    })),
    nextPage: body.next ? pageParam + 1 : null,
    total: body.total,
  };
};
