import { RemoveCircle } from '@mui/icons-material';
import { Avatar, IconButton, Link, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Link as RouterLink } from 'react-router-dom';

export const TrackChip = ({ id, name, artists, imageUrl }) => {
  return (
    <Paper sx={{ p: 1, display: 'inline-flex' }} elevation={3}>
      <Grid container spacing={1}>
        <Grid xs="auto">
          <Avatar variant="rounded" src={imageUrl} />
        </Grid>
        <Grid xs>
          <Typography
            variant="body2"
            color="white"
            component={RouterLink}
            to={`/track/${id}`}
          >
            {name}
          </Typography>
          <Typography variant="body2">
            {artists.map((ar) => (
              <Link component={RouterLink} to={`/artist/${ar.id}`}>
                {ar.name}
              </Link>
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
