import { useCallback, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import jwt_decode from 'jwt-decode';
import { IconButton, Paper, Stack } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

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
import { TrackInfo } from './Player/TrackInfo';
import { PlaybackControl } from './Player/PlaybackControl';
import { PlaybackState } from '../types.d';

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

  // const { data = [], isLoading } = useQuery(['devices', tokenId], async () => {
  //   const res = await fetch(`/devices?tokenId=${tokenId}`);
  //   const body = await res.json();
  //   return body;
  // });
  console.log('trackPreview', trackPreview);

  const { time, start, pause, advanceTime, status } = useTimer();
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playerState, setPlayerState] = useRecoilState(playerStateAtom);

  const [meta, setMeta] = useState<Spotify.PlaybackContextMetadata | null>(
    null,
  );

  const h = useCallback(
    (playerState) => {
      console.log('player state changed:', playerState);
      setDuration(playerState.duration / 1000);

      setMeta(playerState.context.metadata);

      setPlayerState(
        playerState.paused ? PlaybackState.PAUSED : PlaybackState.PLAYING,
      );
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
    name: 'Discoverify',
    getOAuthToken: () => decoded?.accessToken,
    onPlayerStateChanged: h,
    volume,
  });

  const handlePlayPause = useCallback(() => {
    player?.togglePlay();
  }, [player]);

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
          <TrackInfo
            name={meta?.current_item.name}
            artists={meta?.current_item.artists}
            imageUrl={meta?.current_item.images[0].url}
          />
        </Grid2>

        <Grid2
          xs={4}
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Stack alignItems="center">
            <PlaybackControl
              state={playerState}
              onPlayPauseClick={handlePlayPause}
            />
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
