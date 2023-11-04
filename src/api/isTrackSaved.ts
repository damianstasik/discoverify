"use server";

import { getTokenFromCookie } from "../app/user";

export const isTrackSaved = async (id) => {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const res = await fetch(
    `https://api.spotify.com/v1/me/tracks/contains?ids=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
  );

  const body = await res.json();

  return body?.[0] ?? false;
};
