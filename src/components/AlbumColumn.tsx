import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { CellContext } from '@tanstack/react-table';

export const AlbumColumn = (props: CellContext<any, any>) => {
  const album = props.getValue();
  return (
    <Link component={RouterLink} to={`/album/${album.id}`} color="#fff" py={1}>
      {album.name}
    </Link>
  );
}
