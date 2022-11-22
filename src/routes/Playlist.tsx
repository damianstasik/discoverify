import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { formatRelative } from 'date-fns';
import { tokenState } from '../store';
import { TrackSelectionToolbar } from '../components/TrackSelectionToolbar';
import { AlbumColumn } from '../components/AlbumColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { PageTitle } from '../components/PageTitle';
import { ActionsColumn } from '../components/TrackTable/ActionsColumn';
import { Skeleton } from '@mui/material';
import { VirtualTable } from '../components/VirtualTable';

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

const columns = [
  {
    id: 'preview_url',
    header: '',
    cell: (params) => <TrackPreviewColumn track={params.row.original.track} />,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (params) => (
      <TrackNameColumn id={params.row.original.id} name={params.row.original.track.name} />
    ),
  },
  {
    accessorKey: 'artist',
    header: 'Artist(s)',
    cell: (params) => <ArtistColumn artists={params.row.original.track.artists} />,
  },
  {
    accessorKey: 'album',
    header: 'Album',
    cell: (params) => (
      <AlbumColumn
        id={params.row.original.track.album.id}
        name={params.row.original.track.album.name}
      />
    ),
  },
  {
    accessorKey: 'added_at',
    header: 'Added at',
    cell: (params: any) => {
      return formatRelative(new Date(params.getValue()), new Date());
    },
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
  const params = useParams<{ id: string }>();

  const { data, isFetching } = useQuery(
    ['playlist', params.id, token],
    async function playlistQuery() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/playlist/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const body = await res.json();

      return body;
    },
  );

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
