import { memo, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useRecoilValue } from 'recoil';
import { IconButton } from '@mui/material';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { mdiCardsHeartOutline, mdiSpotify } from '@mdi/js';
import Icon from '@mdi/react';
import { formatRelative } from 'date-fns';
import { tokenState } from '../store';
import * as trackApi from '../api/track';
import { TrackSelectionToolbar } from '../components/TrackSelectionToolbar';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { VirtualTable } from '../components/VirtualTable';

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
    accessorFn: row => row.track.artists,
    header: 'Artist(s)',
    cell: ArtistColumn,
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
      <Typography variant="h5" sx={{ mb: 1 }}>
        Recently played tracks
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Here are tracks that you recently played.
      </Typography>

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
