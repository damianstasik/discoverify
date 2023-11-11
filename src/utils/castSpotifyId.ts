function addPrefixWhenMissing(id: string) {
  return id.startsWith("spotify:") ? id : `spotify:${id}`;
}

export function castSpotifyId(id: string | string[]) {
  return Array.isArray(id)
    ? id.map(addPrefixWhenMissing)
    : addPrefixWhenMissing(id);
}
