import { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { formatRelative } from 'date-fns';
import {
  GridCellParams,
  DataGridPro,
  GridColumns,
  GridRowParams,
} from '@mui/x-data-grid-pro';
import { useInfiniteQuery } from 'react-query';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import Link from '@mui/material/Link';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { Layout } from '../components/Layout';
import { tokenIdState, trackPreviewUrlSelector } from '../store';

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

function PreviewColumn(params: GridCellParams) {
  const [trackPreviewUrl, setTrackPreviewUrl] = useAtom(
    trackPreviewUrlSelector,
  );

  return (
    <IconButton
      edge="end"
      aria-label="delete"
      onClick={() => setTrackPreviewUrl(params.value as string)}
    >
      {params.value === trackPreviewUrl ? (
        <StopCircleOutlinedIcon />
      ) : (
        <PlayCircleOutlineOutlinedIcon />
      )}
    </IconButton>
  );
}

function ArtistColumn(params: GridCellParams) {
  return (
    <Breadcrumbs>
      {(params.value as any[]).map((artist) => (
        <Link component={RouterLink} to={`/artist/${artist.id}`}>
          {artist.name}
        </Link>
      ))}
    </Breadcrumbs>
  );
}

function AlbumColumn(params: GridCellParams) {
  return (
    <Link component={RouterLink} to={`/album/${params.value.id}`}>
      {params.value.name}
    </Link>
  );
}

const columns: GridColumns = [
  {
    field: 'preview_url',
    headerName: 'Preview',
    flex: 0.1,
    renderCell: PreviewColumn,
  },
  { field: 'title', headerName: 'Title', flex: 0.2, sortable: false },
  {
    field: 'artist',
    headerName: 'Artist',
    flex: 0.2,
    renderCell: ArtistColumn,
  },
  {
    field: 'album',
    headerName: 'Album',
    flex: 0.2,
    renderCell: AlbumColumn,
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
  {
    field: 'duration',
    headerName: 'Duration',
    flex: 0.1,
    sortable: false,
    valueFormatter: (params: any) => {
      return msToTime(params.value);
    },
  },
];

export function Liked() {
  const tokenId = useAtomValue(tokenIdState);

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    'liked',
    async ({ pageParam = 1 }) => {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/liked?tokenId=${tokenId}&page=${pageParam}`,
      );

      const body = await res.json();

      return body;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  );

  const [selectedSongs, setSelectedSongs] = useState([]);

  const isRowSelectable = useCallback(
    (params: GridRowParams) =>
      selectedSongs.includes(params.id) ? true : selectedSongs.length < 5,
    [selectedSongs],
  );

  return (
    <Layout>
      <Typography variant="h5" gutterBottom>
        Liked tracks
      </Typography>

      {selectedSongs.length > 0 && (
        <Button
          component={RouterLink}
          to={{
            pathname: '/recommendations',
            search: `?${selectedSongs
              .map((selectedSong) => `trackId=${selectedSong}`)
              .join('&')}`,
          }}
        >
          Generate recommendation
        </Button>
      )}

      <div style={{ height: 800 }}>
        <DataGridPro
          columns={columns}
          disableColumnResize
          disableColumnMenu
          disableColumnReorder
          disableColumnSelector
          disableDensitySelector
          disableMultipleColumnsSorting
          disableSelectionOnClick
          disableColumnFilter
          disableMultipleColumnsFiltering
          hideFooter
          checkboxSelection
          onSelectionModelChange={(newSelection) =>
            setSelectedSongs(newSelection)
          }
          selectionModel={selectedSongs}
          isRowSelectable={isRowSelectable}
          rows={(data?.pages || []).map((page) => page.songs).flat()}
          loading={isFetching}
          onRowsScrollEnd={() => hasNextPage && fetchNextPage()}
        />
      </div>
    </Layout>
  );
}
