"use server";

import { Page, SimplifiedTrack } from "@spotify/web-api-ts-sdk";
import { getTokenFromCookie } from "../app/user";
import { notFound } from "next/navigation";

export const getAlbumTracks = async (id: string, pageParam: number) => {
  const token = await getTokenFromCookie();
  if (!token) {
    notFound();
  }

  const res = await fetch(
    `https://api.spotify.com/v1/albums/${id}/tracks?limit=50&offset=${
      pageParam === 1 ? 0 : pageParam * 50
    }&market=from_token`,
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
  );

  const body = (await res.json()) as Page<SimplifiedTrack>;

  const ids = body.items.map((item) => item.id).join(",");

  const res2 = await fetch(
    `https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`,
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
  );

  const body2 = (await res2.json()) as string[];

  return {
    tracks: body.items.map((item, index) => ({
      ...item,
      isSaved: body2[index],
      spotifyId: item.id,
    })),
    nextPage: body.next ? pageParam + 1 : null,
    total: body.total,
  };
};
