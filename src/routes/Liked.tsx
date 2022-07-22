import { formatRelative } from 'date-fns';
import {
  type GridColumns,
  GridActionsCellItem,
  useGridApiContext,
  type GridRowId,
} from '@mui/x-data-grid-premium';
import { type QueryFunction, useInfiniteQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import Icon from '@mdi/react';
import { mdiCardsHeartOutline, mdiSpotify } from '@mdi/js';
import IconButton from '@mui/material/IconButton';
import { memo, useState } from 'react';
import { tokenState } from '../store';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { AlbumColumn } from '../components/AlbumColumn';
import { TrackSelectionToolbar } from '../components/TrackSelectionToolbar';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { Table } from '../components/Table';
import { PageTitle } from '../components/PageTitle';

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

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
    headerName: 'Name',
    flex: 0.2,
    sortable: false,
    renderCell: (params) => (
      <TrackNameColumn id={params.row.id} name={params.value} />
    ),
  },
  {
    field: 'artists',
    headerName: 'Artist(s)',
    flex: 0.2,
    renderCell: (params) => <ArtistColumn artists={params.value} />,
  },
  {
    field: 'album',
    headerName: 'Album',
    flex: 0.2,
    renderCell: (params) => (
      <AlbumColumn id={params.value.id} name={params.value.name} />
    ),
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

type LikedRes = { tracks: Track[]; nextPage: number | null };
type LikedQueryKey = [key: string, token: string];

const likedQuery: QueryFunction<LikedRes, LikedQueryKey> = async ({
  queryKey,
  pageParam = 0,
  signal,
}) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/user/liked?page=${pageParam}`,
    {
      signal,
      headers: {
        Authorization: `Bearer ${queryKey[1]}`,
      },
    },
  );

  const body = await res.json();

  return body;
};

interface Track {
  id: string;
}

export function Liked() {
  const token = useRecoilValue(tokenState);
  const [selectedTracks, setSelectedTracks] = useState<Array<GridRowId>>([]);

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<
    LikedRes,
    Error,
    Track,
    LikedQueryKey
  >(['liked', token], likedQuery, {
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (d) => ({
      pages: d.pages.map((page) => page.tracks).flat(),
      pageParams: d.pageParams,
    }),
  });

  const rows = data?.pages || [];

  return (
    <>
      <PageTitle>Liked tracks</PageTitle>

      <div style={{ height: 800 }}>
        <Table
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(value) => setSelectedTracks(value)}
          selectionModel={selectedTracks}
          rows={rows}
          loading={isFetching}
          onRowsScrollEnd={() => hasNextPage && fetchNextPage()}
          components={{
            Toolbar: TrackSelectionToolbar,
          }}
        />
      </div>
    </>
  );
}
