import { useCallback, useState } from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';
import { CallbackState } from 'react-spotify-web-playback';
import jwt_decode from 'jwt-decode';
import { Avatar, IconButton, Paper, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import DevicesIcon from '@mui/icons-material/Devices';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { useTimer } from 'use-timer';
import {
  trackPreviewState,
  loadingTrackPreview,
  tokenState,
  playerStateAtom,
  playerTrackAtom,
} from '../store';
import { useSpotifyWebPlaybackSdk } from '../hooks/useSpotifyWebPlaybackSdk';
import { VolumeControl } from './Player/VolumeControl';
import { SeekControl } from './Player/SeekControl';

export function Player() {
  const [trackPreview, setTrackPreview] = useRecoilState(trackPreviewState);
  const [playerTrack] = useRecoilState(playerTrackAtom);
  const [isLoadingTrackPreview, setLoadingTrackPreview] =
    useRecoilState(loadingTrackPreview);

  // const [playTrackPreviews, setPlayTrackPreviews] = useRecoilState(
  //   playTrackPreviewsState,
  // );
  // const [deviceId, setDeviceId] = useRecoilState(deviceIdState);
  const token = useRecoilValue(tokenState);
  const decoded = jwt_decode(token);

  // const { data: player } = useQuery(
  //   ['player', tokenId],
  //   async () => {
  //     const res = await fetch(
  //       `/player?tokenId=${tokenId}`,
  //     );
  //     const body = await res.json();
  //     return body;
  //   },
  //   {
  //     refetchInterval: 5000,
  //     enabled: !playTrackPreviews,
  //   },
  // );

  // const { data = [], isLoading } = useQuery(['devices', tokenId], async () => {
  //   const res = await fetch(`/devices?tokenId=${tokenId}`);
  //   const body = await res.json();
  //   return body;
  // });
  console.log('trackPreview', trackPreview);
  const callback = (state: CallbackState) => {
    if (state.isPlaying) {
      setTrackPreview((current) => ({ ...current, state: 'playing' }));
    } else if (!state.isPlaying) {
      setTrackPreview((current) => ({ ...current, state: 'paused' }));
    }

    console.log('s', trackPreview, state);
  };

  const { time, start, pause, advanceTime, status } = useTimer();
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playerState, setPlayerState] = useRecoilState(playerStateAtom);

  const [meta, setMeta] = useState<Spotify.PlaybackContextMetadata | null>(
    null,
  );
  console.log('t', time);
  const h = useCallback(
    (playerState) => {
      console.log('player state changed:', playerState);
      setDuration(playerState.duration / 1000);

      setMeta(playerState.context.metadata);

      setPlayerState(playerState.paused ? 'paused' : 'playing');
      console.log('time', time, playerState.position / 1000);
      advanceTime(playerState.position / 1000 - time);

      if (playerState.paused && status === 'RUNNING') {
        pause();
      }

      if (!playerState.paused && status !== 'RUNNING') {
        start();
      }
    },
    [time, status],
  );

  const {
    deviceId,

    player,
    isReady,
  } = useSpotifyWebPlaybackSdk({
    name: 'Discoverify', // Device that shows up in the spotify devices list
    getOAuthToken: () => decoded?.accessToken,
    onPlayerStateChanged: h,
    volume,
  });

  const handlePlayPause = () => {
    player?.togglePlay();
  };

  const handlePositionChange = useCallback(
    (v) => advanceTime(v - time),
    [time],
  );

  const handlePositionCommit = useCallback(
    (v) => player?.seek(v * 1000),
    [player],
  );

  const handleVolumeCommit = useCallback((v) => player?.setVolume(v), [player]);

  return (
    <Paper elevation={3} sx={{ p: 1 }}>
      <Grid2 container spacing={2} alignItems="center">
        <Grid2 xs={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={meta?.current_item.images[0].url}
              variant="rounded"
              sx={{ width: 56, height: 56 }}
            />
            <Stack>
              <Typography color="white" fontWeight={600}>
                {meta?.current_item.name}
              </Typography>
              <Typography>
                {meta?.current_item.artists.map((a) => a.name).join(', ')}
              </Typography>
            </Stack>
          </Stack>
        </Grid2>

        <Grid2
          xs={4}
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Stack alignItems="center">
            <Stack spacing={1} direction="row" alignItems="center">
              <IconButton size="small">
                <ShuffleIcon fontSize="inherit" />
              </IconButton>
              <IconButton size="large">
                <SkipPreviousIcon fontSize="inherit" />
              </IconButton>
              <IconButton size="large" onClick={handlePlayPause}>
                {playerState === 'playing' ? (
                  <PauseCircleIcon fontSize="inherit" />
                ) : (
                  <PlayCircleIcon fontSize="inherit" />
                )}
              </IconButton>
              <IconButton size="large">
                <SkipNextIcon fontSize="inherit" />
              </IconButton>
              <IconButton size="small">
                <RepeatIcon fontSize="inherit" />
              </IconButton>
            </Stack>
            <SeekControl
              position={time}
              duration={duration}
              onChange={handlePositionChange}
              onCommit={handlePositionCommit}
            />
          </Stack>
        </Grid2>

        <Grid2
          xs={3}
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <VolumeControl
            volume={volume}
            onChange={setVolume}
            onCommit={handleVolumeCommit}
          />
        </Grid2>
        <Grid2 xs={2}>
          <IconButton>
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton>
            <QueueMusicIcon />
          </IconButton>
          <IconButton>
            <DevicesIcon />
          </IconButton>
        </Grid2>
      </Grid2>
    </Paper>
  );
}
