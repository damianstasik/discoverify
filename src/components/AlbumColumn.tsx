import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
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
    <Link component={RouterLink} to={`/album/${album.id}`} color="#fff" py={1}>
      {album.name}
    </Link>
  );
};
