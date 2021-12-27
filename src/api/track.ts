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
