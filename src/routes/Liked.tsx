import {
  type QueryFunction,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Icon from '@mdi/react';
import { mdiCardsHeartOutline, mdiSpotify } from '@mdi/js';
import IconButton from '@mui/material/IconButton';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dislikedTrackIdsAtom, tokenState } from '../store';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { AlbumColumn } from '../components/AlbumColumn';
import { TrackSelectionToolbar } from '../components/TrackSelectionToolbar';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { PageTitle } from '../components/PageTitle';
import { ActionsColumn } from '../components/TrackTable/ActionsColumn';
import produce from 'immer';
import { ignoreTrack } from '../api';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Checkbox } from '@mui/material';
import { useEventBus } from '../components/EventBus';
import { usePlayPauseTrackHook } from '../hooks/usePlayPauseTrackHook';
import { useInfiniteLoading } from '../hooks/useInfiniteLoading';
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

const likedQuery: QueryFunction<RouterOutput['track']['saved']> = async ({
  pageParam = 1,
  signal,
}) => {
  const tracks = await trpc.track.saved.query({ page: pageParam }, { signal });

  return tracks;
};

export function Liked() {
  const token = useRecoilValue(tokenState);
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['liked', token],
    likedQuery,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      onSuccess(data) {
        const page = data.pageParams[data.pageParams.length - 1];

        // if (page) {
        //   setSearchParams((prev) => {
        //     prev.set('page', page);
        //     return prev;
        //   });
        // }
      },
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
