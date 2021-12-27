import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { formatRelative } from 'date-fns';
import {
  GridCellParams,
  DataGridPro,
  GridColumns,
  GridActionsCellItem,
} from '@mui/x-data-grid-pro';
import { useInfiniteQuery } from 'react-query';
import Link from '@mui/material/Link';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import Icon from '@mdi/react';
import { mdiPauseCircleOutline, mdiPlayCircleOutline } from '@mdi/js';
import { Layout } from '../components/Layout';
import { loadingTrackPreview, tokenIdState, trackPreviewState } from '../store';
import { useSeedSelection } from '../hooks/useSeedSelection';
import { RecommendationToolbar } from '../components/RecommendationToolbar';

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
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
    type: 'actions',
    field: 'actionss',
    headerName: '',
    width: 50,
    sortable: false,
    getActions: (params) => {
      const [trackPreview, setTrackPreview] = useAtom(trackPreviewState);
      const isLoadingTrackPreview = useAtomValue(loadingTrackPreview);
      const isCurrentlyPlaying =
        trackPreview?.url === params.row.preview_url &&
        trackPreview?.context === params.row;

      if (!params.row.preview_url) {
        return [];
      }

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
            setTrackPreview({
              url: params.row.preview_url,
              context: params.row,
              state: 'playing',
            })
          }
          disabled={isLoadingTrackPreview}
          label="Play"
        />,
      ];
    },
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

  const { selectedSeeds, setSelectedSeeds, isSeedSelectable } =
    useSeedSelection();

  return (
    <Layout>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Liked tracks
      </Typography>

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
            setSelectedSeeds(newSelection)
          }
          selectionModel={selectedSeeds}
          isRowSelectable={isSeedSelectable}
          rows={(data?.pages || []).map((page) => page.songs).flat()}
          loading={isFetching}
          onRowsScrollEnd={() => hasNextPage && fetchNextPage()}
          components={{
            Toolbar: RecommendationToolbar,
          }}
        />
      </div>
    </Layout>
  );
}
