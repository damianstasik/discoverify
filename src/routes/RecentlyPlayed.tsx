import { memo, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import {
  GridActionsCellItem,
  type GridColumns,
  useGridApiContext,
  useGridApiRef,
  type GridRowId,
} from '@mui/x-data-grid-premium';
import { useRecoilValue } from 'recoil';
import { IconButton } from '@mui/material';
import { useInfiniteQuery, useMutation } from 'react-query';
import { mdiCardsHeartOutline, mdiSpotify } from '@mdi/js';
import Icon from '@mdi/react';
import { formatRelative } from 'date-fns';
import { tokenState } from '../store';
import * as trackApi from '../api/track';
import { TrackSelectionToolbar } from '../components/TrackSelectionToolbar';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { Table } from '../components/Table';

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
    sortable: false,
    headerName: 'Name',
    flex: 0.3,
    renderCell: (params) => (
      <TrackNameColumn id={params.row.track.id} name={params.row.track.name} />
    ),
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
  const token = useRecoilValue(tokenState);
  const [searchParams] = useSearchParams();
  const apiRef = useGridApiRef();

  const { mutateAsync: saveTrack } = useMutation<void, Error, string>(
    async (id) => trackApi.saveTrack(token, id),
  );

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['recently-played'],
    async ({ pageParam }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/recentlyPlayed?tokenId=${token}${
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

  const [selectedTracks, setSelectedTracks] = useState<Array<GridRowId>>([]);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Recently played tracks
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Here are tracks that you recently played.
      </Typography>

      <div style={{ height: 800 }}>
        <Table
          pagination
          paginationMode="server"
          onRowsScrollEnd={() => hasNextPage && fetchNextPage()}
          checkboxSelection
          onSelectionModelChange={(value) => setSelectedTracks(value)}
          selectionModel={selectedTracks}
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          loading={isFetching}
          components={{
            Toolbar: TrackSelectionToolbar,
          }}
          getRowId={(row) => row.track.id + row.played_at}
        />
      </div>
    </>
  );
}
