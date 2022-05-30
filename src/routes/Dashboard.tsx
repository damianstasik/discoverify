import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useAtomValue } from 'jotai';
import { useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Layout } from '../components/Layout';
import { tokenState } from '../store';

export default function Dashboard() {
  const token = useAtomValue(tokenState);

  const { data, isLoading } = useQuery(['stats'], async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const body = await res.json();

    return body;
  });

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Liked tracks
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                through Discoverify
              </Typography>
              <Typography variant="h6">
                {isLoading ? <Skeleton /> : data?.likedTracks ?? 'N/A'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/liked">
                All liked tracks
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Followed artists
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                through Discoverify
              </Typography>
              <Typography variant="h6">
                {isLoading ? <Skeleton /> : data?.followedArtists ?? 'N/A'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/artists">
                All followed artists
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Recently played track
              </Typography>
              <Typography sx={{ mt: 1.5 }} variant="h6">
                {isLoading ? (
                  <Skeleton />
                ) : (
                  <Breadcrumbs sx={{ fontSize: 'inherit' }}>
                    {data?.recentlyPlayedTrack?.track.artists.map((artist) => (
                      <Link
                        component={RouterLink}
                        to={`/artist/${artist.id}`}
                        key={artist.id}
                      >
                        {artist.name}
                      </Link>
                    ))}
                  </Breadcrumbs>
                )}
              </Typography>
              <Typography variant="subtitle1">
                {isLoading ? (
                  <Skeleton />
                ) : (
                  <Link
                    component={RouterLink}
                    to={`/track/${data?.recentlyPlayedTrack?.track.id}`}
                    key={data?.recentlyPlayedTrack?.track.id}
                  >
                    {data?.recentlyPlayedTrack?.track.name}
                  </Link>
                )}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/recently-played">
                More recently played tracks
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
