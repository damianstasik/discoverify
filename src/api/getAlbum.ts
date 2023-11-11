"use server";

import { notFound } from "next/navigation";
import { getTokenFromCookie } from "../app/user";
import { Album } from "@spotify/web-api-ts-sdk";

export async function getAlbum(id: string) {
  const token = await getTokenFromCookie();
  if (!token) {
    notFound();
  }

  const res = await fetch(
    `https://api.spotify.com/v1/albums/${id}?market=from_token`,
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    },
  );

  const body = (await res.json()) as Album;

  return body;
}
