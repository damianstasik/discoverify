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
import { PlaybackState } from '../types.d';
import { CircularProgress } from '@mui/material';
import { useGridApiContext } from '@mui/x-data-grid-premium';

interface Props {
  track: any | null;
}

export const TrackPreviewColumn = memo(({ track }: Props) => {
  const apiRef = useGridApiContext();
  const playerTrack = useRecoilValue(playerTrackAtom);
  const isPlayingTrack = playerTrack?.uri === track?.uri; // && trackPreview?.context === context
  const playerState = useRecoilValue(playerStateAtom);

  return isPlayingTrack && playerState === PlaybackState.LOADING ? (
    <CircularProgress size={24} sx={{ mx: 'auto' }} />
  ) : (
    <IconButton
      color={isPlayingTrack ? 'primary' : 'default'}
      onClick={() => apiRef.current.publishEvent('playPauseTrack', track)}
      aria-label={isPlayingTrack ? 'Pause' : 'Play'}
    >
      <Icon
        path={
          isPlayingTrack && playerState === PlaybackState.PLAYING
            ? mdiPauseCircle
            : mdiPlayCircle
        }
        size={1}
      />
    </IconButton>
  );
});
