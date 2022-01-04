import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
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
import {
  Breadcrumbs,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Link,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useInfiniteQuery, useMutation } from 'react-query';
import {
  mdiCardsHeartOutline,
  mdiPlayCircleOutline,
  mdiPauseCircleOutline,
  mdiSpotify,
} from '@mdi/js';
import Icon from '@mdi/react';
import { loadingTrackPreview, tokenIdState, trackPreviewState } from '../store';
import { Layout } from '../components/Layout';
import * as trackApi from '../api/track';
import { useSeedSelection } from '../hooks/useSeedSelection';
import { TrackSelectionToolbar } from '../components/TrackSelectionToolbar';

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
        <IconButton
          size="small"
          aria-label="Open in Spotify"
          href={params.row.uri}
          target="_blank"
        >
          <Icon path={mdiSpotify} size={1} />
        </IconButton>,

        <GridActionsCellItem
          icon={<Icon path={mdiCardsHeartOutline} size={1} />}
          onClick={() => apiRef.current.publishEvent('saveTrack', params.row)}
          label="Save"
        />,
      ];
    },
  },
];

export function TopTracks() {
  const tokenId = useAtomValue(tokenIdState);
  const [searchParams] = useSearchParams();
  const apiRef = useGridApiRef();
  const [timeRange, setTimeRange] = useState('short_term');

  const { mutateAsync: saveTrack } = useMutation<void, Error, string>(
    async (id) => trackApi.saveTrack(tokenId, id),
  );

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['top-tracks', timeRange],
    async ({ pageParam = 0 }) =>
      trackApi.getTopTracks(tokenId, timeRange, pageParam),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasNextPage ? pages.length : false,
    },
  );

  useEffect(() => {
    if (!apiRef.current || isFetching) return;

    apiRef.current.subscribeEvent('saveTrack', (params) => {
      saveTrack(params.id);
    });
  }, [apiRef, isFetching]);

  const { selectedSeeds, setSelectedSeeds } = useSeedSelection();

  return (
    <Layout>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Top tracks
      </Typography>

      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        Here are tracks based on calculated affinity.
      </Typography>

      <FormControl component="fieldset" disabled={isFetching}>
        <FormLabel component="legend">Time range</FormLabel>
        <RadioGroup
          row
          aria-label="gender"
          name="row-radio-buttons-group"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <FormControlLabel
            value="short_term"
            control={<Radio />}
            label="Short term"
          />
          <FormControlLabel
            value="medium_term"
            control={<Radio />}
            label="Medium term"
          />
          <FormControlLabel
            value="long_term"
            control={<Radio />}
            label="Long term"
          />
        </RadioGroup>
      </FormControl>

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
          rows={(data?.pages || []).map((page) => page.tracks).flat()}
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
        />
      </div>
    </Layout>
  );
}
