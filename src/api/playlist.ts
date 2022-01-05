export async function getPlaylists(tokenId: string, page: number): any {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/playlists?tokenId=${tokenId}&page=${page}`,
  );

  const body = await res.json();

  return body;
}
