import { IconButton, Stack } from '@mui/material';
import {
  PlayCircle,
  PauseCircle,
  SkipPrevious,
  SkipNext,
  Shuffle,
  Repeat,
} from '@mui/icons-material';
import { memo } from 'react';
import { PlaybackState } from '../../types.d';

interface Props {
  state: PlaybackState | null;
  onPlayPauseClick: () => void;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

export const PlaybackControl = memo(
  ({ state, onPlayPauseClick, onNextClick, onPreviousClick }: Props) => {
    return (
      <Stack spacing={1} direction="row" alignItems="center">
        <IconButton size="small">
          <Shuffle fontSize="inherit" />
        </IconButton>
        <IconButton size="large" onClick={onPreviousClick}>
          <SkipPrevious fontSize="inherit" />
        </IconButton>
        <IconButton size="large" onClick={onPlayPauseClick}>
          {state === PlaybackState.PLAYING ? (
            <PauseCircle fontSize="inherit" />
          ) : (
            <PlayCircle fontSize="inherit" />
          )}
        </IconButton>
        <IconButton size="large" onClick={onNextClick}>
          <SkipNext fontSize="inherit" />
        </IconButton>
        <IconButton size="small">
          <Repeat fontSize="inherit" />
        </IconButton>
      </Stack>
    );
  },
);
