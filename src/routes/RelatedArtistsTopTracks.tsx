import { memo, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { mdiCardsHeartOutline, mdiSpotify } from '@mdi/js';
import Icon from '@mdi/react';
import { tokenState } from '../store';
import * as trackApi from '../api/track';
import * as artistApi from '../api/artist';
import { TrackSelectionToolbar } from '../components/TrackSelectionToolbar';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistColumn } from '../components/ArtistColumn';
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
      <TrackPreviewColumn url={params.value} context={params.row} />
    ),
  },
  {
    field: 'name',
    sortable: false,
    headerName: 'Track name',
    flex: 0.3,
    renderCell: (params) => (
      <TrackNameColumn id={params.row.id} name={params.value} />
    ),
  },
  {
    field: 'artists',
    headerName: 'Artist(s)',
    flex: 0.7,
    sortable: false,
    renderCell: (params) => <ArtistColumn artists={params.value} />,
  },
  {
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

export function RelatedArtistsTopTracks() {
  const token = useRecoilValue(tokenState);
  const apiRef = useGridApiRef();
  const { id } = useParams<{ id: string }>();

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['related-artists-top-tracks', id],
    async function relatedArtistsTopTracksQuery({ pageParam = 0 }) {
      return artistApi.getRelatedArtistsTopTracks(token, id, pageParam);
    },
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasNextPage ? pages.length : false,
    },
  );

  const { mutateAsync: saveTrack } = useMutation<void, Error, string>(
    async (trackId) => trackApi.saveTrack(token, trackId),
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
    () => (data?.pages || []).map((page) => page.data).flat(),
    [data],
  );

  const [selectedTracks, setSelectedTracks] = useState<Array<GridRowId>>([]);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Top tracks from artists similar to a given artist
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Here are tracks that come from top 10 lists of the artists that are
        similar to a given artist. The list does not include tracks that you
        have already saved in your library. Similarity is based on analysis of
        the Spotify community's listening history.
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
        />
      </div>
    </>
  );
}
