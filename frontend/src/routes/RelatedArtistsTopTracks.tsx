import { useInfiniteQuery } from "@tanstack/react-query";
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

type TrackType =
  RouterOutput["artist"]["relatedArtistsTopTracks"]["data"][number];

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

export function RelatedArtistsTopTracks() {
  const { id } = useParams<{ id: string }>();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ["related-artists-top-tracks", id],
    async function relatedArtistsTopTracksQuery({
      pageParam = 0,
      queryKey,
      signal,
    }) {
      const tracks = await trpc.artist.relatedArtistsTopTracks.query(
        {
          id: queryKey[1],
          page: pageParam,
        },
        { signal },
      );
      return tracks;
    },
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasNextPage ? pages.length : false,
    },
  );

  const rows = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data],
  );

  const ids = useMemo(() => rows.map((t) => t.uri), [rows]);

  usePlayPauseTrackHook(ids);

  return (
    <>
      <div className="p-3 bg-black/40 border-b border-white/5 backdrop-blur-lg">
        <h5 className=" font-semibold text-white mb-1">
          Top tracks from artists similar to a given artist
        </h5>
        <p className="text-gray-400 text-sm">
          Here are tracks that come from top 10 lists of the artists that are
          similar to a given artist. The list does not include tracks that you
          have already saved in your library. Similarity is based on analysis of
          the Spotify community's listening history.
        </p>
      </div>

      <VirtualTable
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        data={rows}
        columns={columns}
        isLoading={isFetching}
      />
    </>
  );
}
