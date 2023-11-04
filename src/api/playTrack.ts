"use server";

import { getTokenFromCookie } from "../app/user";

export const playTrack = async ({ trackIds, trackId, deviceId }) => {
  const token = await getTokenFromCookie();
  if (!token) {
    return false;
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

  return true;
};
