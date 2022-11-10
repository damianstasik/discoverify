import {
  Avatar,
  Paper,
  Skeleton,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';

export const TrackChipSkeleton = () => {
  return (
    <Paper sx={{ p: 1, display: 'inline-flex', flexShrink: 0 }} elevation={3}>
      <Grid container spacing={1}>
        <Grid xs="auto">
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        </Grid>
        <Grid xs>
          <Typography variant="body2">
            <Skeleton width={180} />
          </Typography>
          <Typography variant="body2">
            <Skeleton width={110} />
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
