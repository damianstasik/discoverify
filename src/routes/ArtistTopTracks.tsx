import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AlbumColumn } from '../components/AlbumColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { tokenState } from '../store';
import { VirtualTable } from '../components/VirtualTable';
import { DurationColumn } from '../components/DurationColumn';

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
    cell: ArtistColumn,
  },
  {
    accessorKey: 'album',
    header: 'Album',
    cell: AlbumColumn,
  },
  {
    accessorKey: 'duration_ms',
    header: 'Duration',
    cell: DurationColumn,
  },
];

export function ArtistTopTracks() {
  const token = useRecoilValue(tokenState);
  const params = useParams();

  const { data, isFetching } = useQuery(
    ['artist-top-tracks', params.id],
    async function artistTopTracksQuery() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/artist/${params.id}/top-tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const body = await res.json();

      return body.tracks;
    },
  );

  return (
    <div style={{ height: 800 }}>
      <VirtualTable columns={columns} rows={data || []} isLoading={isFetching} />
    </div>
  );
}
