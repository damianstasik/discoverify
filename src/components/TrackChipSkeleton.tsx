import {
  Avatar,
  Paper,
  Skeleton,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';

export const TrackChipSkeleton = () => {
  return (
    <Paper sx={{ p: 0.5, display: 'inline-flex', flexShrink: 0 }} elevation={3}>
      <Grid container spacing={1}>
        <Grid xs="auto">
          <Skeleton variant="circular">
            <Avatar sx={{ width: 32, height: 32 }} />
          </Skeleton>
        </Grid>
        <Grid xs>
          <Typography variant="body2" fontSize={12}>
            <Skeleton width={180} />
          </Typography>
          <Typography variant="body2" fontSize={12}>
            <Skeleton width={110} />
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
