import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { AlbumColumn } from '../components/AlbumColumn';
import { ArtistColumn } from '../components/ArtistColumn';
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
    accessorKey: 'name',
    header: 'Name',
    cell: (params) => (
      <Link component={RouterLink} to={`/album/${params.row.original.id}`}>
        {params.getValue()}
      </Link>
    ),
  },
  {
    accessorKey: 'artists',
    header: 'Artist(s)',
    cell: ArtistColumn,
  },
];

export function ArtistAlbums() {
  const token = useRecoilValue(tokenState);
  const params = useParams();

  const { data, isFetching } = useQuery(
    ['artist-albums', params.id],
    async function artistAlbumsQuery() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/artist/${params.id}/albums?type=album`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const body = await res.json();

      return body.albums;
    },
    { suspense: true },
  );

  return (
    <div style={{ height: 800 }}>
      <VirtualTable
        columns={columns}
        rows={data || []}
        isLoading={isFetching}
      />
    </div>
  );
}
