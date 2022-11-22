import { useRef, useEffect, useMemo, useState, useDeferredValue } from 'react';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import {
  Link as RouterLink,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Typography from '@mui/material/Typography';
import {
  DataGridPremium,
  type GridColumns,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { IconButton, Link } from '@mui/material';
import { mdiSpotify } from '@mdi/js';
import Icon from '@mdi/react';
import { tokenState } from '../store';
import * as trackApi from '../api/track';
import * as playlistApi from '../api/playlist';
import { Table } from '../components/Table';
import { PageTitle } from '../components/PageTitle';
import { TrackAutocomplete } from '../components/TrackAutocomplete';

const columns: GridColumns = [
  {
    field: 'name',
    sortable: false,
    headerName: 'Name',
    flex: 0.3,
    renderCell: (params) => (
      <Link
        component={RouterLink}
        to={`/playlist/${params.row.id}`}
        color="#fff"
      >
        {params.value}
      </Link>
    ),
  },
  {
    field: 'owner',
    headerName: 'Owner',
    flex: 0.7,
    sortable: false,
    renderCell: (params) => (
      <Link
        component={RouterLink}
        to={`/artist/${params.value.id}`}
        color="#fff"
      >
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

const autocompleteQuery: QueryFunction<
  Array<{ id: string; title: string }>,
  [key: string, token: string, query: string]
> = async ({ queryKey }) => {
  const q = new URLSearchParams({
    q: queryKey[2],
    token: queryKey[1],
  });

  const req = await fetch(`${import.meta.env.VITE_API_URL}/search?${q}`);
  const body = await req.json();

  return body.songs;
};

export function Test() {
  const token = useRecoilValue(tokenState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const q = searchParams.get('q');

  const { data, isLoading } = useQuery(
    ['lays', token, q],
    async ({ queryKey }) => {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/user/search-playlists?q=${encodeURIComponent(queryKey[2])}`,
        {
          headers: {
            Authorization: `Bearer ${queryKey[1]}`,
          },
        },
      );
      const body = await res.json();

      return body;
    },
    { enabled: !!q },
  );

  const { data: autosongs, isLoading: isLoadingAutocomplete } = useQuery(
    ['search', token, deferredQuery],
    autocompleteQuery,
    {
      enabled: !!deferredQuery,
    },
  );

  return (
    <>
      <PageTitle>Playlists</PageTitle>

      <TrackAutocomplete
        // isDisabled={(songs || []).length === 5}
        isLoading={isLoadingAutocomplete}
        query={query}
        onQueryChange={setQuery}
        tracks={autosongs}
        onTrackSelection={(b) => {
          // queryClient.setQueryData(
          //   ['songs', `${trackIds},${b.id}`],
          //   (songs || []).concat(b),
          // );
          // console.log('b', b);
          const qa = new URLSearchParams(searchParams);
          qa.append('q', b.id);
          setSearchParams(qa);
        }}
      />

      <div style={{ height: 800 }}>
        <Table
          // pagination
          // paginationMode="server"
          // onRowsScrollEnd={() => hasNextPage && fetchNextPage()}
          // apiRef={apiRef}
          rows={data || []}
          columns={columns}
          loading={isLoading}
        />
      </div>
    </>
  );
}
