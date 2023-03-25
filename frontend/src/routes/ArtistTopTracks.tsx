import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AlbumColumn } from '../components/AlbumColumn';
import { ArtistsColumn } from '../components/ArtistsColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { VirtualTable } from '../components/VirtualTable';
import { DurationColumn } from '../components/DurationColumn';
import { RouterOutput, trpc } from '../trpc';
import { createColumnHelper } from '@tanstack/react-table';
import { SaveColumn } from '../components/SaveColumn';
import { IgnoreColumn } from '../components/IgnoreColumn';
import { SpotifyLinkColumn } from '../components/SpotifyLinkColumn';
import { CheckboxColumn } from '../components/CheckboxColumn';
import { useMemo } from 'react';
import { usePlayPauseTrackHook } from '../hooks/usePlayPauseTrackHook';

type TrackType = RouterOutput['artist']['topTracks'][number];

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
    size: 300,
    cell: TrackNameColumn,
  }),
  columnHelper.accessor('artists', {
    header: 'Artist(s)',
    cell: ArtistsColumn,
    size: 250,
  }),
  columnHelper.accessor('album', {
    header: 'Album',
    cell: AlbumColumn,
    size: 250,
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

export function ArtistTopTracks() {
  const params = useParams();

  const { data, isFetching } = useQuery(
    ['artist-top-tracks', params.id],
    async function artistTopTracksQuery({ queryKey, signal }) {
      const tracks = await trpc.artist.topTracks.query(queryKey[1], { signal });

      return tracks;
    },
    { suspense: true },
  );

  const ids = useMemo(() => (data || []).map((t) => t.uri), [data]);

  usePlayPauseTrackHook(ids);

  return (
    <div style={{ height: 800 }}>
      <VirtualTable
        columns={columns}
        data={data || []}
        isLoading={isFetching}
      />
    </div>
  );
}
