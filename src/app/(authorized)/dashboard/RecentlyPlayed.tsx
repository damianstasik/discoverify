import Link from "next/link";
import { Button } from "../../../components/Button";
import { getSpotifyApi } from "../../sp";
import { getTokenFromCookie } from "../../user";
import { Card } from "./Card";
import { Track } from "./Track";

async function getRecentlyPlayed() {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const spotifyApi = getSpotifyApi(token.accessToken);

  const recentlyPlayed = await spotifyApi.getMyRecentlyPlayedTracks({
    limit: 1,
  });

  return recentlyPlayed.body?.items[0].track;
}

export async function RecentlyPlayed() {
  const track = await getRecentlyPlayed();

  return <Track track={track} />;
}
