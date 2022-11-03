import { mdiPauseCircle, mdiPlayCircle } from '@mdi/js';
import Icon from '@mdi/react';
import IconButton from '@mui/material/IconButton';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { memo } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  deviceIdAtom,
  loadingTrackPreview,
  playerStateAtom,
  playerTrackAtom,
  tokenState,
  trackPreviewState,
} from '../store';

interface Props {
  track: any | null;
}

export const TrackPreviewColumn = memo(({ track }: Props) => {
  const [playerTrack, setPlayerTrack] = useRecoilState(playerTrackAtom);
  const [trackPreview, setTrackPreview] = useRecoilState(trackPreviewState);
  const isLoadingTrackPreview = useRecoilValue(loadingTrackPreview);
  const token = useRecoilValue(tokenState);
  const isPlayerTrack = playerTrack?.uri === track?.uri; // && trackPreview?.context === context
  const [playerState, setPlayerState] = useRecoilState(playerStateAtom);
  const deviceId = useRecoilValue(deviceIdAtom);

  const { mutate } = useMutation(async (track) => {
    await fetch(
      `${import.meta.env.VITE_API_URL}/track/${
        track.uri
      }/play?deviceId=${deviceId}`,
      {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  });

  if (!track) {
    return null;
  }

  const handleClick = () => {
    setPlayerState('loading');
    setPlayerTrack(track);
    mutate(track);
  };

  return (
    <IconButton
      color={isPlayerTrack ? 'primary' : 'default'}
      onClick={handleClick}
      disabled={isPlayerTrack && playerState === 'loading'}
      aria-label={isPlayerTrack ? 'Pause' : 'Play'}
    >
      <Icon
        path={
          isPlayerTrack && playerState === 'playing'
            ? mdiPauseCircle
            : mdiPlayCircle
        }
        size={1}
      />
    </IconButton>
  );
});
