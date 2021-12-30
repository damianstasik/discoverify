export async function saveTrack(
  tokenId: string,
  trackId: string,
): Promise<void> {
  await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/save?tokenId=${tokenId}&trackId=${trackId}`,
    {
      method: 'put',
    },
  );
}

export async function getTopTracks(
  tokenId: string,
  timeRange: string,
  page: number,
): any {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/top-tracks?tokenId=${tokenId}&page=${page}&timeRange=${timeRange}`,
  );

  const body = await res.json();

  return body;
}
