import { Page, Track as TrackItem } from "@spotify/web-api-ts-sdk";
import { getTokenFromCookie } from "../../user";
import { Track } from "./Track";

async function getTopTracks() {
  const token = await getTokenFromCookie();

  if (!token) {
    return [];
  }

  const res = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5",
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
  );

  const body = (await res.json()) as Page<TrackItem>;

  return body.items.map((item) => ({
    id: item.id,
    uri: item.uri,
    name: item.name,
    artists: item.artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
    })),
  }));
}

export async function TopTracks() {
  const topTracks = await getTopTracks();
  return topTracks.map((track) => <Track key={track.id} {...track} />);
}
