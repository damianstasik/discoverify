import { getTokenFromCookie } from "../app/user";
import { SidebarLink } from "./SidebarLink";

async function getPlaylists() {
  const token = await getTokenFromCookie();
  if (!token) {
    return [];
  }

  const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=10", {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });

  const body = await res.json();

  return body.items;
}

export async function SidebarPlaylists() {
  const playlists = await getPlaylists();
  return playlists.map((playlist) => (
    <SidebarLink
      key={playlist.id}
      label={playlist.name}
      to={`/playlist/${playlist.id}`}
    />
  ));
}
