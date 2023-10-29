"use client";
import { AlbumColumn } from "../../../../../components/AlbumColumn";
import { ArtistsColumn } from "../../../../../components/ArtistsColumn";
import { TrackNameColumn } from "../../../../../components/TrackNameColumn";
import { TrackPreviewColumn } from "../../../../../components/TrackPreviewColumn";

import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { CheckboxColumn } from "../../../../../components/CheckboxColumn";
import { DurationColumn } from "../../../../../components/DurationColumn";
import { SaveColumn } from "../../../../../components/SaveColumn";
import { SpotifyLinkColumn } from "../../../../../components/SpotifyLinkColumn";
import { VirtualTable } from "../../../../../components/VirtualTable";
import { usePlayPauseTrackHook } from "../../../../../hooks/usePlayPauseTrackHook";

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

export function Table({ data }) {
  const ids = useMemo(() => (data || []).map((t) => t.uri), [data]);

  usePlayPauseTrackHook(ids);
  return <VirtualTable columns={columns} data={data} />;
}
