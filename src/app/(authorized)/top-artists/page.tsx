"use client";

import { RadioGroup } from "@headlessui/react";
import mdiCheck from "@slimr/mdi-paths/Check";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { ArtistNameColumn } from "../../../components/ArtistNameColumn";
import { Icon } from "../../../components/Icon";
import { SpotifyLinkColumn } from "../../../components/SpotifyLinkColumn";
import { VirtualTable } from "../../../components/VirtualTable";
import { getTopArtists } from "./api";

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

export default function TopArtists() {
  const [timeRange, setTimeRange] = useState("short_term");

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
