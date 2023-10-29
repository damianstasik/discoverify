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

  const body = (await res.json()) as SpotifyApi.UsersTopTracksResponse;

  return body.items;
}

export async function TopTracks() {
  const topTracks = await getTopTracks();
  return topTracks.map((track) => <Track track={track} key={track.id} />);
}
