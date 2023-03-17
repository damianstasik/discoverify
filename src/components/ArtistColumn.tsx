import { CellContext } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

interface Artist {
  id: string;
  name: string;
}

export const ArtistColumn = <Data extends { artists: Artist[] }>(
  props: CellContext<Data, Artist[]>,
) => {
  const artists = props.getValue();
  return (
    <div className="flex gap-1">
      {artists.map((artist) => (
        <Link
          to={`/artist/${artist.id}`}
          key={artist.id}
          className="text-white underline decoration-white/30"
        >
          {artist.name}
        </Link>
      ))}
    </div>
  );
};
