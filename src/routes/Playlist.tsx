import Button from '@mui/material/Button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useQuery } from 'react-query';
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

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

const OpenInSpotify = memo(({ row }) => {
  return (
    <IconButton
      size="small"
      aria-label="Open in Spotify"
      href={row.uri}
      target="_blank"
    >
      <Icon path={mdiSpotify} size={1} />
    </IconButton>
  );
});

const Save = memo(({ row }) => {
  const apiRef = useGridApiContext();
  return (
    <GridActionsCellItem
      icon={<Icon path={mdiCardsHeartOutline} size={1} />}
      onClick={() => apiRef.current.publishEvent('saveTrack', row)}
      label="Save"
    />
  );
});

const columns: GridColumns = [
  {
    field: 'preview_url',
    headerName: '',
    width: 60,
    sortable: false,
    renderCell: (params) => (
      <TrackPreviewColumn
        url={params.row.track.preview_url}
        context={params.row.track}
      />
    ),
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
    renderCell: (params) => (
      <>
        <OpenInSpotify row={params.row.track} />
        <Save row={params.row.track} />
      </>
    ),
  },
];

export function Playlist() {
  const token = useRecoilValue(tokenState);
  const params = useParams<{ id: string }>();

  const { data, isFetching } = useQuery(
    ['playlist', params.id],
    async function playlistQuery() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/playlist/${
          params.id
        }?tokenId=${token}`,
      );
      const body = await res.json();

      return body.playlist;
    },
    { suspense: true, keepPreviousData: true },
  );

  const [selectedTracks, setSelectedTracks] = useState<Array<GridRowId>>([]);

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Playlist: {data.name}
      </Typography>

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
