"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { AddedAtColumn } from "../../../../components/AddedAtColumn";
import { AlbumColumn } from "../../../../components/AlbumColumn";
import { ArtistsColumn } from "../../../../components/ArtistsColumn";
import { CheckboxColumn } from "../../../../components/CheckboxColumn";
import { DurationColumn } from "../../../../components/DurationColumn";
import { SaveColumn } from "../../../../components/SaveColumn";
import { SpotifyLinkColumn } from "../../../../components/SpotifyLinkColumn";
import { TrackNameColumn } from "../../../../components/TrackNameColumn";
import { TrackPreviewColumn } from "../../../../components/TrackPreviewColumn";
import { VirtualTable } from "../../../../components/VirtualTable";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useMemo } from "react";
import { usePlayPauseTrackHook } from "../../../../hooks/usePlayPauseTrackHook";
import { useIgnoreTrackHook } from "../../../../hooks/useIgnoreTrackHook";
import { getPlaylistTracks } from "../../../../api/getPlaylistTracks";

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
  columnHelper.accessor("added_at", {
    header: "Added At",
    cell: AddedAtColumn,
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

export function Table({ id }) {
  const {
    data: tracks,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["playlistTracks", id],
    queryFn: async ({ pageParam }) => getPlaylistTracks(id, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const flatData = useMemo(
    () => tracks?.pages?.flatMap((page) => page?.tracks) ?? [],
    [tracks],
  );

  const ids = useMemo(() => flatData.map((t) => t.uri), [flatData]);

  usePlayPauseTrackHook(ids);

  useIgnoreTrackHook();

  return (
    <VirtualTable
      columns={columns}
      data={flatData}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
