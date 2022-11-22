import { memo, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useRecoilValue } from 'recoil';
import { IconButton } from '@mui/material';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { mdiCardsHeartOutline, mdiSpotify } from '@mdi/js';
import Icon from '@mdi/react';
import { tokenState } from '../store';
import * as trackApi from '../api/track';
import * as artistApi from '../api/artist';
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
    id: 'preview_url',
    header: '',
    cell: (params) => (
      <TrackPreviewColumn url={params.getValue()} context={params.row.original} />
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (params) => (
      <TrackNameColumn id={params.row.original.id} name={params.getValue()} />
    ),
  },
  {
    accessorKey: 'artists',
    header: 'Artist(s)',
    cell: (params) => <ArtistColumn artists={params.getValue()} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: (params) => (
      <>
        <OpenInSpotify row={params.row.original} />
      </>
    ),
  },
];

export function FollowedArtistsTopTracks() {
  const token = useRecoilValue(tokenState);
  const [searchParams] = useSearchParams();
  const genre = searchParams.get('genre');

  const { mutateAsync: saveTrack } = useMutation<void, Error, string>(
    async (id) => trackApi.saveTrack(token, id),
  );

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['top-tracks', genre],
    async function followedArtistsTopTracksQuery({ pageParam = 0 }) {
      return artistApi.getFollowedArtistsTopTracks(
        token,
        searchParams.get('genre'),
        pageParam,
      );
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  );

  const rows = useMemo(
    () => (data?.pages || []).map((page) => page.tracks).flat(),
    [data],
  );

  const [selectedTracks, setSelectedTracks] = useState<Array<GridRowId>>([]);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Top tracks from followed artists
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Here are tracks that come from top 10 lists of the artists that you
        follow. The list does not include tracks that you have already saved in
        your library.
      </Typography>

      <div style={{ height: 800 }}>
        <VirtualTable
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isFetching}
          data={rows}
          columns={columns}
        />
      </div>
    </>
  );
}
