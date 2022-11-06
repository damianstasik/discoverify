import Button from '@mui/material/Button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { IconButton, Typography } from '@mui/material';
import { memo, useState } from 'react';
import {
  GridActionsCellItem,
  GridColumns,
  GridRowId,
  useGridApiContext,
} from '@mui/x-data-grid-premium';
import { formatRelative } from 'date-fns';
import Icon from '@mdi/react';
import { mdiCardsHeartOutline, mdiSpotify } from '@mdi/js';
import { tokenState } from '../store';
import { TrackSelectionToolbar } from '../components/TrackSelectionToolbar';
import { AlbumColumn } from '../components/AlbumColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { Table } from '../components/Table';
import { PageTitle } from '../components/PageTitle';
import { ActionsColumn } from '../components/TrackTable/ActionsColumn';

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

const columns: GridColumns = [
  {
    field: 'preview_url',
    headerName: '',
    width: 60,
    sortable: false,
    renderCell: (params) => <TrackPreviewColumn track={params.row.track} />,
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 0.2,
    sortable: false,
    renderCell: (params) => (
      <TrackNameColumn id={params.row.id} name={params.row.track.name} />
    ),
  },
  {
    field: 'artist',
    headerName: 'Artist(s)',
    flex: 0.2,
    renderCell: (params) => <ArtistColumn artists={params.row.track.artists} />,
  },
  {
    field: 'album',
    headerName: 'Album',
    flex: 0.2,
    sortable: false,
    renderCell: (params) => (
      <AlbumColumn
        id={params.row.track.album.id}
        name={params.row.track.album.name}
      />
    ),
  },
  {
    field: 'added_at',
    headerName: 'Added at',
    flex: 0.1,
    sortable: false,
    valueFormatter: (params: any) => {
      return formatRelative(new Date(params.value), new Date());
    },
  },
  // {
  //   field: 'duration',
  //   headerName: 'Duration',
  //   flex: 0.1,
  //   sortable: false,
  //   valueFormatter: (params: any) => {
  //     return msToTime(params.value);
  //   },
  // },
  {
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    flex: 0.15,
    renderCell: (params) => <ActionsColumn track={params.row.track} />,
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
    { suspense: true },
  );

  const [selectedTracks, setSelectedTracks] = useState<Array<GridRowId>>([]);

  return (
    <>
      <PageTitle>Playlist: {data.name}</PageTitle>

      <div style={{ height: 800 }}>
        <Table
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(value) => setSelectedTracks(value)}
          selectionModel={selectedTracks}
          rows={data.tracks.items}
          loading={isFetching}
          // onRowsScrollEnd={() => hasNextPage && fetchNextPage()}
          components={{
            Toolbar: TrackSelectionToolbar,
          }}
          getRowId={(row) => row.track.id + row.added_at}
        />
      </div>
    </>
  );
}
