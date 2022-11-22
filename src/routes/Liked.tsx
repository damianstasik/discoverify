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
import { Table } from '../components/Table';
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

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

const CheckboxColumn = memo(({ isRow, table, row }) => {
  if (isRow) {
    return (
      <Checkbox
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    );
  }
  return (
    <Checkbox
      checked={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  );
});

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

const TableHeader = memo(({ table }) => {
  return (
    <div>
      {table.getHeaderGroups().map((headerGroup) => (
        <div key={headerGroup.id} style={{ display: 'flex' }}>
          {headerGroup.headers.map((header) => {
            return (
              <div key={header.id} style={{ width: header.getSize() }}>
                {header.isPlaceholder ? null : (
                  <div>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
});

const TableCell = memo(({ cell }) => {
  return (
    <div
      style={{
        width: cell.column.getSize(),
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  );
});

const TableVirtualRow = memo(({ row, virtualItem }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${virtualItem.size}px`,
        transform: `translateY(${virtualItem.start}px)`,
        display: 'flex',
        background: row.original.isIgnored ? 'red' : '',
      }}
    >
      {row.getVisibleCells().map((cell) => {
        return <TableCell key={cell.id} cell={cell} />;
      })}
    </div>
  );
});

const VirtualTable = memo(({ data, isLoading, hasNextPage, fetchNextPage }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const contRef = useRef<HTMLDivElement>(null);

  const handleInfiniteLoadingScroll = useInfiniteLoading({
    ref: contRef,
    fetchNextPage,
    isFetching: isLoading,
    hasNextPage,
  });

  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => contRef.current,
    count: data.length,
    estimateSize: () => 35,
  });
  const rows = table.getSelectedRowModel().flatRows;
  return (
    <div>
      <TrackSelectionToolbar rows={rows} />
      <TableHeader table={table} />
      <div
        className="container"
        ref={contRef}
        style={{
          height: `800px`,
          overflow: 'auto',
        }}
        onScroll={handleInfiniteLoadingScroll}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const row = table.getRowModel().rows[virtualItem.index];
            return (
              <TableVirtualRow
                row={row}
                key={row.id}
                virtualItem={virtualItem}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

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
