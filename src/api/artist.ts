export async function getFollowedArtistsTopTracks(
  tokenId: string,
  genre: string | null,
  page: number,
): any {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/followed-artists/top-tracks?tokenId=${tokenId}&genre=${genre}&page=${page}`,
  );

  const body = await res.json();

  return body;
}
