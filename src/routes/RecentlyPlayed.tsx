import { memo, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import {
  DataGridPro,
  GridActionsCellItem,
  type GridColumns,
  useGridApiContext,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useAtomValue } from 'jotai/utils';
import { IconButton } from '@mui/material';
import { useInfiniteQuery, useMutation } from 'react-query';
import { mdiCardsHeartOutline, mdiSpotify } from '@mdi/js';
import Icon from '@mdi/react';
import { formatRelative } from 'date-fns';
import { tokenIdState } from '../store';
import { Layout } from '../components/Layout';
import * as trackApi from '../api/track';
import * as artistApi from '../api/artist';
import { useSeedSelection } from '../hooks/useSeedSelection';
import { TrackSelectionToolbar } from '../components/TrackSelectionToolbar';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistColumn } from '../components/ArtistColumn';

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
    type: 'actions',
    field: 'preview_url',
    headerName: '',
    width: 50,
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
    sortable: false,
    headerName: 'Name',
    flex: 0.3,
    valueGetter: (params) => params.row.track.name,
  },
  {
    field: 'artists',
    headerName: 'Artist(s)',
    flex: 0.6,
    sortable: false,
    renderCell: (params) => <ArtistColumn artists={params.row.track.artists} />,
  },
  {
    field: 'played_at',
    headerName: 'Played at',
    flex: 0.2,
    sortable: false,
    valueFormatter: (params: any) => {
      return formatRelative(new Date(params.value), new Date());
    },
  },
  {
    type: 'actions',
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

export function RecentlyPlayed() {
  const tokenId = useAtomValue(tokenIdState);
  const [searchParams] = useSearchParams();
  const apiRef = useGridApiRef();
  const genre = searchParams.get('genre');

  const { mutateAsync: saveTrack } = useMutation<void, Error, string>(
    async (id) => trackApi.saveTrack(tokenId, id),
  );

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['recently-played'],
    async ({ pageParam }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/recentlyPlayed?tokenId=${tokenId}${
          pageParam ? `&after=${pageParam}` : ''
        }`,
      );

      const body = await res.json();

      return body;
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage && lastPage.cursors.after,
    },
  );

  useEffect(() => {
    if (!apiRef.current || isFetching) return;

    apiRef.current.subscribeEvent('saveTrack', (params) => {
      saveTrack(params.id);
    });
  }, [apiRef, isFetching]);

  const rows = useMemo(
    () => (data?.pages || []).map((page) => page.tracks).flat(),
    [data],
  );

  const { selectedSeeds, setSelectedSeeds } = useSeedSelection();

  return (
    <Layout>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Recently played tracks
      </Typography>

      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        Here are tracks that you recently played.
      </Typography>

      <div style={{ height: 800, width: '100%' }}>
        <DataGridPro
          pagination
          paginationMode="server"
          hideFooterPagination
          onRowsScrollEnd={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          checkboxSelection
          onSelectionModelChange={(newSelection) =>
            setSelectedSeeds(newSelection)
          }
          selectionModel={selectedSeeds}
          disableSelectionOnClick
          disableColumnResize
          disableColumnMenu
          disableColumnReorder
          disableColumnSelector
          disableDensitySelector
          disableMultipleColumnsSorting
          disableColumnFilter
          disableMultipleColumnsFiltering
          hideFooter
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          loading={isFetching}
          initialState={{
            pinnedColumns: {
              right: ['actions'],
            },
          }}
          components={{
            Toolbar: TrackSelectionToolbar,
          }}
          getRowId={(row) => row.track.id + row.played_at}
        />
      </div>
    </Layout>
  );
}
