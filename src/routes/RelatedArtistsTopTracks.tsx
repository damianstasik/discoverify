import { memo, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useRecoilValue } from 'recoil';
import { IconButton } from '@mui/material';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { mdiCardsHeartOutline, mdiSpotify } from '@mdi/js';
import Icon from '@mdi/react';
import { tokenState } from '../store';
import * as trackApi from '../api/track';
import * as artistApi from '../api/artist';
import { TrackSelectionToolbar } from '../components/TrackSelectionToolbar';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistColumn } from '../components/ArtistColumn';
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
    accessorKey: 'name',
    header: 'Track name',
    cell: TrackNameColumn,
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

export function RelatedArtistsTopTracks() {
  const token = useRecoilValue(tokenState);
  const { id } = useParams<{ id: string }>();

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

  const rows = useMemo(
    () => (data?.pages || []).map((page) => page.data).flat(),
    [data],
  );

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
        <VirtualTable
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          data={rows}
          columns={columns}
          isLoading={isFetching}
        />
      </div>
    </>
  );
}
