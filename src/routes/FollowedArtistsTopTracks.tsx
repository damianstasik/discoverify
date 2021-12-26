import { useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import {
  DataGridPro,
  GridActionsCellItem,
  GridColumns,
  useGridApiContext,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useAtomValue } from 'jotai/utils';
import { useAtom } from 'jotai';
import { Breadcrumbs, Link } from '@mui/material';
import { useMutation, useQuery } from 'react-query';
import {
  mdiCardsHeartOutline,
  mdiPlayCircleOutline,
  mdiPauseCircleOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import { loadingTrackPreview, tokenIdState, trackPreviewState } from '../store';
import { Layout } from '../components/Layout';

const columns: GridColumns = [
  {
    type: 'actions',
    field: 'actionss',
    headerName: '',
    width: 50,
    sortable: false,
    getActions: (params) => {
      const apiRef = useGridApiContext();
      const trackPreview = useAtomValue(trackPreviewState);
      const isLoadingTrackPreview = useAtomValue(loadingTrackPreview);
      const isCurrentlyPlaying =
        trackPreview?.url === params.row.preview_url &&
        trackPreview?.context === params.row;

      return [
        <GridActionsCellItem
          color={isCurrentlyPlaying ? 'primary' : 'default'}
          icon={
            <Icon
              path={
                isCurrentlyPlaying && trackPreview?.state === 'playing'
                  ? mdiPauseCircleOutline
                  : mdiPlayCircleOutline
              }
              size={1}
            />
          }
          onClick={() =>
            apiRef.current.publishEvent('playTrackPreview', {
              url: params.row.preview_url,
              track: params.row,
            })
          }
          disabled={isLoadingTrackPreview}
          label="Play"
        />,
      ];
    },
  },
  {
    field: 'name',
    sortable: false,
    headerName: 'Track name',
    flex: 0.3,
  },
  {
    field: 'artists',
    headerName: 'Artist(s)',
    flex: 0.7,
    sortable: false,
    renderCell: (params) => (
      <Breadcrumbs>
        {(params.value as any[]).map((artist) => (
          <Link component={RouterLink} to={`/artist/${artist.id}`}>
            {artist.name}
          </Link>
        ))}
      </Breadcrumbs>
    ),
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    getActions: (params) => {
      const apiRef = useGridApiContext();

      return [
        <GridActionsCellItem
          icon={<Icon path={mdiCardsHeartOutline} size={1} />}
          onClick={() => apiRef.current.publishEvent('saveTrack', params.row)}
          label="Save"
        />,
      ];
    },
  },
];

export function FollowedArtistsTopTracks() {
  const tokenId = useAtomValue(tokenIdState);
  const [trackPreview, setTrackPreview] = useAtom(trackPreviewState);

  const [searchParams] = useSearchParams();
  const apiRef = useGridApiRef();
  const genre = searchParams.get('genre');

  const { mutateAsync: saveTrack } = useMutation<void, Error, string>(
    async (id) => {
      await fetch(
        `${import.meta.env.VITE_API_URL}/save?tokenId=${tokenId}&trackId=${id}`,
        {
          method: 'put',
        },
      );
    },
  );

  const { data: tracks, isLoading } = useQuery(
    ['top-tracks', genre],
    async () => {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/followed-artists/top-tracks?tokenId=${tokenId}&genre=${searchParams.get(
          'genre',
        )}`,
      );

      const body = await res.json();

      return body;
    },
  );

  useEffect(() => {
    if (!apiRef.current || isLoading) return;

    apiRef.current.subscribeEvent('playTrackPreview', (params) => {
      setTrackPreview({
        url: params.url,
        context: params.track,
        state: 'playing',
      });
    });

    apiRef.current.subscribeEvent('saveTrack', (params) => {
      saveTrack(params.id);
    });
  }, [apiRef, isLoading]);

  return (
    <Layout>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Top songs from followed artists
      </Typography>

      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        Here are tracks that come from top 10 lists of the artists that you
        follow. The list does not include tracks that you have already saved in
        your library.
      </Typography>

      <div style={{ height: 800, width: '100%' }}>
        <DataGridPro
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
          rows={tracks}
          columns={columns}
          loading={isLoading}
          initialState={{
            pinnedColumns: {
              right: ['actions'],
            },
          }}
        />
      </div>
    </Layout>
  );
}
