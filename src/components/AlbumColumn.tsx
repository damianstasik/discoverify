import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { memo } from 'react';

interface Props {
  id: string;
  name: string;
}

export const AlbumColumn = memo(({ id, name }: Props) => {
  return (
    <Link component={RouterLink} to={`/album/${id}`}>
      {name}
    </Link>
  );
});
