import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { AlbumColumn } from "../components/AlbumColumn";
import { ArtistsColumn } from "../components/ArtistsColumn";
import { CheckboxColumn } from "../components/CheckboxColumn";
import { DurationColumn } from "../components/DurationColumn";
import { SaveColumn } from "../components/SaveColumn";
import { SpotifyLinkColumn } from "../components/SpotifyLinkColumn";
import { TrackNameColumn } from "../components/TrackNameColumn";
import { TrackPreviewColumn } from "../components/TrackPreviewColumn";
import { VirtualTable } from "../components/VirtualTable";
import { usePlayPauseTrackHook } from "../hooks/usePlayPauseTrackHook";
import { RouterOutput, trpc } from "../trpc";

type TrackType = RouterOutput["artist"]["topTracks"][number];

const columnHelper = createColumnHelper<TrackType>();

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

export function ArtistTopTracks() {
  const params = useParams();

  const { data, isFetching } = useQuery(
    ["artist-top-tracks", params.id],
    async function artistTopTracksQuery({ queryKey, signal }) {
      const tracks = await trpc.artist.topTracks.query(queryKey[1], { signal });

      return tracks;
    },
    { suspense: true },
  );

  const ids = useMemo(() => (data || []).map((t) => t.uri), [data]);

  usePlayPauseTrackHook(ids);

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
