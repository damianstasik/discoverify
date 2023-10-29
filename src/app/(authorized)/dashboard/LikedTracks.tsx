import Link from "next/link";
import { Button } from "../../../components/Button";
import { getSpotifyApi } from "../../sp";
import { getTokenFromCookie } from "../../user";
import { Card } from "./Card";

async function getLikedTracks() {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const spotifyApi = getSpotifyApi(token.accessToken);

  const likedTracksSpotify = await spotifyApi.getMySavedTracks({
    limit: 1,
    market: "from_token",
  });

  return likedTracksSpotify.body.total;
}

export async function LikedTracks() {
  const count = await getLikedTracks();

  return count;
}
