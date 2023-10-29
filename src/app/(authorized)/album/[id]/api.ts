"use server";

import { getSpotifyApi } from "../../../sp";
import { getTokenFromCookie } from "../../../user";

export async function getAlbum(id: string) {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }
  const spotifyApi = getSpotifyApi(token.accessToken);

  const album = await spotifyApi.getAlbum(id, {
    market: "from_token",
  });

  return album.body;
}

export async function getAlbumTracks(albumId: string, page: number) {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }
  const spotifyApi = getSpotifyApi(token.accessToken);

  const res = await spotifyApi.getAlbumTracks(albumId, {
    limit: 50,
    offset: page === 1 ? 0 : page * 50,
    market: "from_token",
  });

  return {
    tracks: res.body.items.map((item) => ({
      ...item,
      spotifyId: item.id,
    })),
    nextPage: res.body.next ? page + 1 : null,
    total: res.body.total,
  };
}
