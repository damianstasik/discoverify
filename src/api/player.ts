"use server";

import { getSpotifyApi } from "../app/sp";
import { getTokenFromCookie } from "../app/user";

export async function pausePlayer(deviceId) {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const spotifyApi = getSpotifyApi(token.accessToken);
  await spotifyApi.pause({
    device_id: deviceId,
  });
}
