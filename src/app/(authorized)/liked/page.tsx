"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { AddedAtColumn } from "../../../components/AddedAtColumn";
import { AlbumColumn } from "../../../components/AlbumColumn";
import { ArtistsColumn } from "../../../components/ArtistsColumn";
import { CheckboxColumn } from "../../../components/CheckboxColumn";
import { DurationColumn } from "../../../components/DurationColumn";
import { SaveColumn } from "../../../components/SaveColumn";
import { SpotifyLinkColumn } from "../../../components/SpotifyLinkColumn";
import { TrackNameColumn } from "../../../components/TrackNameColumn";
import { TrackPreviewColumn } from "../../../components/TrackPreviewColumn";
import { VirtualTable } from "../../../components/VirtualTable";
import { useIgnoreTrackHook } from "../../../hooks/useIgnoreTrackHook";
import { usePlayPauseTrackHook } from "../../../hooks/usePlayPauseTrackHook";
import { getLikedTracks } from "./api";

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
    size: 0.4,
    cell: TrackNameColumn,
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

const likedQuery = async ({ pageParam }) => {
  const tracks = await getLikedTracks(pageParam);

  return tracks;
};

export default function Liked() {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["liked"],
    queryFn: likedQuery,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.tracks) ?? [],
    [data],
  );

  const ids = useMemo(() => flatData.map((t) => t.uri), [flatData]);

  usePlayPauseTrackHook(ids);

  useIgnoreTrackHook();

  return (
    <>
      <VirtualTable
        data={flatData}
        columns={columns}
        isLoading={isFetching}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
}
