import { memo } from 'react';
import { PlaybackState } from '../../types.d';
import { IconButton } from '../IconButton';
import {
  mdiPauseCircle,
  mdiPlayCircle,
  mdiRepeat,
  mdiShuffle,
  mdiSkipNext,
  mdiSkipPrevious,
} from '@mdi/js';

interface Props {
  state: PlaybackState | null;
  onPlayPauseClick: () => void;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

export const PlaybackControl = memo(
  ({ state, onPlayPauseClick, onNextClick, onPreviousClick }: Props) => {
    return (
      <div className="gap-2 flex items-center text-white">
        <IconButton icon={mdiShuffle} />

        <IconButton icon={mdiSkipPrevious} onClick={onPreviousClick} />

        <IconButton
          icon={
            state === PlaybackState.PLAYING ? mdiPauseCircle : mdiPlayCircle
          }
          onClick={onPlayPauseClick}
          className="s-10"
        />

        <IconButton icon={mdiSkipNext} onClick={onNextClick} />

        <IconButton icon={mdiRepeat} />
      </div>
    );
  },
);
