import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAtomValue } from 'jotai/utils';
import { tokenIdState } from '../store';
import { Layout } from '../components/Layout';

function ArtistCardSkeleton() {
  return (
    <div className="bp3-elevation-1 bg-white rounded flex flex-col">
      <div className="rounded-t h-40 bp3-skeleton" />
      <div className="p-3 flex flex-col flex-1">
        <h5 className="bp3-heading bp3-skeleton">Artist Name</h5>

        <Button className="mt-auto bp3-skeleton">Follow</Button>
      </div>
    </div>
  );
}

export function Artist() {
  const [isLoading, setLoading] = useState(true);
  const [artist, setArtist] = useState({} as any);
  const tokenId = useAtomValue(tokenIdState);
  const params = useParams() as any;

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/artist/${params.id}?tokenId=${tokenId}`,
    )
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        setArtist(res.artist);
      });
  }, []);

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
