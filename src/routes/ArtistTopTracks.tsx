import { GridColumns } from '@mui/x-data-grid-premium';
import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
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

const columns: GridColumns = [
  {
    field: 'preview_url',
    headerName: '',
    width: 60,
    sortable: false,
    renderCell: (params) => (
      <TrackPreviewColumn url={params.value} context={params.row} />
    ),
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 0.2,
    sortable: false,
    renderCell: (params) => (
      <TrackNameColumn id={params.row.id} name={params.value} />
    ),
  },
  {
    field: 'artists',
    headerName: 'Artist(s)',
    flex: 0.2,
    renderCell: (params) => <ArtistColumn artists={params.value} />,
  },
  {
    field: 'album',
    headerName: 'Album',
    flex: 0.2,
    renderCell: (params) => <AlbumColumn data={params.value} />,
  },
  {
    field: 'duration_ms',
    headerName: 'Duration',
    flex: 0.1,
    sortable: false,
    valueFormatter: (params: any) => {
      return msToTime(params.value);
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
      <Table columns={columns} rows={data || []} loading={isFetching} />
    </div>
  );
}
