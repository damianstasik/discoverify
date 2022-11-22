import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AlbumColumn } from '../components/AlbumColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { tokenState } from '../store';
import { VirtualTable } from '../components/VirtualTable';

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

const columns = [
  {
    id: 'preview_url',
    header: '',
    cell: (params) => (
      <TrackPreviewColumn
        url={params.getValue()}
        context={params.row.original}
      />
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
    accessorKey: 'album',
    header: 'Album',
    cell: (params) => <AlbumColumn data={params.getValue()} />,
  },
  {
    accessorKey: 'duration_ms',
    header: 'Duration',
    cell: (params: any) => {
      return msToTime(params.getValue());
    },
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
