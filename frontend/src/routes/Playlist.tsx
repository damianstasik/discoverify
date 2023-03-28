import { useLocation, useParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
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
import { BgImg } from '../components/BgImg';

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
    minSize: 200,
    cell: TrackNameColumn,
    size: 0.4,
  }),
  columnHelper.accessor('artists', {
    header: 'Artist(s)',
    cell: ArtistsColumn,
    minSize: 200,
    size: 0.3,
  }),
  columnHelper.accessor('album', {
    header: 'Album',
    cell: AlbumColumn,
    minSize: 200,
    size: 0.3,
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
    size: 50,
    cell: SpotifyLinkColumn,
  }),
];

export function Playlist() {
  const params = useParams<'id'>();
  const { state } = useLocation();

  const { data, isFetching } = useQuery(['playlist', params.id!], getPlaylist, {
    placeholderData: state,
  });

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
      <BgImg
        src={data?.images?.[0]?.url}
        key={params.id}
        alt="Playlist cover picture"
      />

      <div className="p-3 border-b border-white/5 backdrop-blur-lg">
        <h2 className="text-xl/none text-white font-bold">
          {data?.name || (
            <div className="animate-pulse h-em w-48 bg-slate-600 rounded-md" />
          )}
        </h2>

        {data?.description && (
          <p className='text-gray-400 text-sm mt-3'>{data?.description}</p>
        )}
      </div>

      <VirtualTable
        columns={columns}
        data={flatData}
        isLoading={isFetching}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
}
