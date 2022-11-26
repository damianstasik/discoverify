import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { AlbumColumn } from '../components/AlbumColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { PageTitle } from '../components/PageTitle';
import { ActionsColumn } from '../components/TrackTable/ActionsColumn';
import { ColumnDef } from '@tanstack/react-table';
import { usePlayPauseTrackHook } from '../hooks/usePlayPauseTrackHook';
import { useIgnoreTrackHook } from '../hooks/useIgnoreTrackHook';
import { useSaveTrackHook } from '../hooks/useSaveTrackHook';
import { VirtualTable } from '../components/VirtualTable';
import { CheckboxColumn } from '../components/CheckboxColumn';
import { AddedAtColumn } from '../components/AddedAtColumn';
import { RouterOutput, trpc } from '../trpc';
import { DurationColumn } from '../components/DurationColumn';

type TrackType = RouterOutput['track']['saved']['tracks'][number];

type Column<Key extends keyof TrackType> = ColumnDef<TrackType, TrackType[Key]>;

const columns = [
  {
    size: 50,
    id: 'select',
    header: ({ table }) => <CheckboxColumn table={table} />,
    cell: ({ row }) => <CheckboxColumn row={row} isRow />,
  } as ColumnDef<TrackType, void>,
  {
    header: '',
    accessorKey: 'uri',
    size: 50,
    cell: TrackPreviewColumn,
  } as Column<'name'>,
  {
    accessorKey: 'name',
    header: 'Name',
    size: 300,
    cell: TrackNameColumn,
  } as Column<'name'>,
  {
    accessorKey: 'artists',
    header: 'Artist(s)',
    cell: ArtistColumn,
  } as Column<'artists'>,
  {
    accessorKey: 'album',
    header: 'Album',
    cell: AlbumColumn,
  } as Column<'album'>,
  {
    accessorKey: 'added_at',
    header: 'Added at',
    cell: AddedAtColumn,
  } as Column<'added_at'>,
  {
    accessorKey: 'duration_ms',
    header: 'Duration',
    cell: DurationColumn,
  } as Column<'duration_ms'>,
  {
    id: 'actions',
    header: 'Actions',
    cell: (params) => <ActionsColumn track={params.row.original} />,
  } as ColumnDef<TrackType, void>,
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

  useSaveTrackHook();

  return (
    <>
      <PageTitle>Liked tracks</PageTitle>
      <div style={{ height: 800 }}>
        <VirtualTable
          data={flatData}
          columns={columns}
          isLoading={isFetching}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </>
  );
}
