"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { ArtistNameColumn } from "../../../../components/ArtistNameColumn";

import { SpotifyLinkColumn } from "../../../../components/SpotifyLinkColumn";
import { VirtualTable } from "../../../../components/VirtualTable";
import { getTopArtists } from "./api";
import { useTimeRange } from "../useTimeRange";

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    size: 300,
    cell: ArtistNameColumn,
  }),
  columnHelper.accessor("uri", {
    id: "open",
    header: "",
    size: 40,
    cell: SpotifyLinkColumn,
  }),
];

export function Table() {
  const { timeRange } = useTimeRange();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["top-artists", timeRange],
    queryFn: async function topTracksQuery({ pageParam }) {
      return getTopArtists(pageParam, timeRange);
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.artists) ?? [],
    [data],
  );

  return (
    <VirtualTable
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      data={flatData}
      columns={columns}
      isLoading={isFetching}
    />
  );
}
