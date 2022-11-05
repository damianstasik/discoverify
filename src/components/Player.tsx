import { useCallback, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import jwt_decode from 'jwt-decode';
import { IconButton, Paper, Stack } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useQuery } from '@tanstack/react-query';
import DevicesIcon from '@mui/icons-material/Devices';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import {
  trackPreviewState,
  loadingTrackPreview,
  tokenState,
  playerStateAtom,
  playerTrackAtom,
  playerVolumeAtom,
} from '../store';
import { useSpotifyWebPlaybackSdk } from '../hooks/useSpotifyWebPlaybackSdk';
import { VolumeControl } from './Player/VolumeControl';
import { SeekControl } from './Player/SeekControl';
import { TrackInfo } from './Player/TrackInfo';
import { PlaybackControl } from './Player/PlaybackControl';
import { PlaybackState } from '../types.d';
import { useTimer } from '../hooks/useTimer';

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

  const { time, start, pause, set, status } = useTimer('player');
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useRecoilState(playerVolumeAtom);
  const [isChangingVolume, setIsChangingVolume] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [playerState, setPlayerState] = useRecoilState(playerStateAtom);

  const [meta, setMeta] = useState<Spotify.PlaybackContextMetadata | null>(
    null,
  );

  const h = useCallback<Spotify.PlaybackStateListener>(
    (state) => {
      setDuration(state.duration / 1000);
      setMeta(state.context.metadata);

      setPlayerState(
        state.paused ? PlaybackState.PAUSED : PlaybackState.PLAYING,
      );

      set(state.position / 1000);

      if (state.paused && status === 'RUNNING') {
        pause();
      }

      if (!state.paused && status !== 'RUNNING') {
        start();
      }
    },
    [status],
  );

  useEffect(() => {
    if (isSeeking && status === 'RUNNING') {
      pause();
    }
  }, [isSeeking, status]);

  const { deviceId, player } = useSpotifyWebPlaybackSdk({
    name: 'Discoverify',
    getOAuthToken: () => decoded?.accessToken,
    onPlayerStateChanged: h,
    volume,
  });

  useQuery<number>(['volume', deviceId], async () => player!.getVolume(), {
    enabled:
      player !== null &&
      playerState === PlaybackState.PLAYING &&
      !isChangingVolume,
    refetchInterval: 2500,
    onSuccess(data) {
      setVolume(data);
    },
  });

  const handlePlayPause = useCallback(() => {
    player?.togglePlay();
  }, [player]);

  const handlePositionChange = useCallback((v) => {
    set(v);
    setIsSeeking(true);
  }, []);

  const handlePositionCommit = useCallback(
    (v) => {
      player?.seek(v * 1000);
      setIsSeeking(false);
    },
    [player],
  );

  const handleVolumeCommit = useCallback(
    (v) => {
      player?.setVolume(v);
      setIsChangingVolume(false);
    },
    [player],
  );

  const handleVolumeChange = useCallback((v) => {
    setIsChangingVolume(true);
    setVolume(v);
  }, []);

  const { mutate: saveTrackMut } = useMutation(saveTrack);

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
            onChange={handleVolumeChange}
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
