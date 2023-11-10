"use client";

import { getRecommendedTracks } from "../../../api";
import { TrackNameColumn } from "../../../components/TrackNameColumn";
import { TrackPreviewColumn } from "../../../components/TrackPreviewColumn";
import { usePlayPauseTrackHook } from "../../../hooks/usePlayPauseTrackHook";

import { createColumnHelper } from "@tanstack/react-table";
import { AlbumColumn } from "../../../components/AlbumColumn";
import { ArtistsColumn } from "../../../components/ArtistsColumn";
import { CheckboxColumn } from "../../../components/CheckboxColumn";
import { DurationColumn } from "../../../components/DurationColumn";
import { SaveColumn } from "../../../components/SaveColumn";
import { SpotifyLinkColumn } from "../../../components/SpotifyLinkColumn";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { VirtualTable } from "../../../components/VirtualTable";

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
  columnHelper.accessor("duration", {
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

export function Table({ trackIds, artistsIds, attributeValues }) {
  const { data, isLoading } = useQuery({
    queryKey: ["recommended", trackIds, artistsIds, attributeValues],
    queryFn: () => getRecommendedTracks(trackIds, artistsIds, attributeValues),
    refetchOnWindowFocus: false,
  });
  const ids = useMemo(() => (data || []).map((t) => t.uri), [data]);

  return (
    <VirtualTable
      data={data || []}
      columns={columns}
      isLoading={isLoading}
      hasNextPage={false}
      fetchNextPage={null}
      isInitialLoading={true}
      meta={ids}
    />
  );
}
