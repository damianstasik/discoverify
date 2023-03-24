import { memo, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { mdiSpotify } from '@mdi/js';
import { tokenState } from '../store';
import * as trackApi from '../api/track';
import * as artistApi from '../api/artist';
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
    accessorKey: 'name',
    header: 'Name',
    cell: TrackNameColumn,
  },
  {
    accessorKey: 'artists',
    header: 'Artist(s)',
    cell: ArtistsColumn,
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
      <div variant="h5" sx={{ mb: 1 }}>
        Top tracks from followed artists
      </div>

      <div variant="subtitle1" sx={{ mb: 2 }}>
        Here are tracks that come from top 10 lists of the artists that you
        follow. The list does not include tracks that you have already saved in
        your library.
      </div>

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
