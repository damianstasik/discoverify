import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { VirtualTable } from '../components/VirtualTable';
import { RouterOutput, trpc } from '../trpc';
import { createColumnHelper } from '@tanstack/react-table';
import { CheckboxColumn } from '../components/CheckboxColumn';
import { AlbumColumn } from '../components/AlbumColumn';
import { DurationColumn } from '../components/DurationColumn';
import { SaveColumn } from '../components/SaveColumn';
import { IgnoreColumn } from '../components/IgnoreColumn';
import { SpotifyLinkColumn } from '../components/SpotifyLinkColumn';

type TrackType =
  RouterOutput['artist']['relatedArtistsTopTracks']['data'][number];

const columnHelper = createColumnHelper<TrackType>();

const columns = [
  columnHelper.display({
    size: 50,
    id: 'select',
    header: ({ table }) => (
      <CheckboxColumn
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <CheckboxColumn
        {...{
          checked: row.getIsSelected(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  }),
  columnHelper.accessor('uri', {
    header: '',
    id: 'preview',
    size: 50,
    cell: TrackPreviewColumn,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    size: 300,
    cell: TrackNameColumn,
  }),
  columnHelper.accessor('artists', {
    header: 'Artist(s)',
    cell: ArtistColumn,
  }),
  columnHelper.accessor('album', {
    header: 'Album',
    cell: AlbumColumn,
  }),
  columnHelper.accessor('duration_ms', {
    header: 'Duration',
    cell: DurationColumn,
  }),
  columnHelper.accessor('isLiked', {
    header: '',
    size: 40,
    cell: SaveColumn,
  }),
  columnHelper.accessor('isIgnored', {
    header: '',
    size: 40,
    cell: IgnoreColumn,
  }),
  columnHelper.accessor('uri', {
    id: 'open',
    header: '',
    size: 40,
    cell: SpotifyLinkColumn,
  }),
];

export function RelatedArtistsTopTracks() {
  const { id } = useParams<{ id: string }>();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['related-artists-top-tracks', id],
    async function relatedArtistsTopTracksQuery({
      pageParam = 0,
      queryKey,
      signal,
    }) {
      const tracks = await trpc.artist.relatedArtistsTopTracks.query(
        {
          id: queryKey[1],
          page: pageParam,
        },
        { signal },
      );
      return tracks;
    },
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasNextPage ? pages.length : false,
    },
  );

  const rows = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data],
  );

  return (
    <>
      <div className='p-3 bg-black/50 border-b border-white/20 backdrop-blur-lg'>
        <h5 className=' font-semibold text-white mb-1'>
          Top tracks from artists similar to a given artist
        </h5>
        <p className='text-gray-400 text-sm'>
          Here are tracks that come from top 10 lists of the artists that are
          similar to a given artist. The list does not include tracks that you
          have already saved in your library. Similarity is based on analysis of
          the Spotify community's listening history.
        </p>
      </div>

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
