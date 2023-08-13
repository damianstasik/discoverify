"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo } from "react";
import * as playlistApi from "../../../api/playlist";
import { SpotifyLinkColumn } from "../../../components/SpotifyLinkColumn";
import { VirtualTable } from "../../../components/VirtualTable";

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    size: 300,
    cell: (params) => (
      <Link
        href={`/playlist/${params.row.original.id}`}
        className="text-white underline decoration-blue-900 underline-offset-4 hover:decoration-blue-500 hover:text-blue-500"
      >
        {params.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("owner", {
    header: "Owner",
    size: 300,
    cell: (params) => params.getValue().display_name,
  }),
  columnHelper.accessor("uri", {
    id: "open",
    header: "",
    size: 40,
    cell: SpotifyLinkColumn,
  }),
];

export function Playlists() {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["playlists"],
    queryFn: playlistApi.getPlaylists,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.playlists) ?? [],
    [data],
  );

  return (
    <>
      <VirtualTable
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        data={flatData}
        columns={columns}
        isLoading={isFetching}
      />
    </>
  );
}
