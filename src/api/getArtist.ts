"use server";

import { getTokenFromCookie } from "../app/user";

export async function getArtist(id: string) {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const req = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
    next: { revalidate: 3600 },
  });
  const body = await req.json();

  return body;
}
