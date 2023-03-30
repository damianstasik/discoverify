import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as playlistApi from '../api/playlist';
import { VirtualTable } from '../components/VirtualTable';
import { RouterOutput } from '../trpc';
import { createColumnHelper } from '@tanstack/react-table';
import { SpotifyLinkColumn } from '../components/SpotifyLinkColumn';

type PlaylistType = RouterOutput['user']['playlists']['playlists'][number];

const columnHelper = createColumnHelper<PlaylistType>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    size: 300,
    cell: (params) => (
      <RouterLink
        to={`/playlist/${params.row.original.id}`}
        className='text-white underline decoration-blue-900 underline-offset-4 hover:decoration-blue-500 hover:text-blue-500'
      >
        {params.getValue()}
      </RouterLink>
    ),
  }),
  columnHelper.accessor('owner', {
    header: 'Owner',
    size: 300,
    cell: (params) => params.getValue().display_name,
  }),
  columnHelper.accessor('uri', {
    id: 'open',
    header: '',
    size: 40,
    cell: SpotifyLinkColumn,
  }),
];

export function Playlists() {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['playlists'],
    playlistApi.getPlaylists,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  );

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.playlists) ?? [],
    [data],
  );

  return (
    <>
      <VirtualTable
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        data={flatData}
        columns={columns}
        isLoading={isFetching}
      />
    </>
  );
}
