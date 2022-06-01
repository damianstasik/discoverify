import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useAtom, useAtomValue } from 'jotai';
import { useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { mdiPauseCircleOutline, mdiPlayCircleOutline } from '@mdi/js';
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import Icon from '@mdi/react';
import { loadingTrackPreview, tokenState, trackPreviewState } from '../store';

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

  const [trackPreview, setTrackPreview] = useAtom(trackPreviewState);
  const isLoadingTrackPreview = useAtomValue(loadingTrackPreview);

  const isCurrentlyPlaying = (track) =>
    trackPreview?.url === track.preview_url && trackPreview?.context === track;

  const playPreview = (track) =>
    setTrackPreview({
      url: track.preview_url,
      context: track,
      state: 'playing',
    });

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 1.5 }}>
              Liked tracks
            </Typography>
            <Typography variant="h6">
              {isLoading ? (
                <Skeleton width="15%" />
              ) : (
                data?.likedTracksSpotify ?? 'N/A'
              )}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              on Spotify
            </Typography>
            <Typography variant="h6">
              {isLoading ? (
                <Skeleton width="15%" />
              ) : (
                data?.likedTracks ?? 'N/A'
              )}
            </Typography>
            <Typography color="text.secondary">through Discoverify</Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              component={RouterLink}
              to="/liked"
              disabled={isLoading}
            >
              All liked tracks
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 1.5 }}>
              Followed artists
            </Typography>
            <Typography variant="h6">
              {isLoading ? (
                <Skeleton width="15%" />
              ) : (
                data?.followedArtistsSpotify ?? 'N/A'
              )}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              on Spotify
            </Typography>
            <Typography variant="h6">
              {isLoading ? (
                <Skeleton width="15%" />
              ) : (
                data?.followedArtists ?? 'N/A'
              )}
            </Typography>
            <Typography color="text.secondary">through Discoverify</Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              component={RouterLink}
              to="/artists"
              disabled={isLoading}
            >
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
            <Button
              size="small"
              component={RouterLink}
              to="/recently-played"
              disabled={isLoading}
            >
              More recently played tracks
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Top 5 artists
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              based on listening history
            </Typography>
            <List dense disablePadding>
              {isLoading && (
                <ListItem disableGutters>
                  <ListItemButton disableGutters>
                    <ListItemAvatar>
                      <Skeleton width={40} height={40} variant="circular" />
                    </ListItemAvatar>
                    <ListItemText primary={<Skeleton variant="text" />} />
                  </ListItemButton>
                </ListItem>
              )}
              {data?.topArtists.map((artist) => (
                <ListItem disableGutters key={artist.id}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    to={`/artist/${artist.id}`}
                  >
                    <ListItemAvatar>
                      <Avatar alt={artist.name} src={artist.images[0].url} />
                    </ListItemAvatar>
                    <ListItemText primary={artist.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              component={RouterLink}
              to="/top-artists"
              disabled={isLoading}
            >
              All top artists
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Top 5 tracks
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              based on listening history
            </Typography>
            <List dense disablePadding>
              {isLoading && (
                <ListItem disableGutters>
                  <ListItemAvatar sx={{ alignItems: 'center' }}>
                    <IconButton disabled aria-label="Play">
                      <Skeleton width={24} height={24} variant="circular" />
                    </IconButton>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Skeleton variant="text" />}
                    secondary={<Skeleton variant="text" width="70%" />}
                  />
                </ListItem>
              )}
              {data?.topTracks.map((track) => (
                <ListItem disableGutters key={track.id}>
                  <ListItemAvatar>
                    <IconButton
                      aria-label="Play"
                      disabled={isLoadingTrackPreview}
                      onClick={() => playPreview(track)}
                      color={isCurrentlyPlaying(track) ? 'primary' : 'default'}
                    >
                      <Icon
                        path={
                          isCurrentlyPlaying(track)
                            ? mdiPauseCircleOutline
                            : mdiPlayCircleOutline
                        }
                        size={1}
                      />
                    </IconButton>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Link
                        component={RouterLink}
                        to={`/track/${track.id}`}
                        sx={{ fontSize: '1rem' }}
                      >
                        {track.name}
                      </Link>
                    }
                    secondary={
                      <Breadcrumbs sx={{ fontSize: 'inherit' }}>
                        {track.artists.map((artist) => (
                          <Link
                            component={RouterLink}
                            to={`/artist/${artist.id}`}
                            key={artist.id}
                          >
                            {artist.name}
                          </Link>
                        ))}
                      </Breadcrumbs>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              component={RouterLink}
              to="/top-tracks"
              disabled={isLoading}
            >
              All top tracks
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
