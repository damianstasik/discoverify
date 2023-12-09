import Link from "next/link";
import { Button } from "../../../components/Button";
import { getSpotifyApi } from "../../sp";
import { getTokenFromCookie } from "../../user";
import { Card } from "./Card";

async function getFollowedArtists() {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const spotifyApi = getSpotifyApi(token.accessToken);

  const likedTracksSpotify = await spotifyApi.getFollowedArtists({
    limit: 1,
  });

  return likedTracksSpotify.body.artists.total;
}

export async function FollowedArtists() {
  const count = await getFollowedArtists();
  return count;
}
