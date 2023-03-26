import { useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistsColumn } from '../components/ArtistsColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { VirtualTable } from '../components/VirtualTable';
import { createColumnHelper } from '@tanstack/react-table';
import { RouterOutput, trpc } from '../trpc';
import { usePlayPauseTrackHook } from '../hooks/usePlayPauseTrackHook';
import { CheckboxColumn } from '../components/CheckboxColumn';
import { AlbumColumn } from '../components/AlbumColumn';
import { DurationColumn } from '../components/DurationColumn';
import { SaveColumn } from '../components/SaveColumn';
import { SpotifyLinkColumn } from '../components/SpotifyLinkColumn';
import { RadioGroup } from '@headlessui/react';
import { mdiCheck } from '@mdi/js';
import { Icon } from '../components/Icon';

type TrackType = RouterOutput['track']['top']['tracks'][number];

const columnHelper = createColumnHelper<TrackType>();

const columns = [
  columnHelper.display({
    size: 40,
    id: 'select',
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
  columnHelper.accessor('uri', {
    header: '',
    id: 'preview',
    size: 50,
    cell: TrackPreviewColumn,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    size: 300,
    cell: TrackNameColumn,
  }),
  columnHelper.accessor('artists', {
    header: 'Artist(s)',
    cell: ArtistsColumn,
    size: 200,
  }),
  columnHelper.accessor('album', {
    header: 'Album',
    cell: AlbumColumn,
    size: 200,
  }),
  columnHelper.accessor('duration_ms', {
    header: 'Duration',
    cell: DurationColumn,
    size: 80,
  }),
  columnHelper.accessor('isLiked', {
    header: '',
    size: 40,
    cell: SaveColumn,
  }),
  columnHelper.accessor('uri', {
    id: 'open',
    header: '',
    size: 40,
    cell: SpotifyLinkColumn,
  }),
];

function TimeRangeOption({ value, label }: { value: string; label: string }) {
  return (
    <RadioGroup.Option
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

export function TopTracks() {
  const [timeRange, setTimeRange] = useState('short_term');

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['top-tracks', timeRange],
    async function topTracksQuery({ pageParam = 1 }) {
      return trpc.track.top.query({
        timeRange,
        page: pageParam,
      });
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  );

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
        <TimeRangeOption value="short_term" label="Short term" />
        <TimeRangeOption value="medium_term" label="Medium term" />
        <TimeRangeOption value="long_term" label="Long term" />
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
