"use client";

import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { ArtistsColumn } from "../../../../../components/ArtistsColumn";
import { SpotifyLinkColumn } from "../../../../../components/SpotifyLinkColumn";
import { VirtualTable } from "../../../../../components/VirtualTable";

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    size: 300,
    cell: (params) => (
      <Link
        href={`/album/${params.row.original.id}`}
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

export function Table({ data }) {
  return (
    <VirtualTable
      columns={columns}
      data={data}
      // isLoading={isFetching}
    />
  );
}
