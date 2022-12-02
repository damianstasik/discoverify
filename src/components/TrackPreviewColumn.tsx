import { mdiPauseCircle, mdiPlayCircle } from '@mdi/js';
import Icon from '@mdi/react';
import IconButton from '@mui/material/IconButton';
import { useRecoilValue } from 'recoil';
import { playerStateAtom, playerTrackAtom } from '../store';
import { PlaybackState } from '../types.d';
import { CircularProgress } from '@mui/material';
import { useEventBus } from './EventBus';
import { CellContext } from '@tanstack/react-table';

export const TrackPreviewColumn = <Data extends { uri: string }>(
  props: CellContext<Data, unknown>,
) => {
  const { uri } = props.row.original;
  const eventBus = useEventBus();
  const playerTrack = useRecoilValue(playerTrackAtom);
  const isPlayingTrack = playerTrack?.uri === uri; // && trackPreview?.context === context
  const playerState = useRecoilValue(playerStateAtom);

  return isPlayingTrack && playerState === PlaybackState.LOADING ? (
    <CircularProgress size={24} sx={{ mx: 'auto' }} />
  ) : (
    <IconButton
      color={isPlayingTrack ? 'primary' : 'default'}
      onClick={() => eventBus.emit('playPauseTrack', uri)}
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
};
