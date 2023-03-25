import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import { AlbumColumn } from '../components/AlbumColumn';
import { ArtistsColumn } from '../components/ArtistsColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { VirtualTable } from '../components/VirtualTable';
import { CheckboxColumn } from '../components/CheckboxColumn';
import { usePlayPauseTrackHook } from '../hooks/usePlayPauseTrackHook';
import { useIgnoreTrackHook } from '../hooks/useIgnoreTrackHook';
import { getPlaylist, getPlaylistTracks } from '../api';
import { createColumnHelper } from '@tanstack/react-table';
import { AddedAtColumn } from '../components/AddedAtColumn';
import { RouterOutput } from '../trpc';
import { DurationColumn } from '../components/DurationColumn';
import { SaveColumn } from '../components/SaveColumn';
import { SpotifyLinkColumn } from '../components/SpotifyLinkColumn';
import { twMerge } from 'tailwind-merge';

type PlaylistType = RouterOutput['playlist']['tracks']['tracks'][number];

const columnHelper = createColumnHelper<PlaylistType>();

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
    size: 300,
    cell: TrackNameColumn,
  }),
  columnHelper.accessor('artists', {
    header: 'Artist(s)',
    cell: ArtistsColumn,
    size: 200,
  }),
  columnHelper.accessor('album', {
    header: 'Album',
    cell: AlbumColumn,
    size: 200,
  }),
  columnHelper.accessor('added_at', {
    header: 'Added At',
    cell: AddedAtColumn,
    size: 180,
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
    size: 40,
    cell: SpotifyLinkColumn,
  }),
];

function Img({ src }) {
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <div
      className={twMerge(
        'absolute top-0 inset-x-0 z-0 h-[500px] opacity-0 transition-opacity duration-500',
        imgRef.current?.complete && 'opacity-10',
      )}
    >
      <span className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-slate-900/90 to-slate-900" />
      <img
        src={src}
        alt="Artist's picture"
        className="object-cover w-full h-full"
        ref={imgRef}
      />
    </div>
  );
}

export function Playlist() {
  const params = useParams<'id'>();

  const { data, isFetching } = useQuery(['playlist', params.id!], getPlaylist);

  const {
    data: tracks,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(['playlistTracks', params.id!], getPlaylistTracks, {
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const flatData = useMemo(
    () => tracks?.pages?.flatMap((page) => page.tracks) ?? [],
    [tracks],
  );

  const ids = useMemo(() => flatData.map((t) => t.uri), [flatData]);

  usePlayPauseTrackHook(ids);

  useIgnoreTrackHook();

  return (
    <>
      <Img src={data?.images?.[0]?.url} key={params.id} />

      <div className="p-3 border-b border-white/5 backdrop-blur-lg">
        <h2 className="text-xl text-white font-bold leading-none">
          {data?.name || (
            <div className="animate-pulse h-em w-48 bg-neutral-700 rounded-md" />
          )}
        </h2>

        {data?.description && (
          <p className='text-gray-400 text-sm mt-3'>{data?.description}</p>
        )}
      </div>

      <div style={{ height: 800 }}>
        <VirtualTable
          columns={columns}
          data={flatData}
          isLoading={isFetching}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </>
  );
}
