"use server";

import { FollowedArtists } from "@spotify/web-api-ts-sdk";
import { getTokenFromCookie } from "../app/user";

export async function getArtist(after: string) {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const req = await fetch(
    `https://api.spotify.com/v1/me/following?type=artist&limit=50${
      after ?? `&after=${after}`
    }`,
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
  );

  const body = (await req.json()) as FollowedArtists;

  return body;
}
