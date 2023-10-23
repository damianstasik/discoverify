import { trpc } from "../trpc";

export const getPlaylists: Query<"user.playlists", [key: string]> = async ({
  pageParam = 1,
  signal,
}) => {
  const artists = await trpc.user.playlists.query(
    { page: pageParam },
    { signal },
  );

  return artists;
};
