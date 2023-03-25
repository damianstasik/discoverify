import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { formatRelative } from 'date-fns';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistsColumn } from '../components/ArtistsColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { VirtualTable } from '../components/VirtualTable';
import { RouterOutput, trpc } from '../trpc';
import { usePlayPauseTrackHook } from '../hooks/usePlayPauseTrackHook';
import { AlbumColumn } from '../components/AlbumColumn';
import { DurationColumn } from '../components/DurationColumn';
import { SaveColumn } from '../components/SaveColumn';
import { SpotifyLinkColumn } from '../components/SpotifyLinkColumn';
import { createColumnHelper } from '@tanstack/react-table';
import { CheckboxColumn } from '../components/CheckboxColumn';

type TrackType = RouterOutput['track']['recentlyPlayed']['tracks'][number];

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
  columnHelper.accessor('playedAt', {
    header: 'Played At',
    cell: (params: any) => {
      return formatRelative(new Date(params.getValue()), new Date());
    },
    size: 180,
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

export function RecentlyPlayed() {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['recently-played'],
    async function recentlyPlayedQuery({ signal }) {
      return trpc.track.recentlyPlayed.query(
        { page: 1 },
        {
          signal,
        },
      );
    },
    {
      getNextPageParam: () => null,
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
      <div style={{ height: 800 }}>
        <VirtualTable
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isLoading={isFetching}
          data={flatData}
          columns={columns}
        />
      </div>
    </>
  );
}
