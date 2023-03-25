import { CellContext } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

interface Artist {
  id: string;
  name: string;
}

export const ArtistsColumn = <Data extends { artists: Artist[] }>(
  props: CellContext<Data, Artist[]>,
) => {
  const artists = props.getValue();
  return (
    <div className="flex gap-3 flex-wrap">
      {artists.map((artist) => (
        <Link
          to={`/artist/${artist.id}`}
          state={artist}
          key={artist.id}
          className="text-white underline decoration-yellow-900 underline-offset-4 hover:decoration-yellow-500"
        >
          {artist.name}
        </Link>
      ))}
    </div>
  );
};
