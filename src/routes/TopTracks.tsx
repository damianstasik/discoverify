import { memo, useEffect, useMemo, useState } from 'react';
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
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useInfiniteQuery, useMutation } from 'react-query';
import { mdiCardsHeartOutline, mdiSpotify } from '@mdi/js';
import Icon from '@mdi/react';
import { tokenIdState } from '../store';
import { Layout } from '../components/Layout';
import * as trackApi from '../api/track';
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
      <TrackPreviewColumn url={params.value} context={params.row} />
    ),
  },
  {
    field: 'name',
    sortable: false,
    headerName: 'Name',
    flex: 0.3,
  },
  {
    field: 'artists',
    headerName: 'Artist(s)',
    flex: 0.7,
    sortable: false,
    renderCell: (params) => <ArtistColumn artists={params.value} />,
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    renderCell: (params) => (
      <>
        <OpenInSpotify row={params.row} />
        <Save row={params.row} />
      </>
    ),
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
      getNextPageParam: (lastPage) => lastPage.nextPage,
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
        />
      </div>
    </Layout>
  );
}
