import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useAtomValue } from 'jotai/utils';
import { useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { tokenIdState } from '../store';

export default function Dashboard() {
  const tokenId = useAtomValue(tokenIdState);

  const { data } = useQuery(['stats'], async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/stats?tokenId=${tokenId}`,
    );

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
                {data?.likedTracks || <Skeleton />}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/liked">
                All liked tracks
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
