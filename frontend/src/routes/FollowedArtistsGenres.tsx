import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { tokenState } from '../store';
import { VirtualTable } from '../components/VirtualTable';
import { Button } from '../components/Button';

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'count',
    header: 'Count',
  },
  {
    id: 'actions',
    header: 'Top tracks from genre',
    cell: (params) => (
      <Button
        component={Link}
        to={`/followed-artists/top-tracks?genre=${encodeURIComponent(
          params.row.original.name,
        )}`}
      >
        Top tracks
      </Button>
    ),
  },
];

async function fetchFollowedArtistsGenres(token) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/followed-artists/genres?tokenId=${token}`,
  );

  const body = await res.json();

  return body;
}

export function FollowedArtistsGenres() {
  const token = useRecoilValue(tokenState);

  const { isLoading, data } = useQuery(
    ['followed-artists-genres', token],
    async function followedArtistsGenres() {
      return fetchFollowedArtistsGenres(token);
    },
  );

  return (
    <>
      <div variant="h5" sx={{ mb: 1 }}>
        Genres from followed artists
      </div>

      <div variant="subtitle1" sx={{ mb: 2 }}>
        Here are genres
      </div>

      <div style={{ height: 800 }}>
        <VirtualTable isLoading={isLoading} rows={data} columns={columns} />
      </div>
    </>
  );
}
