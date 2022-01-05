import { useEffect } from 'react';
import {
  Link as RouterLink,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import {
  DataGridPro,
  GridActionsCellItem,
  type GridColumns,
  useGridApiContext,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useAtomValue } from 'jotai/utils';
import { useAtom } from 'jotai';
import { Breadcrumbs, Button, IconButton, Link } from '@mui/material';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import {
  mdiCardsHeartOutline,
  mdiPlayCircleOutline,
  mdiPauseCircleOutline,
  mdiSpotify,
  mdiCardsHeart,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useSnackbar } from 'notistack';
import produce from 'immer';
import { loadingTrackPreview, tokenIdState, trackPreviewState } from '../store';
import { Layout } from '../components/Layout';
import * as trackApi from '../api/track';
import * as playlistApi from '../api/playlist';
import { useSeedSelection } from '../hooks/useSeedSelection';
import { TrackSelectionToolbar } from '../components/TrackSelectionToolbar';

const columns: GridColumns = [
  {
    field: 'name',
    sortable: false,
    headerName: 'Name',
    flex: 0.3,
  },
  {
    field: 'owner',
    headerName: 'Owner',
    flex: 0.7,
    sortable: false,
    renderCell: (params) => (
      <Link component={RouterLink} to={`/artist/${params.value.id}`}>
        {params.value.display_name}
      </Link>
    ),
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    getActions: (params) => {
      return [
        <IconButton
          size="small"
          aria-label="Open in Spotify"
          href={params.row.uri}
          target="_blank"
        >
          <Icon path={mdiSpotify} size={1} />
        </IconButton>,
      ];
    },
  },
];

export function Playlists() {
  const tokenId = useAtomValue(tokenIdState);
  const [searchParams] = useSearchParams();
  const apiRef = useGridApiRef();
  const { id } = useParams<{ id: string }>();

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['playlists', id],
    async ({ pageParam = 0 }) => playlistApi.getPlaylists(tokenId, pageParam),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasNextPage ? pages.length : false,
    },
  );

  const { mutateAsync: saveTrack } = useMutation<void, Error, string>(
    async (trackId) => trackApi.saveTrack(tokenId, trackId),
    {
      onSuccess(trackId) {
        console.log('success');
        queryClient.setQueryData(['related-artists-top-tracks', id], (old) => {
          console.log('cos');
          return old;
        });
      },
    },
  );

  useEffect(() => {
    if (!apiRef.current || isFetching) return;

    apiRef.current.subscribeEvent('saveTrack', (params) => {
      saveTrack(params.id);
    });

    apiRef.current.subscribeEvent('removeTrack', (params) => {
      saveTrack(params.id);
    });
  }, [apiRef, isFetching]);

  const { selectedSeeds, setSelectedSeeds, isSeedSelectable } =
    useSeedSelection();

  return (
    <Layout>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Playlists
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
          rows={data?.pages.map((page) => page.playlists).flat()}
          columns={columns}
          loading={isFetching}
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
