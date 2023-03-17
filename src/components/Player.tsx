import { useCallback, useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import jwt_decode from 'jwt-decode';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  trackPreviewState,
  loadingTrackPreview,
  tokenState,
  playerStateAtom,
  playerTrackAtom,
  playerVolumeAtom,
  queueVisibilityAtom,
} from '../store';
import { useSpotifyWebPlaybackSdk } from '../hooks/useSpotifyWebPlaybackSdk';
import { VolumeControl } from './Player/VolumeControl';
import { SeekControl } from './Player/SeekControl';
import { TrackInfo } from './Player/TrackInfo';
import { PlaybackControl } from './Player/PlaybackControl';
import { PlaybackState } from '../types.d';
import { useTimer } from '../hooks/useTimer';
import { saveTrack } from '../api';
import { useThrottledCallback } from 'use-debounce';
import { IconButton } from './IconButton';
import { mdiDevices, mdiHeartOutline, mdiPlaylistMusicOutline } from '@mdi/js';

export function Player() {
  const [trackPreview, setTrackPreview] = useRecoilState(trackPreviewState);
  const [playerTrack, setPlayerTrack] = useRecoilState(playerTrackAtom);
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
  const setIsQueueOpen = useSetRecoilState(queueVisibilityAtom);

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
    setPlayerTrack(meta?.current_item ?? null);
  }, [meta]);

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

  const handlePrevious = useCallback(() => {
    player?.previousTrack();
  }, [player]);

  const handleNext = useCallback(() => {
    player?.nextTrack();
  }, [player]);

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

  const changeVolume = useCallback(
    (v) => {
      player?.setVolume(v);
    },
    [player],
  );

  const handleVolumeCommit = useCallback(
    (v) => {
      changeVolume(v);
      setIsChangingVolume(false);
    },
    [changeVolume],
  );

  const thottledVolumeChange = useThrottledCallback(changeVolume, 100);

  const handleVolumeChange = useCallback(
    (v) => {
      setIsChangingVolume(true);
      setVolume(v);
      thottledVolumeChange(v);
    },
    [thottledVolumeChange],
  );

  const { mutate: saveTrackMut } = useMutation(saveTrack);

  return (
    <div className="bg-[#222] flex px-3 py-2">
      <div className="flex gap-2 items-center w-full">
        <div className="w-3/12">
          <TrackInfo
            name={meta?.current_item.name}
            artists={meta?.current_item.artists}
            imageUrl={meta?.current_item.images[0].url}
          />
        </div>

        <div className="w-4/12 justify-center flex flex-col">
          <div className="flex flex-col items-center">
            <PlaybackControl
              state={playerState}
              onPlayPauseClick={handlePlayPause}
              onNextClick={handleNext}
              onPreviousClick={handlePrevious}
            />
            <SeekControl
              position={time}
              duration={duration}
              onChange={handlePositionChange}
              onCommit={handlePositionCommit}
            />
          </div>
        </div>

        <div className="w-3/12 justify-center flex flex-col">
          <VolumeControl
            volume={volume}
            onChange={handleVolumeChange}
            onCommit={handleVolumeCommit}
          />
        </div>
        <div className="w-2/12">
          <IconButton icon={mdiHeartOutline} />
          <IconButton
            icon={mdiPlaylistMusicOutline}
            onClick={() => setIsQueueOpen(true)}
          />
          <IconButton icon={mdiDevices} />
        </div>
      </div>
    </div>
  );
}
