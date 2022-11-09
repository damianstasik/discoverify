import { RemoveCircle } from '@mui/icons-material';
import {
  Avatar,
  IconButton,
  Link,
  Paper,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const TrackChip = ({ id, name, artists, imageUrl }) => {
  return (
    <Paper sx={{ p: 1, display: 'inline-flex', flexShrink: 0 }} elevation={3}>
      <Grid container spacing={1}>
        <Grid xs="auto">
          <Avatar variant="rounded" src={imageUrl} />
        </Grid>
        <Grid xs>
          <Typography variant="body2">
            <Link
              component={RouterLink}
              to={`/track/${id}`}
              color="#fff"
              underline="hover"
            >
              {name}
            </Link>
          </Typography>
          <Typography variant="body2">
            {artists.map((artist, index) => (
              <Fragment key={artist.id}>
                <Link
                  component={RouterLink}
                  to={`/artist/${artist.id}`}
                  color="gray.400"
                  underline="hover"
                >
                  {artist.name}
                </Link>
                {index < artists.length - 1 && <span> / </span>}
              </Fragment>
            ))}
          </Typography>
        </Grid>
        <Grid xs="auto">
          <IconButton aria-label="delete">
            <RemoveCircle />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};
