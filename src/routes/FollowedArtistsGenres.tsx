import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
import LoadingButton from '@mui/lab/LoadingButton';
import Skeleton from '@mui/material/Skeleton';
import { GridColumns, DataGridPro } from '@mui/x-data-grid-pro';
import { useAtomValue } from 'jotai/utils';
import { useQuery } from 'react-query';
import { tokenIdState } from '../store';
import { Layout } from '../components/Layout';

function ArtistCardSkeleton() {
  return (
    <Card>
      <Skeleton variant="rectangular" height={300} animation="wave" />
      <CardContent>
        <Typography variant="h6">
          <Skeleton animation="wave" />
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Skeleton variant="rectangular" animation="wave">
          <LoadingButton startIcon={<PersonAddTwoToneIcon />}>
            Follow
          </LoadingButton>
        </Skeleton>
      </CardActions>
    </Card>
  );
}

const columns: GridColumns = [
  { field: 'name', headerName: 'Name', width: 300, sortable: false },
  { field: 'count', headerName: 'Count', width: 100, sortable: false },
  {
    field: 'cos',
    headerName: 'Top tracks from genre',
    width: 300,
    sortable: false,
    renderCell: (params) => (
      <Button
        component={RouterLink}
        to={`/followed-artists/top-tracks?genre=${encodeURIComponent(
          params.row.name,
        )}`}
      >
        Top tracks
      </Button>
    ),
  },
];

async function fetchFollowedArtistsGenres(tokenId) {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/followed-artists/genres?tokenId=${tokenId}`,
  );

  const body = await res.json();

  return body;
}

export function FollowedArtistsGenres() {
  const tokenId = useAtomValue(tokenIdState);

  const { isLoading, data } = useQuery(
    ['followed-artists-genres', tokenId],
    () => fetchFollowedArtistsGenres(tokenId),
  );

  return (
    <Layout>
      <Typography variant="h5" gutterBottom>
        Artists from liked songs
      </Typography>

      {isLoading ? (
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <ArtistCardSkeleton />
          </Grid>
          <Grid item xs={3}>
            <ArtistCardSkeleton />
          </Grid>
          <Grid item xs={3}>
            <ArtistCardSkeleton />
          </Grid>
          <Grid item xs={3}>
            <ArtistCardSkeleton />
          </Grid>
          <Grid item xs={3}>
            <ArtistCardSkeleton />
          </Grid>
          <Grid item xs={3}>
            <ArtistCardSkeleton />
          </Grid>
          <Grid item xs={3}>
            <ArtistCardSkeleton />
          </Grid>
          <Grid item xs={3}>
            <ArtistCardSkeleton />
          </Grid>
          <Grid item xs={3}>
            <ArtistCardSkeleton />
          </Grid>
          <Grid item xs={3}>
            <ArtistCardSkeleton />
          </Grid>
        </Grid>
      ) : (
        <div style={{ height: 800, width: '100%' }}>
          <DataGridPro
            rows={data}
            columns={columns}
            getRowId={(a) => a.name}
            disableColumnSelector
            disableColumnMenu
          />
        </div>
      )}
    </Layout>
  );
}
