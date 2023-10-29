"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { formatRelative } from "date-fns";
import { useMemo } from "react";
import { AlbumColumn } from "../../../components/AlbumColumn";
import { ArtistsColumn } from "../../../components/ArtistsColumn";
import { CheckboxColumn } from "../../../components/CheckboxColumn";
import { DurationColumn } from "../../../components/DurationColumn";
import { SaveColumn } from "../../../components/SaveColumn";
import { SpotifyLinkColumn } from "../../../components/SpotifyLinkColumn";
import { TrackNameColumn } from "../../../components/TrackNameColumn";
import { TrackPreviewColumn } from "../../../components/TrackPreviewColumn";
import { VirtualTable } from "../../../components/VirtualTable";
import { usePlayPauseTrackHook } from "../../../hooks/usePlayPauseTrackHook";
import { getRecentlyPlayed } from "./api";

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.display({
    size: 40,
    id: "select",
    header: ({ table }) => (
      <CheckboxColumn
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <CheckboxColumn
        {...{
          checked: row.getIsSelected(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  }),
  columnHelper.accessor("uri", {
    header: "",
    id: "preview",
    size: 50,
    cell: TrackPreviewColumn,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    minSize: 200,
    cell: TrackNameColumn,
    size: 0.4,
  }),
  columnHelper.accessor("artists", {
    header: "Artist(s)",
    cell: ArtistsColumn,
    minSize: 200,
    size: 0.3,
  }),
  columnHelper.accessor("album", {
    header: "Album",
    cell: AlbumColumn,
    minSize: 200,
    size: 0.3,
  }),
  columnHelper.accessor("playedAt", {
    header: "Played At",
    cell: (params: any) => {
      return formatRelative(new Date(params.getValue()), new Date());
    },
    size: 180,
  }),
  columnHelper.accessor("duration_ms", {
    header: "Duration",
    cell: DurationColumn,
    size: 80,
  }),
  columnHelper.accessor("isLiked", {
    header: "",
    size: 40,
    cell: SaveColumn,
  }),
  columnHelper.accessor("uri", {
    id: "open",
    header: "",
    size: 50,
    cell: SpotifyLinkColumn,
  }),
];

const recentlyPlayedQuery = async ({ pageParam = 1 }) => {
  const tracks = await getRecentlyPlayed(pageParam);

  return tracks;
};

export default function RecentlyPlayed() {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["recently-played"],
    queryFn: recentlyPlayedQuery,
    getNextPageParam: () => null,
    initialPageParam: 0,
  });

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.tracks) ?? [],
    [data],
  );

  const ids = useMemo(() => flatData.map((t) => t.uri), [flatData]);

  usePlayPauseTrackHook(ids);

  return (
    <>
      <VirtualTable
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isFetching}
        data={flatData}
        columns={columns}
      />
    </>
  );
}
