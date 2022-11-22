import { formatRelative } from 'date-fns';
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

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

const columns: ColumnDef<{
  preview_url: string;
  name: string;
  artists: any[];
  album: any;
  added_at: string;
  duration_ms: number;
}>[] = [
  {
    size: 50,
    id: 'select',
    header: ({ table }) => <CheckboxColumn table={table} />,
    cell: ({ row }) => <CheckboxColumn row={row} isRow />,
  },
  {
    id: 'play',
    header: '',
    size: 50,
    cell: (params) => <TrackPreviewColumn track={params.row.original} />,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    size: 300,
    cell: (params) => (
      <TrackNameColumn id={params.row.original.id} name={params.getValue()} />
    ),
  },
  {
    accessorKey: 'artists',
    header: 'Artist(s)',
    cell: (params) => <ArtistColumn artists={params.getValue()} />,
  },
  {
    accessorKey: 'album',
    header: 'Album',
    cell: (params) => (
      <AlbumColumn id={params.getValue().id} name={params.getValue().name} />
    ),
  },
  {
    accessorKey: 'added_at',
    header: 'Added at',
    cell: (params) => {
      return formatRelative(new Date(params.getValue()), new Date());
    },
  },
  {
    accessorKey: 'duration_ms',
    header: 'Duration',
    cell: (params) => {
      return msToTime(params.getValue());
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: (params) => <ActionsColumn track={params.row.original} />,
  },
];

type LikedRes = { tracks: Track[]; nextPage: number | null };
type LikedQueryKey = [key: string, token: string];

const likedQuery: QueryFunction<LikedRes, LikedQueryKey> = async ({
  queryKey,
  pageParam = 1,
  signal,
}) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/user/liked?page=${pageParam}`,
    {
      signal,
      headers: {
        Authorization: `Bearer ${queryKey[1]}`,
      },
    },
  );

  const body = await res.json();

  return body;
};

interface Track {
  id: string;
  isIgnored: boolean;
}

export function Liked() {
  const token = useRecoilValue(tokenState);
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<
    LikedRes,
    Error,
    Track,
    LikedQueryKey
  >(['liked', token], likedQuery, {
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
  });

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
