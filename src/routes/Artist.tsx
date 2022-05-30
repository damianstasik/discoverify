import Button from '@mui/material/Button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { useQuery } from 'react-query';
import { tokenState } from '../store';
import { Layout } from '../components/Layout';

export function Artist() {
  const token = useAtomValue(tokenState);
  const params = useParams();

  const { data } = useQuery(
    ['artist', params.id],
    async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/artist/${params.id}?tokenId=${token}`,
      );
      const body = await res.json();

      return body.artist;
    },
    { suspense: true },
  );

  return (
    <Layout>
      <h3>{data.name}</h3>

      <Button
        component={RouterLink}
        to={`/related-artists/top-tracks/${data.id}`}
      >
        Related artists' top tracks
      </Button>
    </Layout>
  );
}
