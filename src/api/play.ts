"use server";

import { Mutation } from "@tanstack/react-query";
import { getSpotifyApi } from "../app/sp";
import { getTokenFromCookie } from "../app/user";

export const playTrack: Mutation<
  "track.play",
  { trackIds: string[]; offset: string; deviceId: string }
> = async ({ trackIds, offset, deviceId }) => {
  "use server";
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const spotifyApi = getSpotifyApi(token.accessToken);

  await spotifyApi.play({
    uris: trackIds,
    device_id: deviceId,
    offset: { uri: offset },
  });
};
