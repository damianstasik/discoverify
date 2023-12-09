import { notFound } from "next/navigation";
import { TrackChip } from "../../../components/TrackChip";
import { getSpotifyApi } from "../../sp";
import { getTokenFromCookie } from "../../user";

async function getTracks(ids: string[]) {
  const token = await getTokenFromCookie();
  if (!token) {
    notFound();
  }

  const spotifyApi = getSpotifyApi(token.accessToken);
  const res = await spotifyApi.getTracks(ids, {
    market: "from_token",
  });

  return res.body.tracks;
}

export async function TrackSeeds({ ids }) {
  const tracks = await getTracks(ids);

  return tracks.map((track) => (
    <TrackChip
      key={track.id}
      id={track.id}
      name={track.name}
      artists={track.artists}
      imageUrl={track.album.images[0].url}
    />
  ));
}
