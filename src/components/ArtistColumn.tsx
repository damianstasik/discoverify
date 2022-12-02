import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { CellContext } from '@tanstack/react-table';
import { Link as RouterLink } from 'react-router-dom';

interface Artist {
  id: string;
  name: string;
}

export const ArtistColumn = <Data extends { artists: Artist[] }>(
  props: CellContext<Data, Artist[]>,
) => {
  const artists = props.getValue();
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
};
