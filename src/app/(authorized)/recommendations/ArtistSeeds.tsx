import { notFound } from "next/navigation";
import { ArtistChip } from "../../../components/ArtistChip";
import { getSpotifyApi } from "../../sp";
import { getTokenFromCookie } from "../../user";
async function getArtists(ids: string[]) {
  const token = await getTokenFromCookie();
  if (!token) {
    notFound();
  }

  const spotifyApi = getSpotifyApi(token.accessToken);
  const res = await spotifyApi.getArtists(ids);

  return res.body.artists;
}

export async function ArtistSeeds({ ids }) {
  const artists = await getArtists(ids);
  return artists.map((artist) => (
    <ArtistChip
      key={artist.id}
      id={artist.id}
      name={artist.name}
      imageUrl={artist.images[0].url}
    />
  ));
}
