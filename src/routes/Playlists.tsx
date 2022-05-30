import { useEffect, useMemo } from 'react';
import {
  Link as RouterLink,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import {
  DataGridPremium,
  type GridColumns,
  useGridApiRef,
import { useAtomValue } from 'jotai/utils';
} from '@mui/x-data-grid-premium';
import { IconButton, Link } from '@mui/material';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { mdiSpotify } from '@mdi/js';
import Icon from '@mdi/react';
import { tokenIdState } from '../store';
import { Layout } from '../components/Layout';
import * as trackApi from '../api/track';
import * as playlistApi from '../api/playlist';
import { useSeedSelection } from '../hooks/useSeedSelection';
import { Table } from '../components/Table';

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
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    renderCell: (params) => (
      <IconButton
        size="small"
        aria-label="Open in Spotify"
        href={params.row.uri}
        target="_blank"
      >
        <Icon path={mdiSpotify} size={1} />
      </IconButton>
    ),
  },
];

export function Playlists() {
  const tokenId = useAtomValue(tokenIdState);
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
        queryClient.setQueryData(['related-artists-top-tracks', id], (old) => {
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

  const rows = useMemo(
    () => (data?.pages || []).map((page) => page.playlists).flat(),
    [data],
  );

  return (
    <Layout>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Playlists
      </Typography>

      <div style={{ height: 800 }}>
        <Table
          pagination
          paginationMode="server"
          onRowsScrollEnd={() => hasNextPage && fetchNextPage()}
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          loading={isFetching}
        />
      </div>
    </Layout>
  );
}
