export async function getPlaylists(token: string, page: number): any {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/playlists?tokenId=${token}&page=${page}`,
  );

  const body = await res.json();

  return body;
}
