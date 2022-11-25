import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { tokenState } from '../store';
import { AlbumColumn } from '../components/AlbumColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { PageTitle } from '../components/PageTitle';
import { ActionsColumn } from '../components/TrackTable/ActionsColumn';
import { Checkbox, Skeleton } from '@mui/material';
import { VirtualTable } from '../components/VirtualTable';
import { CheckboxColumn } from '../components/CheckboxColumn';
import { usePlayPauseTrackHook } from '../hooks/usePlayPauseTrackHook';
import { useIgnoreTrackHook } from '../hooks/useIgnoreTrackHook';
import { useSaveTrackHook } from '../hooks/useSaveTrackHook';
import { getPlaylist } from '../api';
import { ColumnDef } from '@tanstack/react-table';
import { AddedAtColumn } from '../components/AddedAtColumn';

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

const columns: ColumnDef<any>[] = [
  {
    size: 50,
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        onChange={table.getToggleAllRowsSelectedHandler()}
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: 'uri',
    header: '',
    size: 50,
    cell: TrackPreviewColumn,
  },
  {
    accessorFn: (row) => row.track.name,
    header: 'Name',
    cell: TrackNameColumn,
  },
  {
    accessorFn: (row) => row.track.artists,
    header: 'Artist(s)',
    cell: ArtistColumn,
  },
  {
    accessorFn: (row) => row.track.album,
    header: 'Album',
    cell: AlbumColumn,
  },
  {
    accessorKey: 'added_at',
    header: 'Added at',
    cell: AddedAtColumn,
  },
  // {
  //   accessorKey: 'duration',
  //   header: 'Duration',
  //   cell: (params: any) => {
  //     return msToTime(params.getValue());
  //   },
  // },
  {
    id: 'actions',
    header: 'Actions',
    cell: (params) => <ActionsColumn track={params.row.original.track} />,
  },
];

export function Playlist() {
  const token = useRecoilValue(tokenState);
  const params = useParams<'id'>();

  const { data, isFetching } = useQuery(
    ['playlist', token, params.id!],
    getPlaylist,
  );

  const ids = useMemo(
    () => (data?.tracks?.items || []).map((t) => t.track.uri),
    [data],
  );

  usePlayPauseTrackHook(ids);

  useIgnoreTrackHook();

  useSaveTrackHook();

  return (
    <>
      <PageTitle>
        Playlist:{' '}
        {data ? (
          data.name
        ) : (
          <Skeleton variant="rounded" width={210} sx={{ ml: 1 }} />
        )}
      </PageTitle>

      <div style={{ height: 800 }}>
        <VirtualTable
          columns={columns}
          data={data?.tracks?.items || []}
          isLoading={isFetching}
        />
      </div>
    </>
  );
}
