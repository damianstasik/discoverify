import { Link } from 'react-router-dom';
import { CellContext } from '@tanstack/react-table';

interface Album {
  id: string;
  name: string;
}

export const AlbumColumn = <Data extends { album: Album }>(
  props: CellContext<Data, Album>,
) => {
  const album = props.getValue();
  return (
    <Link
      to={`/album/${album.id}`}
      className="text-white underline decoration-stone-600 underline-offset-4 hover:decoration-stone-400"
    >
      {album.name}
    </Link>
  );
};
