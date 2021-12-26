import { useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { mdiCardsHeartOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { tokenIdState, trackPreviewState } from '../store';
import { Layout } from '../components/Layout';

const columns: GridColumns = [
  {
    type: 'actions',
    field: 'actionss',
    headerName: '',
    width: 50,
    getActions: (params) => {
      const apiRef = useGridApiContext();

      return [
        <GridActionsCellItem
          icon={<PlayCircleIcon />}
          onClick={() =>
            apiRef.current.publishEvent('playTrackPreview', {
              url: params.row.preview_url,
              track: params.row,
            })
          }
          label="Play"
        />,
      ];
    },
  },
  { field: 'name', headerName: 'Name', width: 300 },
  {
    field: 'artists',
    headerName: 'Artists',
    width: 500,
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

    getActions: (params) => {
      const apiRef = useGridApiContext();

      return [
        <GridActionsCellItem
          icon={<VisibilityOffIcon />}
          onClick={() => {}}
          label="Hide"
        />,

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
          apiRef={apiRef}
          rows={tracks}
          columns={columns}
          loading={isLoading}
        />
      </div>
    </Layout>
  );
}
