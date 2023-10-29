import { findImageUrlByMinWidth } from "../../../utils";
import { getSpotifyApi } from "../../sp";
import { getTokenFromCookie } from "../../user";
import { Artist } from "./Artist";
import { CardWithLink } from "./CardWithLink";

async function getTopArtists() {
  const token = await getTokenFromCookie();
  if (!token) {
    return [];
  }

  const spotifyApi = getSpotifyApi(token.accessToken);

  const topArtists = await spotifyApi.getMyTopArtists({
    time_range: "long_term",
    limit: 5,
  });

  return topArtists.body.items;
}

export async function TopArtists() {
  const topArtists = await getTopArtists();
  return topArtists.map((artist) => <Artist key={artist.id} artist={artist} />);
}
