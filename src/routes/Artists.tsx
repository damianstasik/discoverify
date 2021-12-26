import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import PlayCircleFilledTwoToneIcon from '@mui/icons-material/PlayCircleFilledTwoTone';
import StopCircleTwoToneIcon from '@mui/icons-material/StopCircleTwoTone';
import Skeleton from '@mui/material/Skeleton';
import CardActionArea from '@mui/material/CardActionArea';
import { useAtomValue } from 'jotai/utils';
import { useAtom } from 'jotai';
import { tokenIdState, trackPreviewState } from '../store';
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

function ArtistCard({ artist }: { artist: any }) {
  const [isLoading, setLoading] = useState(false);
  const [isFollowing, setFollowingState] = useState(false);
  const tokenId = useAtomValue(tokenIdState);
  const [trackPreview, setTrackPreview] = useAtom(trackPreviewState);
  const handleFollow = () => {
    setLoading(true);

    fetch(
      `${import.meta.env.VITE_API_URL}/follow?tokenId=${tokenId}&artistId=${
        artist.id
      }`,
      { method: 'put' },
    )
      .then((res) => res.json())
      .then(() => {
        setLoading(false);
        setFollowingState(true);
      });
  };
  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/artist/${artist.id}`}>
        <CardMedia
          sx={{
            height: 300,
          }}
          src={artist.images.length > 1 ? artist.images[1].url : ''}
          title={artist.name}
          component="img"
          loading="lazy"
        />
      </CardActionArea>
      <CardContent>
        <Typography variant="h6">{artist.name}</Typography>

        <List dense>
          {artist.tracks.map((tr: any) => (
            <ListItem key={tr.id} disableGutters>
              <ListItemText
                primary={tr.name}
                secondary={tr.artists.map((a) => a.name).join(', ')}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() =>
                    setTrackPreview({ url: tr.preview_url, context: artist })
                  }
                >
                  {tr.preview_url === trackPreview?.url &&
                  trackPreview?.context === artist ? (
                    <StopCircleTwoToneIcon />
                  ) : (
                    <PlayCircleFilledTwoToneIcon />
                  )}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions disableSpacing>
        <LoadingButton
          onClick={handleFollow}
          sx={{ color: 'green' }}
          loading={isLoading}
          startIcon={<PersonAddTwoToneIcon />}
          loadingPosition="start"
        >
          {isFollowing ? 'Following' : 'Follow'}
        </LoadingButton>
        {/* <Button
          className="mt-auto"
          icon={isFollowing ? undefined : 'add'}
          intent={isFollowing ? 'success' : 'none'}
          active={isFollowing}
          loading={isLoading}
          onClick={handleFollow}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button> */}
      </CardActions>
    </Card>
  );
}

export function Artists() {
  const [isLoading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);
  const tokenId = useAtomValue(tokenIdState);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/artists?tokenId=${tokenId}`)
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        setArtists(res.artists);
      });
  }, []);

  return (
    <Layout>
      <Typography variant="h5" gutterBottom>
        Artists from liked songs
      </Typography>

      <Grid container spacing={3}>
        {isLoading ? (
          <>
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
          </>
        ) : (
          artists.map((artist: any) => (
            <Grid item xs={3} key={artist.id}>
              <ArtistCard artist={artist} />
            </Grid>
          ))
        )}
      </Grid>
    </Layout>
  );
}
