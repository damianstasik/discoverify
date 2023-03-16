import { createBrowserRouter, createPath, useParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { AlbumColumn } from '../components/AlbumColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { PageTitle } from '../components/PageTitle';
import { Skeleton } from '@mui/material';
import { VirtualTable } from '../components/VirtualTable';
import { CheckboxColumn } from '../components/CheckboxColumn';
import { usePlayPauseTrackHook } from '../hooks/usePlayPauseTrackHook';
import { useIgnoreTrackHook } from '../hooks/useIgnoreTrackHook';
import { useSaveTrackHook } from '../hooks/useSaveTrackHook';
import { getPlaylist, getPlaylistTracks } from '../api';
import { createColumnHelper } from '@tanstack/react-table';
import { AddedAtColumn } from '../components/AddedAtColumn';
import { RouterOutput } from '../trpc';
import { DurationColumn } from '../components/DurationColumn';
import { SaveColumn } from '../components/SaveColumn';
import { IgnoreColumn } from '../components/IgnoreColumn';
import { SpotifyLinkColumn } from '../components/SpotifyLinkColumn';
import { Router } from '@remix-run/router';

type PlaylistType = RouterOutput['playlist']['byId']['tracks'][number];

const columnHelper = createColumnHelper<PlaylistType>();

const columns = [
  columnHelper.display({
    size: 50,
    id: 'select',
    header: ({ table }) => <CheckboxColumn table={table} />,
    cell: ({ row }) => <CheckboxColumn row={row} isRow />,
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
  columnHelper.accessor('addedAt', {
    header: 'Added At',
    cell: AddedAtColumn,
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

export function Playlist() {
  const params = useParams<'id'>();

  const { data, isFetching } = useQuery(['playlist', params.id!], getPlaylist);

  const { data: tracks } = useInfiniteQuery(
    ['playlistTracks', params.id!],
    getPlaylistTracks,
    {
      initialData: {
        pages: data?.tracks
          ? data?.meta.total === data?.meta.limit
            ? [
                data.tracks.slice(0, data?.meta.limit / 2),
                data.tracks.slice(data?.meta.limit / 2),
              ]
            : [data.tracks]
          : [],
        pageParams: [],
      },
    },
  );

  const ids = useMemo(() => (tracks || []).map((t) => t.uri), [data]);

  usePlayPauseTrackHook(ids);

  useIgnoreTrackHook();

  useSaveTrackHook();

  return (
    <>
      <PageTitle>
        Playlist:{' '}
        {data ? (
          data.name
        ) : (
          <Skeleton variant="rounded" width={210} sx={{ ml: 1 }} />
        )}
      </PageTitle>

      <div style={{ height: 800 }}>
        <VirtualTable
          columns={columns}
          data={tracks || []}
          isLoading={isFetching}
        />
      </div>
    </>
  );
}
