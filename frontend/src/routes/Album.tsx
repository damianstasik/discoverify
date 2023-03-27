import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { RouterOutput, trpc } from '../trpc';
import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { VirtualTable } from '../components/VirtualTable';
import { usePlayPauseTrackHook } from '../hooks/usePlayPauseTrackHook';
import { createColumnHelper } from '@tanstack/react-table';
import { CheckboxColumn } from '../components/CheckboxColumn';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { ArtistsColumn } from '../components/ArtistsColumn';
import { DurationColumn } from '../components/DurationColumn';
import { SaveColumn } from '../components/SaveColumn';
import { SpotifyLinkColumn } from '../components/SpotifyLinkColumn';

type TrackType = RouterOutput['track']['byAlbumId']['tracks'][number];

const columnHelper = createColumnHelper<TrackType>();

const columns = [
  columnHelper.display({
    size: 40,
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
    minSize: 200,
    size: 0.5,
    cell: TrackNameColumn,
  }),
  columnHelper.accessor('artists', {
    header: 'Artist(s)',
    cell: ArtistsColumn,
    minSize: 200,
    size: 0.4,
  }),
  columnHelper.accessor('duration_ms', {
    header: 'Duration',
    cell: DurationColumn,
    size: 80,
  }),
  columnHelper.accessor('isLiked', {
    header: '',
    size: 40,
    cell: SaveColumn,
  }),
  columnHelper.accessor('uri', {
    id: 'open',
    header: '',
    size: 50,
    cell: SpotifyLinkColumn,
  }),
];

function Img({ src }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={twMerge(
        'absolute top-0 inset-x-0 z-0 h-[500px] opacity-0 transition-opacity duration-500',
        loaded && 'opacity-20',
      )}
    >
      <span className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-slate-900" />
      <img
        src={src}
        alt="Artist's picture"
        className="object-cover w-full h-full"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export function Album() {
  const { id } = useParams<{ albumId: string }>();

  const { data } = useQuery(['album', id], ({ signal }) =>
    trpc.album.byId.query(id, { signal }),
  );

  const {
    data: tracks,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery(
    ['tracks', id],
    ({ signal, pageParam = 1 }) =>
      trpc.track.byAlbumId.query(
        {
          albumId: id,
          page: pageParam,
        },
        { signal },
      ),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  );

  const flatData = useMemo(
    () => tracks?.pages?.flatMap((page) => page.tracks) ?? [],
    [data],
  );

  const ids = useMemo(() => flatData.map((t) => t.uri), [flatData]);

  usePlayPauseTrackHook(ids);

  return (
    <>
      <Img src={data?.images?.[0].url} key={id} />
      <div className="relative">
        <div className="border-b border-white/5 backdrop-blur-lg">
          <h2 className="p-3 text-xl text-white font-bold leading-none">
            {data?.name || (
              <div className="animate-pulse h-em w-48 bg-slate-600 rounded-md" />
            )}
          </h2>
        </div>
      </div>
      <VirtualTable
        data={flatData}
        columns={columns}
        isLoading={isFetching}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
}
