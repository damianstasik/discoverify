import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useRecoilState, useRecoilValue } from 'recoil';
import { QueryFunction, useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { mdiPauseCircle, mdiPlayCircle } from '@mdi/js';
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

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function Track({ track }) {
  const [trackPreview, setTrackPreview] = useRecoilState(trackPreviewState);

  const isLoadingTrackPreview = useRecoilValue(loadingTrackPreview);

  const isCurrentlyPlaying = (t) =>
    trackPreview?.url === t.preview_url && trackPreview?.context === t;

  const playPreview = (t) =>
    setTrackPreview({
      url: t.preview_url,
      context: t,
      state: 'playing',
    });

  return (
    <ListItem disableGutters>
      <ListItemAvatar>
        <IconButton
          aria-label="Play"
          disabled={isLoadingTrackPreview}
          onClick={() => playPreview(track)}
          color={isCurrentlyPlaying(track) ? 'primary' : 'default'}
        >
          <Icon
            path={isCurrentlyPlaying(track) ? mdiPauseCircle : mdiPlayCircle}
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
            color="#fff"
            underline="hover"
          >
            {track.name}
          </Link>
        }
        secondaryTypographyProps={{
          component: 'div',
        }}
        secondary={
          <Breadcrumbs sx={{ fontSize: 'inherit' }}>
            {track.artists.map((artist) => (
              <Link
                component={RouterLink}
                to={`/artist/${artist.id}`}
                key={artist.id}
                color="rgba(255, 255, 255, 0.7)"
                underline="hover"
              >
                {artist.name}
              </Link>
            ))}
          </Breadcrumbs>
        }
      />
    </ListItem>
  );
}

function ArtistSkeleton() {
  const width = getRandomArbitrary(10, 40);

  return (
    <ListItem disableGutters>
      <ListItemButton disableGutters>
        <ListItemAvatar>
          <Skeleton
            animation="wave"
            width={40}
            height={40}
            variant="circular"
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Skeleton animation="wave" variant="text" width={`${width}%`} />
          }
        />
      </ListItemButton>
    </ListItem>
  );
}

function TrackSkeleton() {
  const width1 = getRandomArbitrary(20, 60);
  const width2 = getRandomArbitrary(20, 60);

  return (
    <ListItem disableGutters>
      <ListItemAvatar sx={{ alignItems: 'center' }}>
        <IconButton disabled aria-label="Play">
          <Skeleton
            animation="wave"
            width={24}
            height={24}
            variant="circular"
          />
        </IconButton>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Skeleton animation="wave" variant="text" width={`${width1}%`} />
        }
        secondary={
          <Skeleton animation="wave" variant="text" width={`${width2}%`} />
        }
      />
    </ListItem>
  );
}

interface StatsResponse {
  likedTracksSpotify: number;
  likedTracks: number;
  followedArtistsSpotify: number;
  followedArtists: number;
  topTracks: any[];
  recentlyPlayedTrack: any;
  topArtists: any[];
}

const statsQuery: QueryFunction<StatsResponse, string[]> = async ({
  queryKey,
  signal,
}) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/user/stats`, {
    signal,
    headers: {
      Authorization: `Bearer ${queryKey[1]}`,
    },
  });

  const body = await res.json();

  return body;
};

export default function Dashboard() {
  const token = useRecoilValue(tokenState);

  const { data, isLoading } = useQuery(['stats', token], statsQuery);

  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <Card sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="h5" sx={{ mb: 1.5, color: '#fff' }}>
            Liked tracks
          </Typography>
          <Typography variant="h6" color="#fff">
            {isLoading ? (
              <Skeleton animation="wave" width="15%" />
            ) : (
              data?.likedTracksSpotify ?? 'N/A'
            )}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            on Spotify
          </Typography>
          <Typography variant="h6" color="#fff">
            {isLoading ? (
              <Skeleton animation="wave" width="15%" />
            ) : (
              data?.likedTracks ?? 'N/A'
            )}
          </Typography>
          <Typography color="text.secondary">through Discoverify</Typography>

          <Button
            size="small"
            component={RouterLink}
            to="/liked"
            disabled={isLoading}
            sx={{ mt: 2, px: 1, py: 0.5, ml: -1 }}
          >
            All liked tracks
          </Button>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="h5" sx={{ mb: 1.5, color: '#fff' }}>
            Followed artists
          </Typography>
          <Typography variant="h6" color="#fff">
            {isLoading ? (
              <Skeleton animation="wave" width="15%" />
            ) : (
              data?.followedArtistsSpotify ?? 'N/A'
            )}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            on Spotify
          </Typography>
          <Typography variant="h6">
            {isLoading ? (
              <Skeleton animation="wave" width="15%" />
            ) : (
              data?.followedArtists ?? 'N/A'
            )}
          </Typography>
          <Typography color="text.secondary">through Discoverify</Typography>

          <Button
            size="small"
            component={RouterLink}
            to="/artists"
            disabled={isLoading}
            sx={{ mt: 2, px: 1, py: 0.5, ml: -1 }}
          >
            All followed artists
          </Button>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card sx={{ p: 2, pb: 1.5 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{ color: '#fff', mb: 1.5 }}
          >
            Recently played track
          </Typography>
          <List dense disablePadding>
            {isLoading && <TrackSkeleton />}
            {!isLoading && <Track track={data?.recentlyPlayedTrack?.track} />}
          </List>

          <Button
            size="small"
            component={RouterLink}
            to="/recently-played"
            disabled={isLoading}
            sx={{ mt: 2, px: 1, py: 0.5, ml: -1 }}
          >
            More recently played tracks
          </Button>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="h5" component="div" sx={{ color: '#fff' }}>
            Top 5 artists
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            based on listening history
          </Typography>
          <List dense disablePadding>
            {isLoading && (
              <>
                <ArtistSkeleton />
                <ArtistSkeleton />
                <ArtistSkeleton />
                <ArtistSkeleton />
                <ArtistSkeleton />
              </>
            )}
            {data?.topArtists.map((artist) => (
              <ListItem disableGutters key={artist.id}>
                <ListItemButton
                  disableGutters
                  component={RouterLink}
                  to={`/artist/${artist.id}`}
                  sx={{ px: 1, borderRadius: 1, mx: -1 }}
                >
                  <ListItemAvatar>
                    <Avatar alt={artist.name} src={artist.images[0].url} />
                  </ListItemAvatar>
                  <ListItemText primary={artist.name} sx={{ color: '#fff' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Button
            size="small"
            component={RouterLink}
            to="/top-artists"
            disabled={isLoading}
            sx={{ mt: 2, px: 1, py: 0.5, ml: -1 }}
          >
            All top artists
          </Button>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="h5" component="div" sx={{ color: '#fff' }}>
            Top 5 tracks
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            based on listening history
          </Typography>
          <List dense disablePadding>
            {isLoading && (
              <>
                <TrackSkeleton />
                <TrackSkeleton />
                <TrackSkeleton />
                <TrackSkeleton />
                <TrackSkeleton />
              </>
            )}
            {data?.topTracks.map((track) => (
              <Track track={track} key={track.id} />
            ))}
          </List>

          <Button
            size="small"
            component={RouterLink}
            to="/top-tracks"
            disabled={isLoading}
            sx={{ mt: 2, px: 1, py: 0.5, ml: -1 }}
          >
            All top tracks
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
}
