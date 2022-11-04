import { Avatar, Breadcrumbs, Stack, Typography, Link } from '@mui/material';
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  name: string | undefined;
  artists: any[] | undefined;
  imageUrl: string | undefined;
}

function ArtistLink({ id, name }) {
  return (
    <Link component={RouterLink} to={`/artist/${id}`} color="#fff">
      {name}
    </Link>
  );
}

export const TrackInfo = memo(({ name, artists, imageUrl }: Props) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar src={imageUrl} variant="rounded" sx={{ width: 56, height: 56 }} />
      <Stack>
        <Typography color="white" fontWeight={600}>
          {name}
        </Typography>
        <Breadcrumbs sx={{ fontSize: 'inherit', py: 1 }} component="div">
          {artists?.map((artist) => (
            <ArtistLink id={artist.id} name={artist.name} key={artist.id} />
          ))}
        </Breadcrumbs>
      </Stack>
    </Stack>
  );
});
