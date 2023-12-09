"use server";

import { notFound } from "next/navigation";
import { getTokenFromCookie } from "../app/user";

export async function saveTrack(trackId: string) {
  const token = await getTokenFromCookie();

  if (!token) {
    notFound();
  }

  await fetch("https://api.spotify.com/v1/me/tracks", {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
    method: "PUT",
    body: JSON.stringify({
      ids: [trackId],
    }),
  });

  return true;
}
