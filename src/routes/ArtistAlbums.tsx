import { GridColumns } from '@mui/x-data-grid-premium';
import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { AlbumColumn } from '../components/AlbumColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { Table } from '../components/Table';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { tokenState } from '../store';

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

const columns: GridColumns<{ id: string; name: string }> = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 0.2,
    sortable: false,
    renderCell: (params) => (
      <Link component={RouterLink} to={`/album/${params.row.id}`}>
        {params.row.name}
      </Link>
    ),
  },
  {
    field: 'artists',
    headerName: 'Artist(s)',
    flex: 0.2,
    renderCell: (params) => <ArtistColumn artists={params.value} />,
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
      <Table columns={columns} rows={data || []} loading={isFetching} />
    </div>
  );
}
