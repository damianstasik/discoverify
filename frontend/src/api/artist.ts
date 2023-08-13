"use server";
import { notFound } from "next/navigation";
import { getSpotifyApi } from "../app/sp";
import { getTokenFromCookie } from "../app/user";

export async function getTopTracks(id: string) {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const spotifyApi = getSpotifyApi(token.accessToken);

  const me = await spotifyApi.getMe();

  const tracks = await spotifyApi.getArtistTopTracks(
    id,
    me.body.country, // TODO: this is passed as `country` in the code, but it should be `market`
  );

  return tracks.body.tracks;
}

export async function getArtist(id: string) {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const spotifyApi = getSpotifyApi(token.accessToken);
  const artist = await spotifyApi.getArtist(id);

  return artist.body;
}

export async function getFollowedArtistsTopTracks(
  token: string,
  genre: string | null,
  page: number,
): any {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/track/top-followed?genre=${genre}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const body = await res.json();

  return body;
}

export async function getRelatedArtistsTopTracks(
  token: string,
  id: string,
  page: number,
): any {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/related-artists/top-tracks/${id}?tokenId=${token}&page=${page}`,
  );

  const body = await res.json();

  return body;
}

export const getArtists: Query<
  "artist.byIds",
  [key: string, artistIds: string[]]
> = async ({ queryKey, signal }) => {
  const token = await getTokenFromCookie();
  if (!token) {
    notFound();
  }
  const spotifyApi = getSpotifyApi(token.accessToken);

  const res = await spotifyApi.getArtists(queryKey[1]);

  return res.body.artists;
};
