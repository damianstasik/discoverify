import { useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { VirtualTable } from '../components/VirtualTable';
import { createColumnHelper } from '@tanstack/react-table';
import { RouterOutput, trpc } from '../trpc';
import { SpotifyLinkColumn } from '../components/SpotifyLinkColumn';
import { RadioGroup } from '@headlessui/react';
import { mdiCheck } from '@mdi/js';
import { Icon } from '../components/Icon';
import { ArtistNameColumn } from '../components/ArtistNameColumn';

type ArtistType = RouterOutput['artist']['top']['artists'][number];

const columnHelper = createColumnHelper<ArtistType>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    size: 300,
    cell: ArtistNameColumn,
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

export function TopArtists() {
  const [timeRange, setTimeRange] = useState('short_term');

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['top-artists', timeRange],
    async function topTracksQuery({ pageParam = 1 }) {
      return trpc.artist.top.query({
        timeRange,
        page: pageParam,
      });
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  );

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
