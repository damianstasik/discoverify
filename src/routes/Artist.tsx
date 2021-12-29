import Button from '@mui/material/Button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useAtomValue } from 'jotai/utils';
import { useQuery } from 'react-query';
import { tokenIdState } from '../store';
import { Layout } from '../components/Layout';

export function Artist() {
  const tokenId = useAtomValue(tokenIdState);
  const params = useParams();

  const { data } = useQuery(
    ['artist', params.id],
    async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/artist/${
          params.id
        }?tokenId=${tokenId}`,
      );
      const body = await res.json();

      return body.artist;
    },
    { suspense: true },
  );

  return (
    <Layout>
      <h3 className={`bp3-heading ${isLoading ? 'bp3-skeleton' : ''}`}>
        {artist.name}
      </h3>
      <div className="grid grid-cols-5 gap-4 ">
        {isLoading ? <ArtistCardSkeleton /> : <div>loaded</div>}
      </div>
    </Layout>
  );
}
