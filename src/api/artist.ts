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
