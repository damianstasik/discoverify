import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
// import { useRecoilValue } from "recoil";
import { Button } from "../components/Button";
import { VirtualTable } from "../components/VirtualTable";
// import { tokenState } from "../store";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "count",
    header: "Count",
  },
  {
    id: "actions",
    header: "Top tracks from genre",
    cell: (params) => (
      <Button
        component={Link}
        href={`/followed-artists/top-tracks?genre=${encodeURIComponent(
          params.row.original.name,
        )}`}
      >
        Top tracks
      </Button>
    ),
  },
];

async function fetchFollowedArtistsGenres(token) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/followed-artists/genres?tokenId=${token}`,
  );

  const body = await res.json();

  return body;
}

export function FollowedArtistsGenres() {
  // const token = useRecoilValue(tokenState);

  const { isLoading, data } = useQuery({
    queryKey: ["followed-artists-genres"],
    queryFn: async function followedArtistsGenres() {
      return fetchFollowedArtistsGenres();
    },
  });

  return (
    <>
      <div variant="h5" sx={{ mb: 1 }}>
        Genres from followed artists
      </div>

      <div variant="subtitle1" sx={{ mb: 2 }}>
        Here are genres
      </div>

      <div style={{ height: 800 }}>
        <VirtualTable isLoading={isLoading} rows={data} columns={columns} />
      </div>
    </>
  );
}
