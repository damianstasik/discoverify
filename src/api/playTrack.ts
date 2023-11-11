"use server";

import { notFound } from "next/navigation";
import { getTokenFromCookie } from "../app/user";

interface Params {
  trackIds: string[];
  trackId: string;
  deviceId: string;
}

export const playTrack = async ({ trackIds, trackId, deviceId }: Params) => {
  const token = await getTokenFromCookie();

  if (!token) {
    notFound();
  }

  const res = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
      method: "PUT",
      body: JSON.stringify({
        uris: trackIds,
        offset: { uri: trackId },
      }),
    },
  );

  if (!res.ok) {
    return false;
  }

  return true;
};
