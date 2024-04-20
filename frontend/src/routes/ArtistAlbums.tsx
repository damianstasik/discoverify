import { useSuspenseQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { Link, useParams } from "react-router-dom";
import { ArtistsColumn } from "../components/ArtistsColumn";
import { SpotifyLinkColumn } from "../components/SpotifyLinkColumn";
import { VirtualTable } from "../components/VirtualTable";
import { RouterOutput, trpc } from "../trpc";

type AlbumType = RouterOutput["artist"]["albums"][number];

const columnHelper = createColumnHelper<AlbumType>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    size: 300,
    cell: (params) => (
      <Link
        to={`/album/${params.row.original.id}`}
        className="text-white underline decoration-stone-600 underline-offset-4 hover:decoration-stone-400"
      >
        {params.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("artists", {
    header: "Artist(s)",
    cell: ArtistsColumn,
  }),
  columnHelper.accessor("uri", {
    id: "open",
    header: "",
    size: 40,
    cell: SpotifyLinkColumn,
  }),
];

export function ArtistAlbums() {
  const params = useParams();

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["artist-albums", params.id],
    queryFn: async function artistAlbumsQuery({ signal, queryKey }) {
      const albums = await trpc.artist.albums.query(
        { id: queryKey[1], type: "album" },
        {
          signal,
        },
      );

      return albums;
    },
  });

  return (
    <>
      <VirtualTable
        columns={columns}
        data={data || []}
        isLoading={isFetching}
      />
    </>
  );
}
