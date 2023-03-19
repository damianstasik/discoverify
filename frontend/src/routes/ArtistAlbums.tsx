import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArtistColumn } from '../components/ArtistColumn';
import { VirtualTable } from '../components/VirtualTable';
import { RouterOutput, trpc } from '../trpc';
import { createColumnHelper } from '@tanstack/react-table';

type AlbumType = RouterOutput['artist']['albums'][number];

const columnHelper = createColumnHelper<AlbumType>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    size: 300,
    cell: (params) => (
      <Link to={`/album/${params.row.original.id}`}>{params.getValue()}</Link>
    ),
  }),
  columnHelper.accessor('artists', {
    header: 'Artist(s)',
    cell: ArtistColumn,
  }),
];

export function ArtistAlbums() {
  const params = useParams();

  const { data, isFetching } = useQuery(
    ['artist-albums', params.id],
    async function artistAlbumsQuery({ signal, queryKey }) {
      const albums = await trpc.artist.albums.query(
        { id: queryKey[1], type: 'album' },
        {
          signal,
        },
      );

      return albums;
    },
    { suspense: true },
  );

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