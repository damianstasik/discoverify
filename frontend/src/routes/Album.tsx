import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ArtistsColumn } from "../components/ArtistsColumn";
import { BgImg } from "../components/BgImg";
import { CheckboxColumn } from "../components/CheckboxColumn";
import { DurationColumn } from "../components/DurationColumn";
import { SaveColumn } from "../components/SaveColumn";
import { SpotifyLinkColumn } from "../components/SpotifyLinkColumn";
import { TrackNameColumn } from "../components/TrackNameColumn";
import { TrackPreviewColumn } from "../components/TrackPreviewColumn";
import { VirtualTable } from "../components/VirtualTable";
import { usePlayPauseTrackHook } from "../hooks/usePlayPauseTrackHook";
import { RouterOutput, trpc } from "../trpc";

type TrackType = RouterOutput["track"]["byAlbumId"]["tracks"][number];

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
    size: 0.5,
    cell: TrackNameColumn,
  }),
  columnHelper.accessor("artists", {
    header: "Artist(s)",
    cell: ArtistsColumn,
    minSize: 200,
    size: 0.4,
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

export function Album() {
  const { id } = useParams<{ albumId: string }>();

  const { data } = useQuery({
    queryKey: ["album", id],
    queryFn: ({ signal }) => trpc.album.byId.query(id, { signal }),
  });

  const {
    data: tracks,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["tracks", id],
    queryFn: ({ signal, pageParam }) =>
      trpc.track.byAlbumId.query(
        {
          albumId: id,
          page: pageParam,
        },
        { signal },
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const flatData = useMemo(
    () => tracks?.pages?.flatMap((page) => page.tracks) ?? [],
    [data],
  );

  const ids = useMemo(() => flatData.map((t) => t.uri), [flatData]);

  usePlayPauseTrackHook(ids);

  return (
    <>
      <BgImg src={data?.images?.[0].url} key={id} alt="Album cover picture" />
      <div className="relative">
        <div className="border-b border-white/5 backdrop-blur-lg">
          <h2 className="p-3 text-xl/none text-white font-bold">
            {data?.name || (
              <div className="animate-pulse h-em w-48 bg-slate-600 rounded-md" />
            )}
          </h2>
        </div>
      </div>
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
