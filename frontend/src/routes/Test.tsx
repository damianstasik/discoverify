import { useState, useDeferredValue } from 'react';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { mdiSpotify } from '@mdi/js';
import { tokenState } from '../store';
import { PageTitle } from '../components/PageTitle';
import { VirtualTable } from '../components/VirtualTable';
import { IconButton } from '../components/IconButton';

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (params) => (
      <Link to={`/playlist/${params.row.original.id}`}>
        {params.getValue()}
      </Link>
    ),
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    cell: (params) => (
      <Link to={`/artist/${params.getValue().id}`}>
        {params.getValue().display_name}
      </Link>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: (params) => (
      <IconButton
        label="Open in Spotify"
        href={params.row.original.uri}
        target="_blank"
        icon={mdiSpotify}
      />
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

      {/* <TrackAutocomplete
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
          const qa = new URLSearchParams(searchParams);
          qa.append('q', b.id);
          setSearchParams(qa);
        }}
      /> */}

      <div style={{ height: 800 }}>
        <VirtualTable
          data={data || []}
          columns={columns}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
