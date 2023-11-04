"use server";

import { getTokenFromCookie } from "../app/user";

export async function unsaveTrack(trackId: string) {
  const token = await getTokenFromCookie();
  if (!token) {
    return true;
  }

  await fetch(`https://api.spotify.com/v1/me/tracks`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
    method: "DELETE",
    body: JSON.stringify({
      ids: [trackId],
    }),
  });

  return false;
}
