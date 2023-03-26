import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistsColumn } from '../components/ArtistsColumn';
import { AlbumColumn } from '../components/AlbumColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { createColumnHelper } from '@tanstack/react-table';
import { usePlayPauseTrackHook } from '../hooks/usePlayPauseTrackHook';
import { useIgnoreTrackHook } from '../hooks/useIgnoreTrackHook';
import { VirtualTable } from '../components/VirtualTable';
import { CheckboxColumn } from '../components/CheckboxColumn';
import { AddedAtColumn } from '../components/AddedAtColumn';
import { RouterOutput, trpc } from '../trpc';
import { DurationColumn } from '../components/DurationColumn';
import { SaveColumn } from '../components/SaveColumn';
import { SpotifyLinkColumn } from '../components/SpotifyLinkColumn';

type TrackType = RouterOutput['track']['saved']['tracks'][number];

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
    minSize: 200,
    size: 0.4,
    cell: TrackNameColumn,
  }),
  columnHelper.accessor('artists', {
    header: 'Artist(s)',
    cell: ArtistsColumn,
    minSize: 200,
    size: 0.3,
  }),
  columnHelper.accessor('album', {
    header: 'Album',
    cell: AlbumColumn,
    minSize: 200,
    size: 0.3,
  }),
  columnHelper.accessor('added_at', {
    header: 'Added At',
    cell: AddedAtColumn,
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
    size: 50,
    cell: SpotifyLinkColumn,
  }),
];

const likedQuery: Query<'track.saved'> = async ({ pageParam = 1, signal }) => {
  const tracks = await trpc.track.saved.query({ page: pageParam }, { signal });

  return tracks;
};

export function Liked() {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['liked'],
    likedQuery,
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

  useIgnoreTrackHook();

  return (
    <>
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
