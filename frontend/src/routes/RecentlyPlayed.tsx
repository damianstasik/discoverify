import { memo, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useInfiniteQuery } from '@tanstack/react-query';
import { formatRelative } from 'date-fns';
import { tokenState } from '../store';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistsColumn } from '../components/ArtistsColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { VirtualTable } from '../components/VirtualTable';
import { IconButton } from '../components/IconButton';

const OpenInSpotify = memo(({ row }) => {
  return (
    <IconButton
      label="Open in Spotify"
      href={row.uri}
      target="_blank"
      icon={mdiSpotify}
    />
  );
});

const columns = [
  {
    accessorKey: 'uri',
    header: '',
    size: 50,
    cell: TrackPreviewColumn,
  },
  {
    accessorFn: (row) => row.track.name,
    header: 'Name',
    cell: TrackNameColumn,
  },
  {
    accessorFn: (row) => row.track.artists,
    header: 'Artist(s)',
    cell: ArtistsColumn,
  },
  {
    accessorKey: 'played_at',
    header: 'Played at',
    cell: (params: any) => {
      return formatRelative(new Date(params.getValue()), new Date());
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: (params) => (
      <>
        <OpenInSpotify row={params.row.original.track} />
      </>
    ),
  },
];

export function RecentlyPlayed() {
  const token = useRecoilValue(tokenState);
  const [searchParams] = useSearchParams();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['recently-played'],
    async function recentlyPlayedQuery({ pageParam }) {
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

  const rows = useMemo(
    () => (data?.pages || []).map((page) => page.tracks).flat(),
    [data],
  );

  return (
    <>
      <div variant="h5" sx={{ mb: 1 }}>
        Recently played tracks
      </div>

      <div variant="subtitle1" sx={{ mb: 2 }}>
        Here are tracks that you recently played.
      </div>

      <div style={{ height: 800 }}>
        <VirtualTable
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isLoading={isFetching}
          data={rows}
          columns={columns}
        />
      </div>
    </>
  );
}
