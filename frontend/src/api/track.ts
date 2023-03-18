export async function saveTrack(token: string, trackId: string): Promise<void> {
  await fetch(
    `${import.meta.env.VITE_API_URL}/save?tokenId=${token}&trackId=${trackId}`,
    {
      method: 'put',
    },
  );
}

export async function getTopTracks(
  token: string,
  timeRange: string,
  page: number,
): any {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/top-tracks?tokenId=${token}&page=${page}&timeRange=${timeRange}`,
  );

  const body = await res.json();

  return body;
}
