import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { memo } from 'react';

interface Props {
  artists: any[];
}

export const ArtistColumn = memo(({ artists }: Props) => {
  return (
    <Breadcrumbs sx={{ fontSize: 'inherit', py: 1 }} component="div">
      {artists.map((artist) => (
        <Link
          component={RouterLink}
          to={`/artist/${artist.id}`}
          key={artist.id}
          color="#fff"
        >
          {artist.name}
        </Link>
      ))}
    </Breadcrumbs>
  );
});
