import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { memo } from 'react';

interface Props {
  id: string;
  name: string;
}

export const TrackNameColumn = memo(({ id, name }: Props) => {
  return (
    <Link component={RouterLink} to={`/track/${id}`} color="#fff" py={1}>
      {name}
    </Link>
  );
});
