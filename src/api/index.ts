export function createUrl(
  path: string,
  params: Record<string, string>,
): string {
  const query = new URLSearchParams(params);
  return `${import.meta.env.VITE_API_URL}/${path}?${query}`;
}
