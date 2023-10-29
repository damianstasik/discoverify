"use client";

import { RadioGroup } from "@headlessui/react";
import mdiCheck from "@slimr/mdi-paths/Check";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { AlbumColumn } from "../../../components/AlbumColumn";
import { ArtistsColumn } from "../../../components/ArtistsColumn";
import { CheckboxColumn } from "../../../components/CheckboxColumn";
import { DurationColumn } from "../../../components/DurationColumn";
import { Icon } from "../../../components/Icon";
import { SaveColumn } from "../../../components/SaveColumn";
import { SpotifyLinkColumn } from "../../../components/SpotifyLinkColumn";
import { TrackNameColumn } from "../../../components/TrackNameColumn";
import { TrackPreviewColumn } from "../../../components/TrackPreviewColumn";
import { VirtualTable } from "../../../components/VirtualTable";
import { usePlayPauseTrackHook } from "../../../hooks/usePlayPauseTrackHook";
import { getTopTracks } from "./api";

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

function TimeRangeOption({
  value,
  label,
  title,
}: { value: string; label: string; title?: string }) {
  return (
    <RadioGroup.Option
      title={title}
      value={value}
      className="ui-active:bg-white/5 ui-active:text-white ui-checked:border-green-500 border rounded-md border-slate-500 px-2 py-2 leading-none flex cursor-pointer"
    >
      <Icon
        path={mdiCheck}
        className="hidden ui-checked:block ui-checked:text-green-500 s-4 mr-2"
      />
      {label}
    </RadioGroup.Option>
  );
}

export default function TopTracks() {
  const [timeRange, setTimeRange] = useState("short_term");

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["top-tracks", timeRange],
    queryFn: async function topTracksQuery({ pageParam }) {
      return getTopTracks(pageParam, timeRange);
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.tracks) ?? [],
    [data],
  );

  const ids = useMemo(() => flatData.map((t) => t.uri), [flatData]);

  usePlayPauseTrackHook(ids);

  return (
    <>
      <RadioGroup
        value={timeRange}
        onChange={setTimeRange}
        className="flex items-center gap-3 border-b border-white/5 p-3"
      >
        <RadioGroup.Label className="font-semibold">
          Time range:
        </RadioGroup.Label>
        <TimeRangeOption value="short_term" label="Last 4 weeks" />
        <TimeRangeOption value="medium_term" label="Last 6 months" />
        <TimeRangeOption
          value="long_term"
          label="Last few years"
          title="Calculated from several years of data and including all new data as it becomes available"
        />
      </RadioGroup>

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
